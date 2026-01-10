"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Bell, Calendar, ChevronRight, Clock, BookOpen, AlertCircle, Pin, Trophy, MessageCircle, User 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger
} from "@/components/ui/dialog"

export default function StudentDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [notices, setNotices] = useState<any[]>([])
  const [upcomingTests, setUpcomingTests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // 1. 사용자 정보
        const userRes = await fetch("/api/auth/me")
        if (userRes.ok) setUser(await userRes.json())

        // 2. 공지사항 가져오기
        const noticeRes = await fetch("/api/notices")
        if (noticeRes.ok) {
          const data = await noticeRes.json()
          const sorted = data.sort((a: any, b: any) => {
            if (a.isImportant === b.isImportant) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            return a.isImportant ? -1 : 1
          }).slice(0, 5) 
          setNotices(sorted)
        }

        // 3. 시험 일정 가져오기
        const testRes = await fetch("/api/tests")
        if (testRes.ok) {
          const data = await testRes.json()
          const now = new Date()
          now.setHours(0, 0, 0, 0) 

          const upcoming = data
            .map((test: any) => {
              const startDate = new Date(test.startDate)
              startDate.setHours(0, 0, 0, 0)
              
              const diffTime = startDate.getTime() - now.getTime()
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

              return { ...test, diffDays, startDateObj: startDate }
            })
            .filter((test: any) => test.diffDays >= 0) 
            .sort((a: any, b: any) => a.diffDays - b.diffDays) 
            .slice(0, 5) 

          setUpcomingTests(upcoming)
        }

      } catch (error) {
        console.error("Dashboard Load Error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. 웰컴 메시지 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          반가워요, <span className="text-violet-600">{user?.name || "학생"}</span>님! 👋
        </h1>
        <p className="text-slate-500 text-sm md:text-base">오늘도 즐거운 학습 되세요.</p>
      </div>

      {/* 2. 메인 컨텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* [왼쪽] 최신 공지사항 (다이얼로그 적용) */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 h-full">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500 fill-yellow-500" /> 최신 공지사항
              </CardTitle>
              <Link href="/dashboard/notices">
                <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-slate-600 h-8">
                  더보기 <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />)}
              </div>
            ) : notices.length > 0 ? (
              <div className="space-y-1">
                {notices.map((notice) => (
                  // ✅ [수정] Link 대신 Dialog 사용
                  <Dialog key={notice._id}>
                    <DialogTrigger asChild>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                        <div className="shrink-0">
                          {notice.isImportant ? (
                            <Pin className="w-4 h-4 text-red-500 fill-red-500 rotate-45" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-violet-400 transition-colors" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium truncate", notice.isImportant ? "text-slate-900 dark:text-white font-bold" : "text-slate-600 dark:text-slate-300")}>
                            {notice.title}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(notice.createdAt)}</span>
                      </div>
                    </DialogTrigger>
                    
                    {/* 공지사항 상세 모달 */}
                    <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <DialogHeader className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          {notice.isImportant && <Badge className="bg-red-500">필독</Badge>}
                          <DialogTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                            {notice.title}
                          </DialogTitle>
                        </div>
                        <DialogDescription className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <User className="w-4 h-4" /> 관리자
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" /> {formatDate(notice.createdAt)}
                          </span>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                        {notice.content}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">등록된 공지사항이 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* [오른쪽] 다가올 시험 일정 */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 h-full">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-600" /> 다가올 시험
              </CardTitle>
              <Link href="/dashboard/calendar">
                <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-slate-600 h-8">
                  달력 보기 <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />)}
              </div>
            ) : upcomingTests.length > 0 ? (
              <div className="space-y-3">
                {upcomingTests.map((test) => (
                  // ✅ [수정] 시험 목록 페이지(/dashboard/test)로 이동하도록 변경
                  <Link href="/dashboard/test" key={test._id}>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-900 hover:shadow-md transition-all bg-white dark:bg-slate-950 group">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex flex-col items-center justify-center w-12 h-12 rounded-lg font-bold shadow-sm shrink-0",
                          test.diffDays === 0 
                            ? "bg-red-500 text-white" 
                            : test.diffDays <= 3 
                              ? "bg-orange-100 text-orange-600" 
                              : "bg-slate-100 text-slate-500" 
                        )}>
                          <span className="text-[10px] leading-none opacity-80">D-</span>
                          <span className="text-lg leading-none">{test.diffDays === 0 ? "Day" : test.diffDays}</span>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                            {test.title}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(test.startDate)} 시행</span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                <Trophy className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">예정된 시험이 없습니다.</p>
                <p className="text-xs mt-1">편안한 하루 되세요!</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* 3. 바로가기 메뉴 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/dashboard/contents" className="group p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex flex-col items-center gap-2 text-center border border-blue-100 dark:border-blue-800">
          <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-blue-900 dark:text-blue-100">자료실</span>
        </Link>
        
        <Link href="/dashboard/videos" className="group p-6 bg-violet-50 dark:bg-violet-900/20 rounded-2xl hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors flex flex-col items-center gap-2 text-center border border-violet-100 dark:border-violet-800">
          <Clock className="w-8 h-8 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-violet-900 dark:text-violet-100">복습 영상</span>
        </Link>
        
        <Link href="/dashboard/test" className="group p-6 bg-pink-50 dark:bg-pink-900/20 rounded-2xl hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors flex flex-col items-center gap-2 text-center border border-pink-100 dark:border-pink-800">
          <Trophy className="w-8 h-8 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-pink-900 dark:text-pink-100">시험 응시</span>
        </Link>
        
        <Link href="/dashboard/qna" className="group p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors flex flex-col items-center gap-2 text-center border border-emerald-100 dark:border-emerald-800">
          <MessageCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-emerald-900 dark:text-emerald-100">QNA</span>
        </Link>
      </div>

    </div>
  )
}