"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/header"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, User, Loader2 } from "lucide-react"

const backgroundStyle = `
  .bg-pattern {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px; pointer-events: none; z-index: 1;
  }
  .content { position: relative; z-index: 2; }
`

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/notices", { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          
          // [핵심] 권한 필터링: 'all'(전체) 또는 'guest'(비회원)만 통과
          // 'student'로 설정된 공지사항은 여기서 걸러집니다.
          const publicNotices = data.filter((n: any) => n.target === 'all' || n.target === 'guest')
          
          const formattedData = publicNotices.map((item: any) => ({
            id: item._id,
            title: item.title,
            content: item.content,
            date: item.createdAt.split("T")[0],
            author: "관리자",
            // DB의 중요(isImportant) 여부를 디자인상의 'NEW' 뱃지로 매핑
            isNew: item.isImportant 
          }))
          
          setNotices(formattedData)
        }
      } catch (error) {
        console.error("공지 로딩 실패", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotices()
  }, [])

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

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl ring-1 ring-white/10 overflow-hidden shadow-2xl min-h-[300px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-[300px]">
                   <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : notices.length > 0 ? (
                <div className="divide-y divide-white/10">
                  {notices.map((notice) => (
                    <Dialog key={notice.id}>
                      <DialogTrigger asChild>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-white/5 transition-colors group gap-2 cursor-pointer text-left w-full">
                          <div className="flex items-center gap-3">
                            {/* [수정] 중요(isNew) 글일 때 파란색 NEW 뱃지 표시 */}
                            {notice.isNew && (
                              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded shrink-0">
                                NEW
                              </span>
                            )}
                            <span className="text-white font-medium group-hover:text-blue-300 transition-colors truncate">
                              {notice.title}
                            </span>
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
              ) : (
                <div className="flex justify-center items-center h-[300px] text-gray-500">
                  등록된 공지사항이 없습니다.
                </div>
              )}
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