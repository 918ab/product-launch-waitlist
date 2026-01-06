"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "../components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 2;
  }
`

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()

  // [스타일] 가독성 좋은 토스트 스타일 (회원가입 페이지와 동일)
  const errorToastStyle = "bg-white text-black border-4 border-red-600 p-6 shadow-[0_0_30px_rgba(220,38,38,0.5)] text-lg font-bold"
  const infoToastStyle = "bg-white text-black border-4 border-yellow-500 p-6 shadow-[0_0_30px_rgba(234,179,8,0.5)] text-lg font-bold"
  const successToastStyle = "bg-white text-black border-4 border-blue-600 p-6 shadow-[0_0_30px_rgba(37,99,235,0.5)] text-lg font-bold"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      // 1. 승인 대기 중 (403) 처리
      if (res.status === 403) {
        toast({
          title: "⏳ 로그인 대기",
          description: data.message || "관리자 승인이 필요합니다.",
          className: infoToastStyle, // 노란색 경고 스타일
          duration: 4000,
        })
        setIsLoading(false)
        return
      }

      // 2. 로그인 실패 (401 등)
      if (!res.ok) {
        throw new Error(data.message || "로그인 실패")
      }

      // 3. 로그인 성공
      toast({
        title: "✅ 환영합니다!",
        description: "로그인되었습니다. 메인 페이지로 이동합니다.",
        className: successToastStyle,
        duration: 2000,
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)

    } catch (error: any) {
      toast({
        title: "❌ 로그인 오류",
        description: error.message,
        className: errorToastStyle,
        duration: 4000,
      })
    } finally {
      if (location.pathname === '/login') {
        setIsLoading(false)
      }
    }
  }

  return (
    <main
      className="min-h-screen text-white selection:bg-blue-500/30"
      style={{
        background: "radial-gradient(circle at center, #111827, #000000)",
      }}
    >
      <style jsx global>
        {backgroundStyle}
      </style>
      <div className="bg-pattern"></div>
      
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="content w-full">
        <Header isLoggedIn={false} />

        <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-8">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">로그인</h1>
              <p className="text-gray-400">배문환 영어 연구소에 오신 것을 환영합니다</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">이메일</Label>
                <div className="rounded-xl bg-black/20 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-white/30 transition-all">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-300">비밀번호</Label>
                </div>
                <div className="rounded-xl bg-black/20 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-white/30 transition-all">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl text-base shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "로그인"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                계정이 없으신가요?{" "}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </main>
  )
}