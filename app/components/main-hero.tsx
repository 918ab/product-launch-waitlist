"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MainHero() {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 flex flex-col justify-center items-center text-center min-h-screen pt-24">
      <div className="mb-6">
        <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
          영어 학습의 새로운 시작
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-100 to-gray-400 leading-tight text-balance">
        배문환 영어 연구소
      </h1>

      <p className="text-lg sm:text-xl mb-10 text-gray-300 max-w-lg leading-relaxed">
        체계적인 영어 학습 시스템으로 여러분의 상승곡선을  <br className="hidden lg:block" />이끕니다. 지금 바로 시작하세요.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link href="/signup" className="flex-1">
          <Button
            size="lg"
            className="w-full bg-white text-slate-900 hover:bg-gray-100 font-semibold px-8 py-6 rounded-xl text-base"
          >
            회원가입 하기
          </Button>
        </Link>
        <Link href="/login" className="flex-1">
          <Button
            size="lg"
            // 변경된 부분: variant="outline" 제거하고 직접 스타일 지정하여 가시성 높임
            className="w-full bg-white/10 border border-white/50 text-white hover:bg-white/20 font-semibold px-8 py-6 rounded-xl text-base backdrop-blur-sm transition-all"
          >
            로그인
          </Button>
        </Link>
      </div>

      <div className="mt-12 flex items-center gap-6 text-gray-400 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>체계적인 학습</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>복습 영상 제공</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>자료 다운로드</span>
        </div>
      </div>
    </div>
  )
}