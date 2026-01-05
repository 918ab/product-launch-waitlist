"use client"

import { Header } from "../components/header"
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

export default function AboutPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background: "radial-gradient(circle at center, #1E40AF, #000000)",
      }}
    >
      <style jsx global>
        {backgroundStyle}
      </style>
      <div className="bg-pattern"></div>
      <div className="content w-full">
        <Header isLoggedIn={false} />

        <div className="min-h-screen pt-28 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">강사 소개</h1>
              <p className="text-gray-400">배문환 영어 연구소를 이끌어가는 강사를 소개합니다</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-white/10">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Instructor Photo */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">배</span>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">배문환</h2>
                  <p className="text-blue-400 font-medium mb-4">배문환 영어 연구소 대표 강사</p>

                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      안녕하세요, 배문환입니다. 오랜 시간 영어 교육에 헌신하며 학생들의 영어 실력 향상을 위해 최선을
                      다하고 있습니다.
                    </p>
                    <p>
                      체계적인 학습 방법과 효율적인 복습 시스템을 통해 학생들이 영어를 즐겁게 배울 수 있도록 돕고
                      있습니다. 단순한 암기가 아닌, 실제로 사용할 수 있는 영어 실력을 기르는 것을 목표로 합니다.
                    </p>
                    <p>
                      모든 학생들이 자신만의 속도로 성장할 수 있도록 맞춤형 학습 자료와 복습 영상을 제공하고 있습니다.
                    </p>
                  </div>

                  {/* Qualifications */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">주요 경력</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-blue-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>영어 교육 전문가</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-blue-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>체계적인 학습 커리큘럼 개발</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-blue-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>맞춤형 학습 자료 제작</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster
        toastOptions={{
          style: {
            background: "rgb(23 23 23)",
            color: "white",
            border: "1px solid rgb(63 63 70)",
          },
          className: "rounded-xl",
          duration: 5000,
        }}
      />
    </main>
  )
}
