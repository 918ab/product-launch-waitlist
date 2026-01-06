"use client"

import { Header } from "../components/header"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, User } from "lucide-react"

const backgroundStyle = `
  .bg-pattern {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px; pointer-events: none; z-index: 1;
  }
  .content { position: relative; z-index: 2; }
`

const notices = [
  {
    id: 1,
    title: "2024년 겨울학기 수강 안내",
    content: "2024년 겨울학기 수강 신청이 시작되었습니다.\n\n신청 기간: 1월 15일 ~ 1월 31일\n개강일: 2월 1일\n\n많은 관심 부탁드립니다.",
    date: "2024-01-15",
    author: "관리자",
    isNew: true,
  },
  {
    id: 2,
    title: "설 연휴 휴강 안내 (2/9 ~ 2/12)",
    content: "설 연휴 기간 동안은 모든 강의가 휴강됩니다.\n가족과 함께 즐거운 명절 보내세요.",
    date: "2024-01-10",
    author: "관리자",
    isNew: true,
  },
  {
    id: 3,
    title: "신규 학습 자료 업데이트 안내",
    content: "학습 자료실에 새로운 자료가 업데이트되었습니다.",
    date: "2024-01-05",
    author: "관리자",
    isNew: false,
  },
  {
    id: 4,
    title: "복습 영상 시청 방법 안내",
    content: "복습 영상은 대시보드 > 복습영상 메뉴에서 확인 가능합니다.",
    date: "2024-01-02",
    author: "관리자",
    isNew: false,
  },
  {
    id: 5,
    title: "2024년 새해 인사",
    content: "새해 복 많이 받으세요!",
    date: "2024-01-01",
    author: "관리자",
    isNew: false,
  },
]

export default function NoticesPage() {
  return (
    <main className="min-h-screen text-white selection:bg-blue-500/30" style={{ background: "radial-gradient(circle at center, #111827, #000000)" }}>
      <style jsx global>{backgroundStyle}</style>
      <div className="bg-pattern"></div>
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="content w-full">
        <Header isLoggedIn={false} />

        <div className="min-h-screen pt-28 pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">공지사항</h1>
              <p className="text-gray-400">배문환 영어 연구소의 새로운 소식을 확인하세요</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl ring-1 ring-white/10 overflow-hidden shadow-2xl">
              <div className="divide-y divide-white/10">
                {notices.map((notice) => (
                  <Dialog key={notice.id}>
                    <DialogTrigger asChild>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-white/5 transition-colors group gap-2 cursor-pointer text-left w-full">
                        <div className="flex items-center gap-3">
                          {notice.isNew && <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded shrink-0">NEW</span>}
                          <span className="text-white font-medium group-hover:text-blue-300 transition-colors truncate">{notice.title}</span>
                        </div>
                        <span className="text-gray-500 text-sm shrink-0">{notice.date}</span>
                      </div>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl bg-[#111827] border-white/10 text-white">
                      <DialogHeader className="space-y-4 pb-4 border-b border-white/10">
                        <DialogTitle className="text-xl md:text-2xl font-bold text-white leading-tight">
                          {notice.title}
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-4 text-sm text-gray-400">
                           <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{notice.author}</span>
                           <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{notice.date}</span>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 text-gray-300 leading-relaxed whitespace-pre-wrap min-h-[150px]">
                        {notice.content}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
            
             <div className="flex justify-center mt-8 gap-2">
              <button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">1</button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}