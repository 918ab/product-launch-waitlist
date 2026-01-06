import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ConditionalFooter } from "./components/conditional-footer" 
import "./globals.css"

export const metadata: Metadata = {
  title: "배문환 영어 연구소",
  description: "체계적인 영어 학습 시스템",
}

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