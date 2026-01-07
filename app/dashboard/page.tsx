"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, FileText, Bell, ChevronRight, MessageCircle, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

interface Notice {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  isImportant: boolean;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("학생")
  const [notices, setNotices] = useState<Notice[]>([]) 
  const [loadingNotices, setLoadingNotices] = useState(true)
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user.name) setUserName(user.name)
      } catch (error) {
        console.error("유저 정보 파싱 에러", error)
      }
    }

    const fetchNotices = async () => {
      try {
        // [수정] 통합된 API 사용: 최근 3개만 가져오기
        const res = await fetch("/api/notices?limit=3")
        if (res.ok) {
          const data = await res.json()
          setNotices(data)
        }
      } catch (error) {
        console.error("공지사항 로딩 실패", error)
      } finally {
        setLoadingNotices(false)
      }
    }

    fetchNotices()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const isNew = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. 상단 환영 메시지 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          반갑습니다, <span className="text-blue-600 dark:text-blue-400">{userName}</span>님! 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          오늘도 목표를 향해 힘차게 나아가 봅시다.
        </p>
      </div>

      {/* 2. 바로가기 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/videos" className="group">
          <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md cursor-pointer group-hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <PlayCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">학습 시작하기</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
                지난 시간에 이어 강의를 시청하세요.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/resources" className="group">
          <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-md cursor-pointer group-hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">자료실 이동</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
                필요한 학습 자료를 다운로드하세요.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/dashboard/qna" className="group">
          <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-md cursor-pointer group-hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">질문하기</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
                궁금한 내용을 선생님께 질문하세요.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* 3. 공지사항 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              최신 공지사항
            </CardTitle>
            <Link href="/dashboard/notices">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                더보기 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              {loadingNotices ? (
                <div className="flex justify-center py-8 text-slate-500">
                   <Loader2 className="h-6 w-6 animate-spin mr-2" />
                   불러오는 중...
                </div>
              ) : notices.length > 0 ? (
                notices.map((notice) => (
                  <div 
                    key={notice._id} 
                    onClick={() => handleNoticeClick(notice)}
                    className="block group cursor-pointer"
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {isNew(notice.createdAt) && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate font-medium">
                          {notice.title}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-500 shrink-0 ml-2">
                        {formatDate(notice.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  등록된 공지사항이 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold break-keep">
              {selectedNotice?.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 mt-1">
              {selectedNotice && formatDate(selectedNotice.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto">
            {selectedNotice?.content}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-full sm:w-auto">닫기</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}