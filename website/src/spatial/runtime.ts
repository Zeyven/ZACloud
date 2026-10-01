import { passage } from "@/lib/passage";
import { lowerQuality, type QualityTier } from "@/lib/quality";
import { spatialBudgets } from "./quality";
import type { SpatialRenderer, SpatialStats } from "./types";

// One bounded WebGL2 scene; two procedural solids and one recessed light plane.
// No models, textures, postprocessing, dependencies or renderer APIs in React.
const vertex = `#version 300 es
precision highp float;
in vec3 position;
in vec3 normal;
uniform float aspect;
uniform float angle;
uniform float progress;
uniform vec3 size;
uniform float offset;
out vec3 vNormal;
out vec3 vPosition;
void main() {
  float opening = .24 + .04 * progress;
  vec3 p = position * size;
  p.y += offset * (2.5 + opening);
  if (offset == 0.) p.z -= 1.25;
  float c=cos(angle), s=sin(angle);
  mat3 rz=mat3(c,-s,0., s,c,0., 0.,0.,1.);
  float yaw=.13 + .035 * progress;
  mat3 ry=mat3(cos(yaw),0.,-sin(yaw), 0.,1.,0., sin(yaw),0.,cos(yaw));
  mat3 tilt=mat3(1.,0.,0., 0.,.992,-.126, 0.,.126,.992);
  mat3 rotation=tilt*ry*rz;
  p=rotation*p;
  vNormal=rotation*normal;
  vPosition=p;
  p.z -= 9.8 - .25 * progress;
  float f=2.05;
  gl_Position=vec4(p.x*f/aspect, p.y*f, -1.002*p.z-.2002, -p.z);
}`;
const fragment = `#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vPosition;
uniform float offset;
uniform float progress;
out vec4 color;
void main() {
  vec3 n=normalize(vNormal);
  vec3 view=normalize(vec3(0.,0.,10.)-vPosition);
  float light=max(dot(n,normalize(vec3(-.6,.8,1.2))),0.);
  float rim=pow(1.-max(dot(n,view),0.),3.);
  float grazing=max(dot(n,normalize(vec3(.15,-.1,-1.))),0.);
  vec3 graphite=vec3(.032,.034,.035) + light*vec3(.042,.043,.043);
  graphite+=rim*vec3(.07,.065,.055)+grazing*vec3(.15,.135,.105);
  float falloff=clamp(1.-length(vPosition.xy)/12.,.3,1.);
  graphite*=falloff;
  float side=1.-abs(n.z);
  graphite+=side*vec3(.18,.16,.125);
  vec2 field=vPosition.xy-vec2(-2.,2.);
  graphite+=vec3(.034,.035,.037)*exp(-.055*dot(field,field));
  vec3 pearl=vec3(.78,.735,.64) * (.8+.2*progress);
  color=vec4(offset==0. ? pearl : graphite,1.);
}`;
// A box is six quads / twelve triangles. The same buffer serves all three solids.
function boxVertices() {
  const data: number[] = [];
  const faces = [
    [
      [0, 0, 1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ],
    [
      [0, 0, -1],
      [1, -1, -1],
      [-1, -1, -1],
      [-1, 1, -1],
      [1, 1, -1],
    ],
    [
      [1, 0, 0],
      [1, -1, 1],
      [1, -1, -1],
      [1, 1, -1],
      [1, 1, 1],
    ],
    [
      [-1, 0, 0],
      [-1, -1, -1],
      [-1, -1, 1],
      [-1, 1, 1],
      [-1, 1, -1],
    ],
    [
      [0, 1, 0],
      [-1, 1, 1],
      [1, 1, 1],
      [1, 1, -1],
      [-1, 1, -1],
    ],
    [
      [0, -1, 0],
      [-1, -1, -1],
      [1, -1, -1],
      [1, -1, 1],
      [-1, -1, 1],
    ],
  ];
  for (const [normal, ...corners] of faces)
    for (const index of [0, 1, 2, 0, 2, 3])
      data.push(...corners[index].map((v) => v / 2), ...normal);
  return new Float32Array(data);
}
export function createSpatialRuntime(
  canvas: HTMLCanvasElement,
  initialTier: QualityTier,
  observe: (stats: SpatialStats) => void,
  onFallback: () => void,
  onEnd: () => void,
): SpatialRenderer {
  let gl: WebGL2RenderingContext | null = null,
    program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null,
    vao: WebGLVertexArrayObject | null = null;
  let tier = initialTier,
    disposed = false,
    running = false,
    frame = 0,
    frames = 0,
    elapsed = 0,
    last = 0,
    previous = 0,
    overruns = 0,
    pacingOverruns = 0,
    dpr = 1;
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const stats = (ms = 0): SpatialStats => ({
    tier,
    running,
    frames,
    frameMs: ms,
    drawCalls: 3,
    triangles: 36,
    geometries: 1,
    textures: 0,
    programs: 1,
    dpr,
    progress: Math.min(elapsed / 12000, 1),
  });
  const pause = () => {
    running = false;
    cancelAnimationFrame(frame);
    last = 0;
    previous = 0;
    observe(stats());
  };
  const fail = () => {
    pause();
    onFallback();
  };
  const contextLost = (e: Event) => {
    e.preventDefault();
    fail();
  };
  const resize = () => {
    if (!gl || disposed || gl.isContextLost()) return;
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, spatialBudgets[tier].dpr);
    // Cap total framebuffer area even on very large or high-DPR displays.
    dpr = Math.min(
      dpr,
      Math.sqrt(3000000 / Math.max(1, rect.width * rect.height)),
    );
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  const render = () => {
    if (!gl || !program || disposed || gl.isContextLost()) return;
    const start = performance.now();
    gl.clearColor(0.0196, 0.0196, 0.0235, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform1f(uniforms.aspect, canvas.width / canvas.height);
    gl.uniform1f(uniforms.angle, (passage.angleDegrees * Math.PI) / 180);
    gl.uniform1f(uniforms.progress, Math.min(elapsed / 12000, 1));
    for (const offset of [-1, 1, 0]) {
      gl.uniform1f(uniforms.offset, offset);
      gl.uniform3f(uniforms.size, 18, offset ? 5 : 0.7, offset ? 1.8 : 0.04);
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
    frames++;
    const duration = performance.now() - start;
    if (duration > 12) overruns++;
    else overruns = Math.max(0, overruns - 1);
    if (overruns >= 8 || pacingOverruns >= 8) {
      tier = lowerQuality(tier);
      overruns = 0;
      pacingOverruns = 0;
      if (tier === "low" || tier === "safe") {
        fail();
        return;
      }
      resize();
    }
    observe(stats(duration));
  };
  const tick = (now: number) => {
    if (!running || disposed) return;
    if (previous)
      pacingOverruns =
        now - previous > 55
          ? pacingOverruns + 1
          : Math.max(0, pacingOverruns - 1);
    previous = now;
    const interval = 1000 / spatialBudgets[tier].fps;
    if (!last || now - last >= interval - 1) {
      if (last) elapsed += Math.min(now - last, 100);
      last = now;
      render();
      if (elapsed >= 12000) {
        pause();
        onEnd();
        return;
      }
    }
    if (running) frame = requestAnimationFrame(tick);
  };
  const dispose = () => {
    if (disposed) return;
    pause();
    disposed = true;
    canvas.removeEventListener("webglcontextlost", contextLost);
    if (gl) {
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    }
    buffer = null;
    vao = null;
    program = null;
    gl = null;
    canvas.width = 1;
    canvas.height = 1;
  };
  return {
    async init() {
      if (disposed) return;
      if (tier === "low" || tier === "safe") throw new Error("Static tier");
      gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        powerPreference: "low-power",
        preserveDrawingBuffer: false,
      });
      if (!gl) throw new Error("WebGL2 unavailable");
      canvas.addEventListener("webglcontextlost", contextLost);
      const shaders: WebGLShader[] = [];
      try {
        program = gl.createProgram();
        if (!program) throw new Error("Program allocation failed");
        for (const [type, source] of [
          [gl.VERTEX_SHADER, vertex],
          [gl.FRAGMENT_SHADER, fragment],
        ] as const) {
          const shader = gl.createShader(type);
          if (!shader) throw new Error("Shader allocation failed");
          shaders.push(shader);
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw new Error("Shader compilation failed");
          gl.attachShader(program, shader);
        }
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
          throw new Error("Program link failed");
        for (const name of ["aspect", "angle", "progress", "size", "offset"])
          uniforms[name] = gl.getUniformLocation(program, name);
        buffer = gl.createBuffer();
        vao = gl.createVertexArray();
        if (!buffer || !vao) throw new Error("Geometry allocation failed");
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, boxVertices(), gl.STATIC_DRAW);
        for (const [name, offset] of [
          ["position", 0],
          ["normal", 12],
        ] as const) {
          const location = gl.getAttribLocation(program, name);
          gl.enableVertexAttribArray(location);
          gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 24, offset);
        }
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        resize();
        render();
      } catch (error) {
        for (const shader of shaders) gl?.deleteShader(shader);
        dispose();
        throw error;
      }
      for (const shader of shaders) gl.deleteShader(shader);
    },
    resize,
    render,
    pause,
    resume() {
      if (running || disposed || !gl || gl.isContextLost()) return;
      if (elapsed >= 12000) elapsed = 0;
      running = true;
      last = 0;
      previous = 0;
      frame = requestAnimationFrame(tick);
      observe(stats());
    },
    dispose,
  };
}
