# ZAITHE / 智行通心 — 无视频本地实现交付

依据完整217节Constitution v5.0及后续「一次性完成」「不放视频」指令。此报告描述当前实现，替代此前静态基础阶段报告。未部署、未改DNS、未发邮件、未创建PR。

## Repository Audit / Current Architecture

原仓库checkout只有历史README与法务文档，初始工作树干净。原始文件未修改。新应用独立位于 `website/`，根目录新增CI；完整文件清单见FILES_CHANGED.md。AGENTS、本地skills、旧应用源码均未在checkout出现。历史源码ZIP因网络问题传输失败，未谎称完成历史源码审计；审计边界见AUDIT.md。

Next.js 16.3.8 App Router、React 19.3.0、strict TypeScript 6.0.3、pnpm 11.19.0。22个双语静态页面，默认Server Components。交互边界为产品演示、Studio/Passage控制、运动偏好与联系编辑器。Canvas与WebGL2模块均在用户激活后才动态下载。

## Brand Migration / Media Policy

运行时品牌统一ZAITHE / 智行通心，canonical为zaithe.com。历史ZENTRA法务与归属文档保留原样。只有3个官方品牌SVG，没有普通图片、视频、外部装饰SVG、模型、纹理；截图仅为测试工件。新增Canvas是实时计算代码，不是媒体资产。

原图标ZIP仍未下载，但后来提供的8个独立SVG已完整读取、按原始文本恢复并实际渲染。下载失败与文本恢复明确区分。白色/炭色导航标志及黑曜石图标以原始字节用于Production副本，哈希锁定；原始文件名不改。Passage四条直边测量范围39.7491°–39.9019°，拟合主轴39.82166°，统一供CSS、SVG和Shader读取。详见PASSAGE.md。视频按最终指令永久排除本轮，不再作为阻塞或显示空播放器。

## Design System / Homepage Structure

1760px最大shell、16/12/8/4列token、黑曜石/石墨/珍珠/纸色、六档时间token、中英排印、自托管Inter Variable约48KB和Noto SC实际字符subset约122KB、导航/移动菜单/Footer、语言语义路径保持、metadata/hreflang/canonical/Organization schema、统一flags和route生成。

首页：黑色DOM品牌 → Identity → Manifesto → 通/光隙 → BUILD/CREATE/DISCOVER → AYRA示例 → Nexus/Space/Thera → Studio → Science → Company → Closing。产品详情各有不同操作逻辑，不是四个换色卡片。

## Phase 4 — Native Motion

实现原生CSS scroll-driven轻量位移，正文始终完整可见；不通过opacity隐藏内容。浏览器不支持时保持静态。Footer运动控制可关闭增强，系统reduced-motion同时生效。无滚动劫持、全站平滑滚动替换或动画库。

官方主轴现已用于Passage静态/空间构图；站点保留原生页面导航，没有额外引入路由动画。

## Phase 5 — Computational Visual

Studio使用唯一一套Canvas 2D轨迹构图，表达画框内的运动方向。用户主动开启，renderer动态导入；无自动播放。提供暂停与帧选择。静态CSS构图始终作为未激活、安全模式及失败回退。没有图片、影片、模型或真实客户作品。

质量策略读取viewport、DPR、CPU cores、Canvas可用性、reduced-motion、Save-Data及用户运动设置。ultra/high/medium/low/safe分别限制轨迹数、DPR和fps；最多40条×81采样点、24fps、DPR1.75。连续多次draw超过12ms自动降级。此有界工作量采用原生Canvas；未增加Worker依赖。

离屏、visibilitychange、用户暂停或运动偏好改变时取消render loop；卸载释放canvas backing buffer。开发观测通过data属性和QA脚本记录，不向访客暴露工程指标。

## Phase 6 — Spatial

IMPLEMENTED：一个原生WebGL2 SpatialRuntime，两个程序化实体与一道后置光隙；组件仅依赖renderer接口。用户主动开启后懒加载，12秒缓慢开启与镜头推进后停止，支持暂停/继续。无Three.js依赖、无外部模型/纹理。

ULTRA/HIGH/MEDIUM分别限制DPR1.75/1.5/1、30/30/24fps；LOW/SAFE使用同主轴静态构图。最大300万绘制像素、3次draw、36个三角形、1套几何、1个程序、0纹理。持续提交耗时/帧回调超预算自动降级。离屏或后台暂停；偏好变化、上下文丢失或着色器失败回退；卸载释放资源。DOM仍承载所有文字。

## Phase 7 — Software Proof

- AYRA：四步确定性DOM流程，明确DEMO及非实时推理。
- Nexus：选择示例来源，查看引用、关系与问题上下文。来源明确标为虚构示例。
- Space：键盘/触控调整层次、选择16:9或4:5、确认示例构图规格。没有生成图片或模型调用。
- Thera：人工确认清洁检查后才能执行示例房间可用状态转换；显示事件记录并可重置。不连接真实订单、支付或业务系统。

产品生命周期保持待核实，不把演示误写为已发布能力。

## Phase 8 — Studio

可操作Brief/Direction/Production/Review阶段，解释人的判断与浏览器计算职责。Canvas运动和帧选择作为同一主视觉，避免叠加多套特效。明确是构图研究，不是客户case或可下载生产成片。

## Phase 9 — Science

Life Sciences长期方向、科学知识关系与图示性质清楚。无药物/蛋白平台承诺，无虚构论文实验成果。未满足内容门槛的Research路由不生成。

## Contact / Legal / Security

联系页面仅本地准备消息，明确不发送、不保存；无JS时字段禁用，避免意外GET泄漏。服务端有字段验证、origin检查、honeypot、流式16KB上限、3秒读取超时、频率限制和错误响应。收件渠道未配置时返回503，不返回虚假成功。

法律主体和正式联系方式未知，隐私/条款为如实的预览说明。CSP、HSTS、nosniff、Referrer-Policy、Permissions-Policy已配置；静态Next内联脚本仍需unsafe-inline，生产nonce/hash策略、共享持久化限流和托管HTTPS待正式配置。

## Engineering Verification

最终结果以artifacts下实际日志为准：lint、typecheck、production build、media-policy、9项unit tests通过；Chromium交互/页面测试覆盖17项。测试包含原有22页/metadata/语言路径、四个产品DEMO、Studio懒加载、播放/暂停/离屏、reduced-motion、Save-Data、Canvas不可用、visibility事件暂停、触控、横竖屏、JS-off及联系失败关闭。

Axe检查覆盖中英文首页、联系页、Nexus/Space/Thera详情与Studio。自动检查不等于完整人工WCAG认证。

Firefox/WebKit官方浏览器下载被HTTP403 `Domain forbidden`阻止，未绕过；对应运行因二进制缺失BLOCKED。原生Safari/iOS Safari/Edge未运行，不以云端Chromium或WebKit代替验收。

## Desktop QA / Mobile QA

任务云端Chromium实际检查2560、1920、1728、1512、1440、1280、1024、834、768、430、393、375px。全部指定宽度检查与所有中文页面375px检查均运行。200%采用1440→720 CSS px等效重排，不冒称原生缩放认证。

## Visual QA（独立于工程PASS）

实际查看桌面/手机整页及Hero、Manifesto、Passage、软件、产品、Studio、Science截图。修复字体变量作用域、辅助文字对比度、图标缺字、手机Studio孤字、Space手机画幅固有尺寸溢出。滚动动效取消透明度变化以保证全过程文字对比度。

新交互截图显示：Nexus为来源/引用关系，Space为可控几何构图，Thera为人工确认驱动的状态变化，Studio为独立轨迹场和生产阶段；手机分别重排，没有缩小桌面或四卡模板。

官方Logo与实测Passage身份已补齐；静态、空间、桌面、手机、无JS和减少运动截图分别留存。工程通过不代替品牌最终审查，也不代表原生Safari/iOS已验收。

## Performance / Quality Evidence

`artifacts/runtime-qa.json`记录用户点击前后的JS请求，证实renderer在交互后单独下载；记录Canvas draw样本、p95和4倍CPU限速下tier。该数字仅为本地draw耗时，不是完整帧时、INP或真实用户数据。初次观测p95介于0.6–2.5ms，最终运行以JSON为准。

`artifacts/spatial-qa.json`新增记录35个空间提交计时样本，p95约0.1ms；桌面high、375px mobile medium、4倍CPU限速下high，0页面异常、0手机横向溢出，并记录交互后才请求的独立renderer JS。这里是CPU提交计时，不是GPU耗时或RUM。

默认无Canvas/WebGL渲染、无第三方前端脚本，仅下载获准品牌SVG。Studio显式开启后最多24fps，Passage最多30fps且每次仅12秒。离屏与后台事件停止计数已由测试验证。无生产RUM，不能声称CWV p75达标；没有真实移动设备电池/温控或长期内存测量。

## Missing Assets / Remaining Risks

1. 官方SVG现已接入；原文件下载故障仍存在，交付记录如实注明使用完整原始文本恢复。
2. 公开联系邮箱已由用户确认：zaithe@zaithe.com。已添加中英文联系页邮件链接；网页表单的服务端投递仍未配置，不会自动发邮件。法务公司名仍待确认，未编造。
3. 原生Apple设备、Edge、Firefox/WebKit验收未完成。
4. 历史网站源码ZIP未读取，不能声称迁移等价。
5. ESLint9为React插件兼容锁定，registry标为deprecated；应在兼容链更新后升级。
6. 无正式托管、RUM或生产联系服务，不能称已上线成品。

## Files / Preview / Delivery

源码与测试位于 `website/`。解压 `ZAITHE-website-delivery.zip` 后，在 `website/` 执行 `pnpm install --frozen-lockfile`、`pnpm build`、`pnpm start`，再打开 `http://localhost:3000/zh-cn`。这是本地服务地址，不是公网预览地址。ZIP不包含node_modules和构建缓存，包含代码、锁文件、文档和测试截图。

附件上传因网络错误失败，尚无确认成功的公开下载链接。源代码及测试证据已保留在本地交付ZIP中。

## Recommended Next

本轮已补齐官方Logo、实测Passage、单一空间装置与其安全回退。剩余先处理联系/法务事实、原生浏览器验收与正式托管条件。视频仍排除；源码与QA获准发布到ZACloud独立交付分支；正式托管与部署仍需单独处理。
