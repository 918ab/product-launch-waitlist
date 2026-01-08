import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ConditionalFooter } from "./components/conditional-footer" 
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://engmoonhwan.com"),
  title: {
    default: "배문환 영어 연구소",
    template: "%s | 배문환 영어 연구소", 
  },
  description: "체계적인 영어 학습 관리 시스템. 학생들을 위한 맞춤형 학습 자료와 영상을 제공합니다.",
  openGraph: {
    title: "배문환 영어 연구소",
    description: "학생들을 위한 프리미엄 영어 학습 플랫폼",
    url: "https://engmoonhwan.com",
    siteName: "배문환 영어 연구소",
    images: [
      {
        url: "/common.jpg",
        width: 1080,
        height: 1388,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          
          <ConditionalFooter />
          
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}