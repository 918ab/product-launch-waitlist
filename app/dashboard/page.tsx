"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, FileText, Bell, ChevronRight, MessageCircle } from "lucide-react"

export default function DashboardPage() {
  // 공지사항 미리보기 데이터
  const recentNotices = [
    { id: 1, title: "2024년 겨울학기 수강 안내", date: "2024-01-15", isNew: true },
    { id: 2, title: "설 연휴 휴강 안내", date: "2024-01-10", isNew: false },
    { id: 3, title: "학습 자료 업데이트 완료", date: "2024-01-05", isNew: false },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. 상단 환영 메시지 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          반갑습니다, 학생님! 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          오늘도 목표를 향해 힘차게 나아가 봅시다.
        </p>
      </div>

      {/* 2. 바로가기 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 학습 시작하기 */}
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

        {/* 자료실 */}
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
        
        {/* 질문하기 */}
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
            
            {/* [수정] href를 "/dashboard/notices"로 변경 */}
            <Link href="/dashboard/notices">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                더보기 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              {recentNotices.map((notice) => (
                <Link 
                  key={notice.id} 
                  // [수정] 여기는 상세 페이지가 아직 없으므로 목록으로 가거나 추후 [id] 페이지 생성 필요
                  // 일단은 목록으로 연결해 둠
                  href="/dashboard/notices" 
                  className="block group"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {notice.isNew && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                      <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate font-medium">
                        {notice.title}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-500 shrink-0 ml-2">{notice.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}