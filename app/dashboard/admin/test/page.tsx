"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Plus, Clock, PenLine, Trash2, Loader2, AlertCircle, BarChart3, FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

const formatDateStr = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hour}:${min}`;
}

interface Exam {
  _id: string
  title: string
  startDate: string
  endDate: string
  questions?: any[] 
}

export default function AdminExamCalendarPage() {
  const router = useRouter()
  
  const [exams, setExams] = useState<Exam[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date()) 
  const [selectedDateStr, setSelectedDateStr] = useState<string>(formatDateStr(new Date()))
  
  // 1. 데이터 불러오기
  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/tests")
      if (res.ok) {
        const data = await res.json()
        setExams(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까? 학생들의 응시 기록도 함께 삭제됩니다.")) return;
    try {
      const res = await fetch(`/api/tests/${id}`, { method: "DELETE" })
      if (res.ok) fetchExams()
      else alert("삭제 실패")
    } catch (e) {
      alert("오류 발생")
    }
  }

  // 캘린더 날짜 계산
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const handleDateClick = (dateStr: string) => setSelectedDateStr(dateStr)

  // 자리 배정 알고리즘
  const calendarLayout = useMemo(() => {
    const layout = new Map<string, number>(); 
    const dateOccupancy = new Map<string, boolean[]>(); 

    const sortedExams = [...exams].sort((a, b) => {
      if (a.startDate !== b.startDate) return a.startDate.localeCompare(b.startDate);
      return b.endDate.localeCompare(a.endDate);
    });

    sortedExams.forEach((exam) => {
      const start = new Date(exam.startDate);
      const end = new Date(exam.endDate);
      let rowIndex = 0;

      while (true) {
        let isAvailable = true;
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dStr = formatDateStr(d);
          const occupied = dateOccupancy.get(dStr) || [];
          if (occupied[rowIndex]) {
            isAvailable = false;
            break;
          }
        }
        if (isAvailable) break; 
        rowIndex++; 
      }

      layout.set(exam._id, rowIndex);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dStr = formatDateStr(d);
        const occupied = dateOccupancy.get(dStr) || [];
        occupied[rowIndex] = true;
        dateOccupancy.set(dStr, occupied);
      }
    });

    return layout;
  }, [exams]);

  const isExamOnDate = (exam: Exam, targetDateStr: string) => {
    if (!exam.startDate || !exam.endDate) return false
    const target = new Date(targetDateStr).setHours(0,0,0,0)
    const start = new Date(exam.startDate).setHours(0,0,0,0)
    const end = new Date(exam.endDate).setHours(0,0,0,0)
    return target >= start && target <= end
  }

  const selectedExams = exams.filter(e => isExamOnDate(e, selectedDateStr))

  // ✅ [수정] 다이얼로그 없이 바로 이동 (선택된 날짜 기본값으로 전달)
  const handleGoToCreate = () => {
    const query = new URLSearchParams({
        start: `${selectedDateStr}T09:00`,
        end: `${selectedDateStr}T10:00`
    }).toString()
    router.push(`/dashboard/admin/test/create?${query}`)
  }

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500">
      
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-violet-600" />
            시험 일정 관리
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            등록된 시험: 총 {exams.length}개
          </p>
        </div>
        <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg" onClick={handleGoToCreate}>
            <Plus className="w-5 h-5 mr-2" /> 새 시험 만들기
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-auto lg:h-[700px]">
        
        {/* === 왼쪽: 달력 === */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">{month + 1}월</span>
                <span className="text-base md:text-lg text-slate-400 font-medium">{year}</span>
            </div>
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
              <div key={d} className={cn("text-[10px] md:text-xs font-semibold text-center py-2 md:py-3", i===0 && "text-rose-500", i===6 && "text-violet-500")}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 flex-1 bg-white dark:bg-slate-900 auto-rows-fr">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="border-b border-r border-slate-100 dark:border-slate-800" />)}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateKey = formatDateStr(new Date(year, month, day))
              const isSelected = selectedDateStr === dateKey
              const isToday = dateKey === formatDateStr(new Date())
              
              const dayExams = exams.filter(e => isExamOnDate(e, dateKey));
              const maxRow = dayExams.reduce((max, e) => Math.max(max, calendarLayout.get(e._id) || 0), -1);

              return (
                <div 
                  key={day}
                  onClick={() => handleDateClick(dateKey)}
                  className={cn(
                    "relative border-b border-r border-slate-100 dark:border-slate-800 p-0.5 md:p-2 flex flex-col gap-0.5 md:gap-1 cursor-pointer transition-colors min-h-[50px] md:min-h-[80px]",
                    isSelected ? "bg-violet-50/50 dark:bg-violet-900/20 ring-1 ring-inset ring-violet-500 z-10" : "hover:bg-slate-50 dark:hover:bg-slate-800",
                    isToday && !isSelected && "bg-slate-50 dark:bg-slate-800"
                  )}
                >
                  <span className={cn(
                    "text-[10px] md:text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium mb-0.5 md:mb-1 mx-auto md:mx-0",
                    isToday ? "bg-violet-600 text-white" : "text-slate-500 dark:text-slate-400", 
                    isSelected && !isToday && "text-violet-700 bg-white shadow-sm ring-1 ring-violet-200"
                  )}>
                    {day}
                  </span>

                  <div className="flex flex-col gap-0.5 md:gap-1">
                    {Array.from({ length: maxRow + 1 }).map((_, rowIndex) => {
                        const exam = dayExams.find(e => calendarLayout.get(e._id) === rowIndex);
                        if (!exam) return <div key={`empty-${rowIndex}`} className="h-1 md:h-1.5 invisible" />;
                        
                        const isStart = exam.startDate === dateKey;
                        const isEnd = exam.endDate === dateKey;

                        return (
                            <div key={exam._id} className={cn(
                                "h-1 md:h-1.5 rounded-sm bg-violet-400 dark:bg-violet-600 transition-all shadow-sm",
                                isStart && !isEnd && "rounded-r-none mr-[-2px] md:mr-[-8px] ml-0.5 md:ml-1",
                                isEnd && !isStart && "rounded-l-none ml-[-2px] md:ml-[-8px] mr-0.5 md:mr-1",
                                !isStart && !isEnd && "rounded-none mx-[-2px] md:mx-[-8px]"
                            )} title={exam.title} />
                        );
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* === 우측: 상세 리스트 === */}
        <div className="lg:col-span-5 flex flex-col h-[500px] lg:h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white">
                        {selectedDateStr}
                    </h3>
                    <p className="text-[10px] md:text-xs text-slate-500">선택된 날짜의 시험 목록</p>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4 md:p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                  </div>
                ) : selectedExams.length > 0 ? (
                    <div className="space-y-4">
                        {selectedExams.map((exam) => {
                            const totalScore = exam.questions 
                                ? exam.questions.reduce((acc: number, q: any) => acc + (q.score || 0), 0) 
                                : 0;
                            const isEnded = new Date() > new Date(exam.endDate);

                            return (
                                <div key={exam._id} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-violet-300 transition-all shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant="outline" className={cn(
                                            "text-[10px] md:text-xs px-2 py-0.5",
                                            isEnded ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-green-100 text-green-700 border-green-200"
                                        )}>
                                          {isEnded ? '종료됨' : '예정/진행중'}
                                        </Badge>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="h-6 px-2 text-xs text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                                            onClick={() => router.push(`/dashboard/admin/test/result/${exam._id}`)}
                                        >
                                            <BarChart3 className="w-3 h-3 mr-1" /> 결과/랭킹
                                        </Button>
                                    </div>
                                    
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xl tracking-tight">{exam.title}</h4>
                                    
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg space-y-2 mb-4 border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-start gap-2.5">
                                            <Clock className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
                                            <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                                {formatDateTime(exam.startDate)} <span className="text-slate-400 mx-1">~</span> {formatDateTime(exam.endDate)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 pl-[26px]">
                                            <FileText className="w-3 h-3" />
                                            <span>총 {exam.questions ? exam.questions.length : 0}문항</span>
                                            <span className="text-slate-300">|</span>
                                            <span className="text-violet-600 font-bold">총 {totalScore}점</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                        <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="flex-1 h-9 text-xs border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        onClick={() => router.push(`/dashboard/admin/test/create?id=${exam._id}`)}
                                        >
                                            <PenLine className="w-3 h-3 mr-1"/> 수정
                                        </Button>
                                        <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="flex-1 h-9 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/10 dark:border-red-900/30"
                                        onClick={() => handleDelete(exam._id)}
                                        >
                                            <Trash2 className="w-3 h-3 mr-1"/> 삭제
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-3 opacity-70">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-slate-300" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm md:text-base">일정이 없습니다</p>
                            <p className="text-[10px] md:text-xs mt-1">새로운 시험을 만들어보세요.</p>
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
      </div>
    </div>
  )
}