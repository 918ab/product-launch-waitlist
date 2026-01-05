"use client"

import Link from "next/link"
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

// Demo QNA data
const qnaList = [
  {
    id: 1,
    title: "수강 신청은 어떻게 하나요?",
    author: "김학생",
    date: "2024-01-14",
    answered: true,
  },
  {
    id: 2,
    title: "복습 영상 다운로드가 가능한가요?",
    author: "이학생",
    date: "2024-01-12",
    answered: true,
  },
  {
    id: 3,
    title: "학습 자료 PDF 열람 방법 문의",
    author: "박학생",
    date: "2024-01-10",
    answered: false,
  },
]

export default function QnaPage() {
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
              <h1 className="text-4xl font-bold text-white mb-4">QNA</h1>
              <p className="text-gray-400">자주 묻는 질문을 확인하세요</p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
              <p className="text-blue-300 text-sm text-center">
                질문을 작성하려면{" "}
                <Link href="/login" className="underline font-medium">
                  로그인
                </Link>
                이 필요합니다.
              </p>
            </div>

            {/* QNA List */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl ring-1 ring-white/10 overflow-hidden">
              <div className="divide-y divide-white/10">
                {qnaList.map((item) => (
                  <Link
                    key={item.id}
                    href={`/qna/${item.id}`}
                    className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded ${
                          item.answered ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {item.answered ? "답변완료" : "답변대기"}
                      </span>
                      <span className="text-white font-medium">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span>{item.author}</span>
                      <span>{item.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Pagination placeholder */}
            <div className="flex justify-center mt-8 gap-2">
              <button className="w-10 h-10 rounded-lg bg-blue-500 text-white font-medium">1</button>
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
