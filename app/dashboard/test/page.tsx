"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, ArrowRight, AlertCircle, Bell 
} from "lucide-react"
import { cn } from "@/lib/utils"

// ✅ 날짜 헬퍼 함수
const formatDateStr = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 1. 임시 데이터
const MOCK_EXAMS = [
  {
    id: 1,
    title: "테스트시험",
    subject: "전과목",
    startDate: "2026-01-05 10:00", 
    endDate: "2026-01-10 18:00", 
    status: "active", 
    description: "국어, 영어, 수학 집중 평가 기간입니다."
  },
  {
    id: 2,
    title: "테스트시험2",
    subject: "영어",
    // 오늘 날짜 테스트를 위해 날짜를 동적으로 2026-01-09(오늘)로 설정해둠
    startDate: "2026-01-09 09:00",
    endDate: "2026-01-09 11:00",
    status: "upcoming",
    description: "Class A 그룹 스피킹 테스트"
  },
  {
    id: 3,
    title: "정보과학 프로젝트 제출",
    subject: "정보",
    startDate: "2026-01-18 00:00",
    endDate: "2026-01-20 23:59", 
    status: "upcoming",
    description: "알고리즘 구현 과제 제출 (온라인)"
  },
  {
    id: 4,
    title: "지난 수학 쪽지시험",
    subject: "수학",
    startDate: "2026-01-02 13:00",
    endDate: "2026-01-02 14:00",
    status: "ended",
    description: "집합 단원 평가"
  }
]

export default function CalendarPage() {
  // 초기값을 오늘 날짜로 설정 (2026-01-09 가정)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 9)) 
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-01-09") 

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  // ✅ 기간 체크 로직
  const isExamOnDate = (exam: any, targetDateStr: string) => {
    const target = new Date(targetDateStr).setHours(0,0,0,0)
    const start = new Date(exam.startDate).setHours(0,0,0,0)
    const end = new Date(exam.endDate).setHours(0,0,0,0)
    return target >= start && target <= end
  }

  // 선택된 날짜의 시험들
  const selectedExams = MOCK_EXAMS.filter(exam => isExamOnDate(exam, selectedDateStr))

  // ✅ 오늘 진행되는 시험 체크 (Today Banner용)
  const todayStr = formatDateStr(new Date(2026, 0, 9)) // 실제 배포시는 new Date() 사용
  const todayExams = MOCK_EXAMS.filter(exam => isExamOnDate(exam, todayStr))

  // D-Day 계산기
  const getDday = (startDateStr: string) => {
    const today = new Date(2026, 0, 9).setHours(0,0,0,0) // 실제 배포시는 new Date()
    const start = new Date(startDateStr).setHours(0,0,0,0)
    const diff = (start - today) / (1000 * 60 * 60 * 24)
    
    if (diff === 0) return "Today"
    if (diff < 0) return "진행/종료"
    return `D-${diff}`
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth()+1}.${date.getDate()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* 1. 헤더 및 오늘의 시험 알림 배너 */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
            시험 일정
          </h1>
          <p className="text-sm text-slate-500">
             {year}년 {month+1}월 학사 일정
          </p>
        </div>

        {/* 🚨 오늘의 시험 알림 (시험이 있을 때만 표시) */}
        {todayExams.length > 0 ? (
          <div className="bg-indigo-600 dark:bg-indigo-900 text-white p-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">오늘 예정된 시험이 {todayExams.length}개 있습니다!</p>
                <p className="text-indigo-100 text-sm opacity-90">놓치지 말고 응시해주세요.</p>
              </div>
            </div>
            <Button 
                variant="secondary" 
                size="sm" 
                className="hidden sm:flex whitespace-nowrap bg-white text-indigo-600 hover:bg-indigo-50"
                onClick={() => setSelectedDateStr(todayStr)} // 오늘 날짜로 이동
            >
              확인하기 <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-500 text-sm">
            오늘은 예정된 시험이 없습니다. 편안한 하루 보내세요!
          </div>
        )}
      </div>

      {/* 2. 메인 컨텐츠 (반응형: 모바일 세로, PC 가로) */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        
        {/* 달력 영역 (PC: 7칸) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          
          {/* 달력 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              {month + 1}월
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={prevMonth} className="h-8 w-8 p-0"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" onClick={nextMonth} className="h-8 w-8 p-0"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* 요일 */}
          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
              <div key={d} className={cn("text-xs font-medium text-center py-2", i===0 && "text-red-500", i===6 && "text-blue-500")}>{d}</div>
            ))}
          </div>

          {/* 날짜 그리드 (모바일 대응 min-h) */}
          <div className="grid grid-cols-7 auto-rows-fr bg-white dark:bg-slate-900">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="border-b border-r border-slate-100 dark:border-slate-800 min-h-[60px] md:min-h-[80px]" />)}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateObj = new Date(year, month, day)
              const dateKey = formatDateStr(dateObj)
              const isSelected = selectedDateStr === dateKey
              // 오늘 날짜 표시 (여기서는 1월 9일을 오늘로 가정)
              const isToday = dateKey === todayStr 
              
              const examsOnThisDay = MOCK_EXAMS.filter(e => isExamOnDate(e, dateKey))

              return (
                <div 
                  key={day}
                  onClick={() => setSelectedDateStr(dateKey)}
                  className={cn(
                    "relative border-b border-r border-slate-100 dark:border-slate-800 p-1 flex flex-col gap-1 cursor-pointer transition-all min-h-[60px] md:min-h-[80px]",
                    isSelected ? "bg-indigo-50 dark:bg-indigo-900/20 shadow-inner" : "hover:bg-slate-50 dark:hover:bg-slate-800",
                    isToday && !isSelected && "bg-slate-50 dark:bg-slate-800"
                  )}
                >
                  <span className={cn(
                    "text-[10px] md:text-xs w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full font-medium transition-colors",
                    isToday ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-300",
                    isSelected && !isToday && "text-indigo-600 font-bold bg-white dark:bg-slate-700"
                  )}>
                    {day}
                  </span>

                  {/* 기간 Bar (모바일에서는 얇게) */}
                  <div className="flex flex-col gap-1 mt-0.5">
                    {examsOnThisDay.map((exam) => {
                      const isStart = formatDateStr(new Date(exam.startDate)) === dateKey
                      const isEnd = formatDateStr(new Date(exam.endDate)) === dateKey
                      
                      return (
                        <div key={exam.id} className={cn(
                          "h-1 md:h-1.5 w-full rounded-full md:rounded-sm opacity-90",
                          exam.status === 'ended' ? "bg-slate-300" : "bg-indigo-400",
                          isStart && !isEnd && "rounded-r-none ml-0.5",
                          isEnd && !isStart && "rounded-l-none mr-0.5",
                          !isStart && !isEnd && "rounded-none mx-[-4px] w-[calc(100%+9px)]" 
                        )} />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 상세 리스트 영역 (PC: 5칸) */}
        <div className="lg:col-span-5 flex flex-col h-[500px] lg:h-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
            <h3 className="font-bold text-lg flex items-center gap-2">
              {selectedDateStr.split('-')[1]}월 {selectedDateStr.split('-')[2]}일
              {selectedDateStr === todayStr && <Badge variant="secondary" className="text-indigo-600 bg-indigo-50">Today</Badge>}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              선택한 날짜에 {selectedExams.length}개의 일정이 있습니다.
            </p>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            {selectedExams.length > 0 ? (
              <div className="space-y-3">
                {selectedExams.map((exam) => {
                  const dDay = getDday(exam.startDate)
                  const isEnded = exam.status === 'ended'

                  return (
                    <div key={exam.id} className={cn(
                      "relative bg-white dark:bg-slate-800 border rounded-lg p-4 transition-all",
                      isEnded ? "border-slate-200 opacity-60" : "border-indigo-100 dark:border-indigo-900 hover:border-indigo-300 shadow-sm"
                    )}>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="mb-1 text-[10px] md:text-xs">{exam.subject}</Badge>
                        <span className={cn(
                          "text-[10px] md:text-xs font-bold px-2 py-0.5 rounded",
                          dDay.includes("Today") ? "bg-rose-100 text-rose-600" : 
                          dDay.includes("D-") ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
                        )}>{dDay}</span>
                      </div>
                      
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm md:text-base">{exam.title}</h4>
                      
                      {/* 시간 정보 */}
                      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded mb-3">
                        <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <div className="flex flex-col gap-0.5">
                           <span>시작: {formatDateTime(exam.startDate)}</span>
                           <span className="text-slate-400">종료: {formatDateTime(exam.endDate)}</span>
                        </div>
                      </div>

                      <Button 
                        size="sm" 
                        className={cn("w-full h-9 text-xs font-semibold", isEnded ? "bg-slate-100 text-slate-400 hover:bg-slate-100" : "bg-indigo-600 hover:bg-indigo-700")}
                        disabled={isEnded}
                      >
                        {isEnded ? "시험 종료됨" : "시험 입장하기"}
                        {!isEnded && <ArrowRight className="w-3 h-3 ml-1" />}
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">예정된 시험이 없습니다.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}