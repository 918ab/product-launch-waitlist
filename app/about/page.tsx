"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "../components/header"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Download, Mail, Youtube, Instagram, ExternalLink } from "lucide-react"

// 배경 패턴 스타일
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

        <div className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl w-full mx-auto">
            
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
              
              <div className="flex-1 space-y-10 text-center lg:text-left">
                {/* 1. 소개 텍스트 영역 */}
                <div>
                  <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 drop-shadow-2xl">
                    배문환
                  </h1>
                  <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                    영어 연구소 대표 강사
                  </h2>
                  
                  <div className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    <p>
                      고등학교 시절 누구나 어려움을 겪습니다. 배문환 저도 하위권에서 시작했습니다. <br className="hidden lg:block" />
                      그러나, 단 <strong>6개월</strong> 만에 1등이 되었습니다. <br/>
                      최고의 컨텐츠, 관리, 동기부여와 함께라면
                    </p>
                    
                    {/* [수정] 크기 축소 (text-2xl md:text-3xl) */}
                    <span className="block mt-4 text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg">
                      "이제는 여러분 차례 입니다"
                    </span>
                  </div>

                  {/* [추가] 이력 섹션 */}
                  <div className="mt-8 pt-8 border-t border-white/10 max-w-xl mx-auto lg:mx-0">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-left">
                        {[
                          "매시브 경복궁/중계",
                          "대형 학원&인강 모의고사 출제",
                          "미래탐구 고등영어 팀장",
                          "목동 사과나무교육"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-300 justify-center lg:justify-start">
                            {/* 작은 불빛 효과 아이콘 */}
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] shrink-0" />
                            <span className="text-base font-medium">{item}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* 2. 버튼 영역 */}
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

                {/* 3. 소셜 아이콘 영역 */}
                <div className="flex items-center justify-center lg:justify-start gap-6 text-gray-500">
                  <a 
                    href="https://www.youtube.com/@moonanii_world" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  >
                    <Youtube className="w-7 h-7" />
                  </a>

                  <a 
                    href="https://www.instagram.com/eng_to_the_moon" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  >
                    <Instagram className="w-7 h-7" />
                  </a>

                  <a 
                    href="mailto:bae_moonhwan@naver.com" 
                    className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  >
                    <Mail className="w-7 h-7" />
                  </a>
                </div>
              </div>

              {/* 4. 오른쪽 이미지 영역 */}
              <div className="flex-shrink-0 relative group">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-2xl group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
                
                <div className="w-72 h-72 lg:w-96 lg:h-96 relative rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-900 z-10">
                  <Image
                    src="/common.jpg"
                    alt="배문환 강사님"
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
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