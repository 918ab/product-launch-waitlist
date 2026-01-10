"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
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
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Search, Filter, BookOpen, CheckCircle, Star, BarChart, Loader2, ImageIcon } from "lucide-react"

// DB 데이터 타입 정의
interface Course {
  _id: string
  title: string
  description: string
  category: string
  level: string
  color: string
  intro: string
  curriculum: string[]
  thumbnail?: string // ✅ [추가] 썸네일 이미지 필드 (없을 수도 있음)
}

export default function ContentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // DB 데이터를 담을 State
  const [contents, setContents] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 동적 카테고리 목록 상태
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([])

  // API에서 커리큘럼 데이터 가져오기
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses", { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setContents(data)

          // DB 데이터에서 카테고리만 뽑아서 중복 제거
          const categories = Array.from(new Set(data.map((item: any) => item.category))) as string[]
          setUniqueCategories(categories)
        }
      } catch (error) {
        console.error("데이터 로딩 실패", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filteredContents = contents.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">컨텐츠 소개</h1>
        <p className="text-slate-500 dark:text-slate-400">
          배문환 영어 연구소만의 체계적인 커리큘럼을 만나보세요.
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="강의명 검색..." 
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="카테고리" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 보기</SelectItem>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 컨텐츠 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredContents.length > 0 ? (
          filteredContents.map((content) => (
            <Dialog key={content._id}>
              <DialogTrigger asChild>
                <Card className="group overflow-hidden cursor-pointer border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                  
                  {/* ✅ [수정] 썸네일 영역: 이미지가 있으면 이미지, 없으면 기존 그라데이션 */}
                  <div className="h-44 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {content.thumbnail ? (
                      <>
                        <img 
                          src={content.thumbnail} 
                          alt={content.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* 텍스트 가독성을 위한 은은한 오버레이 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      </>
                    ) : (
                      // 썸네일 없을 때: 기존 그라데이션 배경
                      <div className={`h-full w-full bg-gradient-to-br ${content.color || "from-slate-500 to-slate-400"} flex items-center justify-center`}>
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                         <BookOpen className="text-white w-12 h-12 opacity-80 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}

                    {/* 레벨 뱃지 (우측 상단) */}
                    <Badge className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white border-0 hover:bg-black/70">
                      {content.level}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 w-full">
                        <Badge variant="outline" className="mb-2 text-slate-500 border-slate-300 dark:border-slate-700 capitalize">
                          {content.category}
                        </Badge>
                        <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {content.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="line-clamp-2 text-slate-500 dark:text-slate-400 min-h-[40px]">
                      {content.description}
                    </CardDescription>
                  </CardContent>

                  <CardFooter className="pt-0 text-sm text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    상세보기 &rarr;
                  </CardFooter>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden p-0">
                {/* ✅ [수정] 모달 헤더: 이미지가 있으면 이미지 배경, 없으면 그라데이션 */}
                <div className="relative h-48 w-full">
                    {content.thumbnail ? (
                        <>
                            <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        </>
                    ) : (
                        <div className={`h-full w-full bg-gradient-to-r ${content.color || "from-slate-500 to-slate-400"}`} />
                    )}
                    
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <div className="flex items-center gap-3">
                            {!content.thumbnail && <BookOpen className="text-white w-8 h-8" />}
                            <DialogTitle className="text-2xl font-bold text-white shadow-sm drop-shadow-md">
                                {content.title}
                            </DialogTitle>
                        </div>
                    </div>
                </div>
                
                <DialogDescription className="sr-only">
                  {content.title} 강의 상세 정보입니다.
                </DialogDescription>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1">
                      <BarChart className="w-3 h-3 mr-1" />
                      난이도: {content.level}
                    </Badge>
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 capitalize">
                      <Filter className="w-3 h-3 mr-1" />
                      분류: {content.category}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        강의 소개
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                        {content.intro || content.description}
                      </p>
                    </div>

                    {content.curriculum && content.curriculum.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          주요 커리큘럼
                        </h3>
                        <ul className="grid gap-2">
                          {content.curriculum.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300 p-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
                                {index + 1}
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                </div>
              </DialogContent>
            </Dialog>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">등록된 컨텐츠가 없습니다.</p>
            <p className="text-sm mt-1">다른 검색어나 카테고리를 선택해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}