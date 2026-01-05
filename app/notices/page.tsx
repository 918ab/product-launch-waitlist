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

// Demo notice data
const notices = [
  {
    id: 1,
    title: "2024년 겨울학기 수강 안내",
    date: "2024-01-15",
    isNew: true,
  },
  {
    id: 2,
    title: "설 연휴 휴강 안내 (2/9 ~ 2/12)",
    date: "2024-01-10",
    isNew: true,
  },
  {
    id: 3,
    title: "신규 학습 자료 업데이트 안내",
    date: "2024-01-05",
    isNew: false,
  },
  {
    id: 4,
    title: "복습 영상 시청 방법 안내",
    date: "2024-01-02",
    isNew: false,
  },
  {
    id: 5,
    title: "2024년 새해 인사",
    date: "2024-01-01",
    isNew: false,
  },
]

export default function NoticesPage() {
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
              <h1 className="text-4xl font-bold text-white mb-4">공지사항</h1>
              <p className="text-gray-400">배문환 영어 연구소의 새로운 소식을 확인하세요</p>
            </div>

            {/* Notice List */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl ring-1 ring-white/10 overflow-hidden">
              <div className="divide-y divide-white/10">
                {notices.map((notice) => (
                  <Link
                    key={notice.id}
                    href={`/notices/${notice.id}`}
                    className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {notice.isNew && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded">NEW</span>
                      )}
                      <span className="text-white font-medium">{notice.title}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{notice.date}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Pagination placeholder */}
            <div className="flex justify-center mt-8 gap-2">
              <button className="w-10 h-10 rounded-lg bg-blue-500 text-white font-medium">1</button>
              <button className="w-10 h-10 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                2
              </button>
              <button className="w-10 h-10 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                3
              </button>
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
