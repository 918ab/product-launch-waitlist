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

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()

  const passwordRegex = /^(?=.*[!@#$%^&*]).{8,}$/
  const errorToastStyle = "bg-white text-black border-4 border-red-600 p-6 shadow-[0_0_30px_rgba(220,38,38,0.5)] text-lg font-bold"
  const successToastStyle = "bg-white text-black border-4 border-blue-600 p-6 shadow-[0_0_30px_rgba(37,99,235,0.5)] text-lg font-bold"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. 비밀번호 일치 확인
    if (password !== confirmPassword) {
      toast({
        title: "❌ 비밀번호 불일치",
        description: "비밀번호가 서로 다릅니다. 다시 입력해주세요.",
        className: errorToastStyle, // 스타일 적용
        duration: 3000,
      })
      return
    }

    // 2. 비밀번호 강도 확인
    if (!passwordRegex.test(password)) {
      toast({
        title: "⚠️ 비밀번호 형식 오류",
        description: "8자 이상 + 특수문자(!@#$%^&*)를 꼭 포함해주세요!",
        className: errorToastStyle, // 스타일 적용
        duration: 4000,
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      // 3. 중복 이메일 (409) 처리
      if (res.status === 409) {
        toast({
          title: "🚫 가입 실패",
          description: "이미 가입된 이메일입니다. 로그인 해주세요.",
          className: errorToastStyle, // 스타일 적용
          duration: 4000,
        })
        setIsLoading(false)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "회원가입 실패")
      }

      // 4. 성공 처리
      toast({
        title: "✅ 회원가입 성공!",
        description: "잠시 후 로그인 페이지로 이동합니다.",
        className: successToastStyle, // 파란색 테두리 스타일 적용
        duration: 2000,
      })

      setTimeout(() => {
        router.push("/login")
      }, 1500)

    } catch (error: any) {
      toast({
        title: "❌ 오류 발생",
        description: error.message,
        className: errorToastStyle,
        duration: 4000,
      })
    } finally {
      if (location.pathname === '/signup') {
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
          {/* 디자인 원상복구: 투명한 느낌 */}
          <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">회원가입</h1>
              <p className="text-gray-400">배문환 영어 연구소에 가입하세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">이름</Label>
                {/* 파란 테두리 제거 버전 유지 */}
                <div className="rounded-xl bg-black/20 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-white/30 transition-all">
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                <Label htmlFor="password" className="text-gray-300">비밀번호</Label>
                <div className="rounded-xl bg-black/20 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-white/30 transition-all">
                  <Input
                    id="password"
                    type="password"
                    placeholder="8자 이상, 특수문자 포함"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">비밀번호 확인</Label>
                <div className="rounded-xl bg-black/20 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-white/30 transition-all">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "회원가입"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                  로그인
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