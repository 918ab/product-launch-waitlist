"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, User, Search, Filter } from "lucide-react"

// 더미 데이터
const allNotices = [
  {
    id: 1,
    title: "[필독] 2024년 겨울학기 수강생 유의사항",
    content: `안녕하세요, 배문환 영어 연구소입니다.
    
2024년 겨울학기 수강생 여러분을 환영합니다.
원활한 학습을 위해 몇 가지 유의사항을 안내해 드립니다.

1. 강의 수강 기간
- 강의는 등록일로부터 90일간 수강 가능합니다.

2. 교재 배송
- 교재는 수강 신청 후 2~3일 이내에 발송됩니다.

3. 질의응답
- 학습 중 궁금한 점은 Q&A 게시판을 이용해 주세요.`,
    date: "2024-01-15",
    author: "관리자",
    type: "important", // 필독
  },
  {
    id: 2,
    title: "설 연휴 기간 학습 지원 안내",
    content: "민족 대명절 설을 맞아 연휴 기간 동안 휴강합니다.\n게시판 답변이 지연될 수 있습니다.",
    date: "2024-01-10",
    author: "지원팀",
    type: "normal", // 일반
  },
  {
    id: 3,
    title: "신규 학습 자료(문법 요약집) 업데이트",
    content: "자료실에 새로운 문법 요약집이 업로드되었습니다.",
    date: "2024-01-05",
    author: "교무팀",
    type: "update", // 업데이트
  },
  {
    id: 4,
    title: "1월 월간 테스트 일정 안내",
    content: "이번 달 월간 테스트는 25일부터 28일까지 진행됩니다.",
    date: "2024-01-01",
    author: "관리자",
    type: "normal",
  },
  {
    id: 5,
    title: "[업데이트] 모바일 앱 푸시 알림 기능 추가",
    content: "이제 모바일에서도 강의 알림을 받을 수 있습니다.",
    date: "2023-12-28",
    author: "개발팀",
    type: "update",
  },
]

export default function DashboardNoticesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  // 필터링 로직
  const filteredNotices = allNotices.filter((notice) => {
    // 1. 검색어 매칭 (제목)
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    // 2. 카테고리 매칭 (전체 or 타입일치)
    const matchesType = filterType === "all" || notice.type === filterType

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 상단 헤더 영역 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">공지사항</h1>
        <p className="text-slate-500 dark:text-slate-400">수강생들을 위한 중요 소식을 확인하세요.</p>
      </div>

      {/* 검색 및 필터 컨트롤 바 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 검색창 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="공지사항 제목 검색..." 
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 카테고리 필터 (Select) */}
        <div className="w-full sm:w-[180px]">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="카테고리" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 보기</SelectItem>
              <SelectItem value="important">필독 공지</SelectItem>
              <SelectItem value="update">업데이트</SelectItem>
              <SelectItem value="normal">일반 공지</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 공지사항 리스트 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm min-h-[300px]">
        {filteredNotices.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredNotices.map((notice) => (
              <Dialog key={notice.id}>
                <DialogTrigger asChild>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group gap-2 cursor-pointer text-left">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* 뱃지 표시 */}
                      {notice.type === 'important' && (
                        <Badge variant="destructive" className="shrink-0 bg-red-500 hover:bg-red-600">필독</Badge>
                      )}
                      {notice.type === 'update' && (
                        <Badge variant="default" className="shrink-0 bg-blue-500 hover:bg-blue-600">업데이트</Badge>
                      )}
                      {notice.type === 'normal' && (
                        <Badge variant="secondary" className="shrink-0 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">일반</Badge>
                      )}
                      
                      <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {notice.title}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-500 shrink-0 tabular-nums">
                      {notice.date}
                    </span>
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <DialogHeader className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      {notice.type === 'important' && <Badge className="bg-red-500">필독</Badge>}
                      <DialogTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                        {notice.title}
                      </DialogTitle>
                    </div>
                    <DialogDescription className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {notice.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {notice.date}
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
          /* 검색 결과가 없을 때 */
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <Search className="w-10 h-10 mb-4 opacity-20" />
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}