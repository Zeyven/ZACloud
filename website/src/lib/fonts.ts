import localFont from "next/font/local";
export const inter = localFont({
  src: "../fonts/inter-latin-variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  preload: true,
});
export const noto = localFont({
  src: "../fonts/noto-sans-sc-subset.woff2",
  variable: "--font-noto",
  display: "swap",
  weight: "400",
  preload: false,
});
