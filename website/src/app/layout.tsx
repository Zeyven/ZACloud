import { siteOrigin } from "@/lib/site-origin";
import type { Metadata } from "next";
import "../styles/tokens.css";
import "../styles/globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  robots: { index: true, follow: true },
  icons: {
    icon: "/brand/zaithe-app-obsidian.svg",
    apple: "/brand/zaithe-app-obsidian.svg",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
