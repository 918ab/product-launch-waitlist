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
  Youtube
} from "lucide-react"

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}


const videos = [
  {
    id: 1,
    title: "영어 문장의 5형식 완벽 정리 (기초)",
    description: "영어 문장의 뼈대가 되는 5가지 형식을 예문과 함께 완벽하게 정리합니다. (예시: EBS 영어)",
    category: "grammar",
    duration: "12:30",
    date: "2025-01-20",
    isPinned: true,
    // 실제 유튜브 링크 (EBS English)
    youtubeUrl: "https://youtu.be/M11SvDtPBhA?si=XdOCTd90CskjU0XD" 
  },
  {
    id: 2,
    title: "빈칸 추론, 논리적으로 푸는 법",
    description: "오답률 1위 빈칸 추론, 감으로 찍지 말고 논리로 푸세요. (예시: 대성마이맥)",
    category: "reading",
    duration: "15:45",
    date: "2025-01-18",
    isPinned: true,
    // 실제 유튜브 링크 (수능 영어 강의 예시)
    youtubeUrl: "https://www.youtube.com/watch?v=Jd1tXyS_c9Q" 
  },
  {
    id: 3,
    title: "TED: 새로운 언어를 배우는 비결",
    description: "언어 천재가 말하는 외국어를 빨리 습득하는 방법입니다. (예시: TED)",
    category: "listening",
    duration: "18:20",
    date: "2024-03-15",
    isPinned: false,
    // 실제 유튜브 링크 (TED)
    youtubeUrl: "https://www.youtube.com/watch?v=-WLHr1_EVtQ" 
  },
  {
    id: 4,
    title: "수능 필수 영단어 - 이동 중 암기",
    description: "하루 30분, 이동 시간에 듣는 단어장. 어원 설명 포함. (예시: 단어장)",
    category: "vocabulary",
    duration: "1:00:00",
    date: "2024-11-10",
    isPinned: false,
    // 실제 유튜브 링크 (단어장 ASMR)
    youtubeUrl: "https://www.youtube.com/watch?v=33G_5VuvF4o" 
  },
  {
    id: 5,
    title: "관계대명사 vs 관계부사 차이점",
    description: "많은 학생들이 헷갈려하는 관계사 파트, 명쾌하게 구분해 드립니다.",
    category: "grammar",
    duration: "08:15",
    date: "2024-12-05",
    isPinned: false,
    // 실제 유튜브 링크 (문법 강의)
    youtubeUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE" 
  },
]

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all") 
  const [startDate, setStartDate] = useState("") 
  const [endDate, setEndDate] = useState("")   
  const [tempStart, setTempStart] = useState("")
  const [tempEnd, setTempEnd] = useState("")

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

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || video.category === categoryFilter
    
    let matchesDate = true
    const itemDate = new Date(video.date)
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

    return matchesSearch && matchesCategory && matchesDate
  })

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
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
                  <SelectItem value="grammar">문법 (Grammar)</SelectItem>
                  <SelectItem value="reading">독해 (Reading)</SelectItem>
                  <SelectItem value="listening">듣기 (Listening)</SelectItem>
                  <SelectItem value="vocabulary">어휘 (Voca)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVideos.length > 0 ? (
          sortedVideos.map((video) => {
            const videoId = getYouTubeId(video.youtubeUrl)
            // 썸네일 URL 생성 (maxresdefault가 없으면 hqdefault 사용 - 여기선 maxresdefault 사용)
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
                  {/* 실제 썸네일 이미지 표시 */}
                  {thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    // 썸네일 없을 경우 기본 그라데이션
                    <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600" />
                  )}

                  {/* 오버레이 (어둡게 처리 + 재생 버튼) */}
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