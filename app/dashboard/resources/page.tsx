"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  FileAudio, 
  FileArchive, 
  File, 
  Calendar as CalendarIcon, 
  HardDrive,
  Pin,
  Clock,
  ArrowRight,
  RotateCcw
} from "lucide-react"

// 더미 데이터
const resources = [
  {
    id: 1,
    title: "2025 문법 핵심 요약집 (필수 암기)",
    description: "수업 시간에 다룬 8품사부터 5형식까지의 핵심 문법을 정리한 요약본입니다. 시험 전 꼭 확인하세요!",
    type: "pdf",
    size: "15.4 MB",
    date: "2025-01-20",
    category: "grammar",
    ext: "PDF",
    isPinned: true,
  },
  {
    id: 2,
    title: "1월 월간 테스트 듣기평가 음원",
    description: "1월 월간 테스트 리스닝 파트 음원 파일입니다. 이어폰을 착용하고 실제 시험처럼 응시해 보세요.",
    type: "audio",
    size: "24.1 MB",
    date: "2025-01-18",
    category: "listening",
    ext: "MP3",
    isPinned: false,
  },
  {
    id: 3,
    title: "작년 3월 모의고사 변형 문제 전체 세트",
    description: "작년 모의고사 지문을 변형한 실전 대비 문제 세트입니다.",
    type: "archive",
    size: "42.8 MB",
    date: "2024-03-15",
    category: "exam",
    ext: "ZIP",
    isPinned: true,
  },
  {
    id: 4,
    title: "수능 필수 영단어 1000",
    description: "수능 빈출 단어와 예문이 포함된 단어장입니다.",
    type: "pdf",
    size: "8.2 MB",
    date: "2024-11-10",
    category: "vocabulary",
    ext: "PDF",
    isPinned: false,
  },
  {
    id: 5,
    title: "독해 구문 분석 워크시트",
    description: "복잡한 문장 구조 분석 연습을 위한 워크시트입니다.",
    type: "pdf",
    size: "3.5 MB",
    date: "2024-12-05",
    category: "reading",
    ext: "PDF",
    isPinned: false,
  },
]

// 아이콘 및 스타일 헬퍼
const getFileStyle = (type: string) => {
  switch (type) {
    case 'pdf':
      return { icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/10", border: "hover:border-red-200 dark:hover:border-red-900" }
    case 'audio':
      return { icon: FileAudio, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/10", border: "hover:border-amber-200 dark:hover:border-amber-900" }
    case 'archive':
      return { icon: FileArchive, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10", border: "hover:border-blue-200 dark:hover:border-blue-900" }
    default:
      return { icon: File, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-900/50", border: "hover:border-slate-300" }
  }
}

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  
  // 기간 필터 상태
  const [dateFilter, setDateFilter] = useState("all") 
  
  // 실제 필터링에 적용될 날짜
  const [startDate, setStartDate] = useState("") 
  const [endDate, setEndDate] = useState("")   

  // 입력 중인 임시 날짜 (인풋창과 연결됨)
  const [tempStart, setTempStart] = useState("")
  const [tempEnd, setTempEnd] = useState("")

  // [조회] 버튼 클릭 핸들러
  const handleCustomSearch = () => {
    setStartDate(tempStart)
    setEndDate(tempEnd)
  }

  // [초기화] 버튼 핸들러
  const handleResetDate = () => {
    setTempStart("")
    setTempEnd("")
    setStartDate("")
    setEndDate("")
  }

  // 1. 검색 및 필터링 로직
  const filteredResources = resources.filter((item) => {
    // 1-1. 검색어
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    // 1-2. 파일 타입
    const matchesType = typeFilter === "all" || item.type === typeFilter
    
    // 1-3. 날짜 기간
    let matchesDate = true
    const itemDate = new Date(item.date)
    const now = new Date()

    if (dateFilter === "custom") {
      // 직접 입력 모드: [조회] 버튼으로 설정된 startDate/endDate 사용
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
      // 프리셋 모드
      const targetDate = new Date()
      if (dateFilter === "1m") targetDate.setMonth(now.getMonth() - 1)
      else if (dateFilter === "3m") targetDate.setMonth(now.getMonth() - 3)
      else if (dateFilter === "6m") targetDate.setMonth(now.getMonth() - 6)
      else if (dateFilter === "1y") targetDate.setFullYear(now.getFullYear() - 1)
      
      matchesDate = itemDate >= targetDate
    }

    return matchesSearch && matchesType && matchesDate
  })

  // 2. 정렬 로직 (고정 -> 최신순)
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 타이틀 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">학습 자료실</h1>
        <p className="text-slate-500 dark:text-slate-400">
          수업 자료와 보충 학습 자료를 다운로드하세요.
        </p>
      </div>

      {/* 검색 & 필터 영역 */}
      <div className="flex flex-col gap-4">
        
        {/* 상단: 검색창 + 기본 필터 */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="자료명 검색..." 
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* 기간 필터 */}
            <div className="w-full sm:w-[160px]">
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

            {/* 파일 형식 필터 */}
            <div className="w-full sm:w-[160px]">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="파일 형식" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 형식</SelectItem>
                  <SelectItem value="pdf">PDF 문서</SelectItem>
                  <SelectItem value="audio">오디오 (MP3)</SelectItem>
                  <SelectItem value="archive">압축 파일 (ZIP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* [수정됨] 직접 입력 모드일 때만 보이는 상세 설정 바 */}
        {dateFilter === "custom" && (
          <div className="flex flex-col sm:flex-row items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg animate-in slide-in-from-top-2 duration-300">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 shrink-0">기간 상세 설정:</span>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input 
                type="date" 
                value={tempStart}
                onChange={(e) => setTempStart(e.target.value)}
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 w-full sm:w-[160px]"
              />
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <Input 
                type="date" 
                value={tempEnd}
                onChange={(e) => setTempEnd(e.target.value)}
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 w-full sm:w-[160px]"
              />
            </div>
            
            <div className="flex items-center gap-2 ml-auto w-full sm:w-auto mt-2 sm:mt-0">
              {/* [추가됨] 조회 버튼 */}
              <Button 
                size="sm"
                onClick={handleCustomSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
              >
                <Search className="w-4 h-4" />
                조회
              </Button>

              {/* 초기화 버튼 */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetDate}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white w-full sm:w-auto"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                초기화
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 그리드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedResources.length > 0 ? (
          sortedResources.map((resource) => {
            const { icon: Icon, color, bg, border } = getFileStyle(resource.type)
            
            return (
              <Card 
                key={resource.id} 
                className={`group flex flex-col justify-between bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden
                  ${border}
                  ${resource.isPinned ? "border-blue-500/50 dark:border-blue-500/50 ring-1 ring-blue-500/20" : "border-slate-200 dark:border-slate-800"}
                `}
              >
                {resource.isPinned && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1 z-10">
                    <Pin className="w-3 h-3 fill-current" />
                    중요
                  </div>
                )}

                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className={`p-3 rounded-2xl ${bg} ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-xs font-bold text-slate-500 border-slate-200 dark:border-slate-700">
                    {resource.ext}
                  </Badge>
                </CardHeader>

                <CardContent className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[1.75rem]">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-auto">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      <HardDrive className="w-3 h-3" /> {resource.size}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      <CalendarIcon className="w-3 h-3" /> {resource.date}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-blue-600 transition-all group-hover:shadow-md">
                    <Download className="w-4 h-4 mr-2" />
                    다운로드
                  </Button>
                </CardFooter>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">검색된 자료가 없습니다.</p>
            <p className="text-sm mt-1">검색어나 기간 설정을 확인해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}