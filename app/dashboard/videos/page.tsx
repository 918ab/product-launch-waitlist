"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
  PlayCircle, 
  Clock, 
  Calendar, 
  Pin,
  ArrowRight,
  RotateCcw,
  Youtube,
  Loader2 
} from "lucide-react"

// 유튜브 ID 추출 함수
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// 데이터 타입 정의
interface Video {
  id: string
  title: string
  description: string
  category: string
  duration: string
  date: string // 화면 표시용 (YYYY-MM-DD)
  createdAt: string // 필터링용 원본 날짜
  isPinned: boolean
  youtubeUrl: string
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // [추가] 동적 카테고리 목록
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([])

  // 기간 설정 상태
  const [dateFilter, setDateFilter] = useState("all") 
  const [startDate, setStartDate] = useState("") 
  const [endDate, setEndDate] = useState("")   
  const [tempStart, setTempStart] = useState("")
  const [tempEnd, setTempEnd] = useState("")

  // 데이터 불러오기
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/contents", { cache: 'no-store' }) // 최신 데이터 보장
        if (res.ok) {
          const data = await res.json()
          
          // 데이터 변환
          const formattedData = data.map((item: any) => ({
            id: item._id,
            title: item.title,
            description: item.description || "",
            category: item.category || "기타",
            duration: item.duration ? String(item.duration) : "00:00",
            date: item.createdAt.split("T")[0], 
            createdAt: item.createdAt,
            isPinned: item.isPinned || false,
            youtubeUrl: item.videoUrl || ""
          }))
          setVideos(formattedData)

          // [핵심] 카테고리 목록 추출 (중복 제거)
          const categories = Array.from(new Set(formattedData.map((v: any) => v.category))) as string[]
          setUniqueCategories(categories)
        }
      } catch (error) {
        console.error("강의 로딩 실패", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // 기간 검색 핸들러
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

  // 필터링 로직
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || video.category === categoryFilter
    
    let matchesDate = true
    const itemDate = new Date(video.createdAt)
    const now = new Date()

    if (dateFilter === "custom") {
      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59) // 종료일의 마지막 시간까지 포함
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

    return matchesSearch && matchesCategory && matchesDate
  })

  // 정렬 (중요 핀 고정 우선 -> 최신순)
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">복습 영상</h1>
        <p className="text-slate-500 dark:text-slate-400">
          놓친 강의를 다시 보거나, 부족한 부분을 복습하세요.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="강의명 검색..." 
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* 기간 설정 Select */}
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

            {/* [수정] 동적 카테고리 Select */}
            <div className="w-full sm:w-[160px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="과목 선택" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 과목</SelectItem>
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 기간 직접 입력 UI */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : sortedVideos.length > 0 ? (
          sortedVideos.map((video) => {
            const videoId = getYouTubeId(video.youtubeUrl)
            const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null

            return (
              <Card 
                key={video.id} 
                className={`group h-full flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative
                  ${video.isPinned ? "border-blue-500/50 dark:border-blue-500/50 ring-1 ring-blue-500/20" : ""}
                `}
              >
                {video.isPinned && (
                  <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md pointer-events-none">
                    <Pin className="w-3 h-3 fill-current" />
                    중요
                  </div>
                )}

                <a 
                  href={video.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative block aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800"
                >
                  {thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600" />
                  )}

                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </div>
                </a>

                <CardHeader className="pb-2 space-y-1">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="capitalize text-slate-500 border-slate-200 dark:border-slate-700">
                      {video.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-snug text-slate-900 dark:text-white line-clamp-2">
                    {video.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-4 flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {video.description}
                  </p>
                </CardContent>

                <CardFooter className="pt-0 mt-auto flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {video.date}
                  </div>
                  
                  <a 
                    href={video.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1.5 border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-900 transition-colors"
                    >
                      <Youtube className="w-4 h-4 text-red-600 dark:text-red-500" />
                      <span className="font-semibold">YouTube 시청</span>
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            <PlayCircle className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">검색된 영상이 없습니다.</p>
            <p className="text-sm mt-1">검색어나 기간 설정을 확인해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}