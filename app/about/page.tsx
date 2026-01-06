"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "../components/header"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Download, Mail, Youtube, Instagram, ExternalLink } from "lucide-react"

// 배경 패턴 스타일 (다시 복구)
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

export default function AboutPage() {
  return (
    <main
      className="min-h-screen text-white selection:bg-blue-500/30"
      style={{
        background: "radial-gradient(circle at center, #111827, #000000)", // 더 깊은 다크 배경
      }}
    >
      <style jsx global>
        {backgroundStyle}
      </style>
      <div className="bg-pattern"></div>
      
      {/* 배경에 은은한 오로라 효과 추가 */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="content w-full">
        {/* 헤더 (로그인 상태 X) */}
        <Header isLoggedIn={false} />

        <div className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl w-full mx-auto">
            
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
              
              {/* 1. 왼쪽: 텍스트 정보 영역 */}
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div>
                  <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 drop-shadow-2xl">
                    배문환
                  </h1>
                  <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                    영어 연구소 대표 강사
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    학생들의 영어 실력 향상을 위해 끊임없이 연구하고 가르칩니다. <br className="hidden lg:block" />
                    단순한 암기가 아닌, 실제로 사용할 수 있는 살아있는 영어를 목표로 합니다.
                    체계적인 커리큘럼과 맞춤형 자료로 여러분의 성장을 돕겠습니다.
                  </p>
                </div>

                {/* 버튼 그룹 (다크 모드 스타일) */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link href="/qna">
                    <Button className="h-12 px-8 text-lg font-semibold bg-white text-slate-900 hover:bg-gray-200 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      문의하기
                    </Button>
                  </Link>
                  <Link href="/dashboard/videos">
                    <Button variant="outline" className="h-12 px-8 text-lg font-semibold border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 rounded-full backdrop-blur-sm transition-all">
                      강의 보기
                    </Button>
                  </Link>

                </div>

                {/* 소셜 아이콘 (화이트 톤) */}
                <div className="flex items-center justify-center lg:justify-start gap-6 text-gray-500">
                  <a href="#" className="hover:text-white transition-colors transform hover:scale-110 duration-300">
                    <Youtube className="w-7 h-7" />
                  </a>
                  <a href="#" className="hover:text-white transition-colors transform hover:scale-110 duration-300">
                    <Instagram className="w-7 h-7" />
                  </a>
                  <a href="#" className="hover:text-white transition-colors transform hover:scale-110 duration-300">
                    <Mail className="w-7 h-7" />
                  </a>
                </div>
              </div>

              <div className="flex-shrink-0 relative group">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-2xl group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
                
                <div className="w-72 h-72 lg:w-96 lg:h-96 relative rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-900 z-10">
                  <Image
                    src="/common.jpg"
                    alt="배문환 강사님"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}