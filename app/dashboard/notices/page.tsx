"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, User, Search, Loader2, Clock, ArrowRight, RotateCcw } from "lucide-react"

export default function DashboardNoticesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all") 
  const [startDate, setStartDate] = useState("") 
  const [endDate, setEndDate] = useState("")   
  const [tempStart, setTempStart] = useState("")
  const [tempEnd, setTempEnd] = useState("")

  const [notices, setNotices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/notices", { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          
          // [핵심] 권한 필터링: 'all'(전체) 또는 'student'(학생)만 통과
          // 'guest'로 설정된 공지사항은 여기서 걸러집니다.
          const studentNotices = data.filter((n: any) => n.target === 'all' || n.target === 'student')

          const formattedData = studentNotices.map((item: any) => ({
            id: item._id,
            title: item.title,
            content: item.content,
            date: item.createdAt.split("T")[0], 
            createdAt: item.createdAt, 
            author: "관리자", 
            type: item.isImportant ? "important" : "normal"
          }))
          
          setNotices(formattedData)
        }
      } catch (error) {
        console.error("공지사항 로딩 실패", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotices()
  }, [])

  // ... (아래 handleCustomSearch, handleResetDate, filteredNotices, return 문은 
  // 직전에 보내드린 코드와 동일하므로 그대로 두시면 됩니다.)
  
  const handleCustomSearch = () => {
    setStartDate(tempStart)
    setEndDate(tempEnd)
  }

  const handleResetDate = () => {
    setTempStart("")
    setTempEnd("")
    setStartDate("")
    setEndDate("")
  }

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesDate = true
    const itemDate = new Date(notice.createdAt)
    const now = new Date()

    if (dateFilter === "custom") {
      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59)
        matchesDate = itemDate >= start && itemDate <= end
      } else if (startDate) {
        const start = new Date(startDate)
        matchesDate = itemDate >= start
      } else if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59)
        matchesDate = itemDate <= end
      }
    } else if (dateFilter !== "all") {
      const targetDate = new Date()
      if (dateFilter === "1m") targetDate.setMonth(now.getMonth() - 1)
      else if (dateFilter === "3m") targetDate.setMonth(now.getMonth() - 3)
      else if (dateFilter === "6m") targetDate.setMonth(now.getMonth() - 6)
      else if (dateFilter === "1y") targetDate.setFullYear(now.getFullYear() - 1)
      
      matchesDate = itemDate >= targetDate
    }

    return matchesSearch && matchesDate
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">공지사항</h1>
        <p className="text-slate-500 dark:text-slate-400">수강생들을 위한 중요 소식을 확인하세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="공지사항 제목 검색..." 
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-[180px]">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4" />
                  <SelectValue placeholder="기간 설정" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 기간</SelectItem>
                <SelectItem value="1m">최근 1개월</SelectItem>
                <SelectItem value="3m">최근 3개월</SelectItem>
                <SelectItem value="6m">최근 6개월</SelectItem>
                <SelectItem value="1y">최근 1년</SelectItem>
                <SelectItem value="custom" className="font-medium text-blue-600 dark:text-blue-400">직접 입력...</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {dateFilter === "custom" && (
          <div className="flex flex-col sm:flex-row items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg animate-in slide-in-from-top-2 duration-300">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 shrink-0">기간 상세 설정:</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input type="date" value={tempStart} onChange={(e) => setTempStart(e.target.value)} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 w-full sm:w-[160px]" />
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <Input type="date" value={tempEnd} onChange={(e) => setTempEnd(e.target.value)} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 w-full sm:w-[160px]" />
            </div>
            <div className="flex items-center gap-2 ml-auto w-full sm:w-auto mt-2 sm:mt-0">
              <Button size="sm" onClick={handleCustomSearch} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"><Search className="w-4 h-4" />조회</Button>
              <Button variant="outline" size="sm" onClick={handleResetDate} className="text-slate-500 hover:text-slate-900 dark:hover:text-white w-full sm:w-auto"><RotateCcw className="w-4 h-4 mr-1" />초기화</Button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredNotices.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredNotices.map((notice) => (
              <Dialog key={notice.id}>
                <DialogTrigger asChild>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group gap-2 cursor-pointer text-left">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {notice.type === 'important' && (
                        <Badge variant="destructive" className="shrink-0 bg-red-500 hover:bg-red-600">필독</Badge>
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
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <Search className="w-10 h-10 mb-4 opacity-20" />
            <p>등록된 공지사항이 없습니다.</p>
            <p className="text-sm mt-1">검색어나 기간 설정을 확인해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}