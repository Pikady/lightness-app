import type { Metadata } from "next";
import StyledComponentsRegistry from "@/components/providers/StyledComponentsRegistry";
import ThemeProvider from "@/components/providers/ThemeProvider";
import DataSubscriber from "@/components/providers/DataSubscriber";

export const metadata: Metadata = {
  title: "轻盈 - The Lightness App",
  description: "一个过程体验设计器，帮助你重新设计生活中的必须做的事情",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Caveat:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <DataSubscriber />
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
