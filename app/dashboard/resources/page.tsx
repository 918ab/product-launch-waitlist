"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, FileText, Download, Calendar, HardDrive, Loader2, 
  Clock, ArrowRight, RotateCcw, Filter 
} from "lucide-react"

// 인터페이스 정의
interface ResourceFile {
  fileName: string
  filePath: string
  fileSize: string
}

interface Resource {
  _id: string
  title: string
  description: string
  category: string
  files: ResourceFile[] 
  isNewResource: boolean
  createdAt: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // [추가] 동적 카테고리 목록 상태
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([])

  // [추가] 기간 설정 상태 (영상 페이지와 동일)
  const [dateFilter, setDateFilter] = useState("all") 
  const [startDate, setStartDate] = useState("") 
  const [endDate, setEndDate] = useState("")   
  const [tempStart, setTempStart] = useState("")
  const [tempEnd, setTempEnd] = useState("")

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("/api/resources", { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setResources(data)

          // [추가] 데이터에서 중복 없는 카테고리 목록 추출
          const categories = Array.from(new Set(data.map((item: any) => item.category))) as string[]
          setUniqueCategories(categories)
        }
      } catch (error) {
        console.error("자료 로딩 실패", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchResources()
  }, [])

  // [추가] 기간 검색 핸들러
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  // 필터링 로직 (검색 + 카테고리 + 기간)
  const filteredResources = resources.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    
    // [추가] 기간 필터링 로직
    let matchesDate = true
    const itemDate = new Date(item.createdAt) // DB의 createdAt 사용
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 헤더 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">학습 자료실</h1>
        <p className="text-slate-500 dark:text-slate-400">
          필요한 학습 자료를 다운로드하세요.
        </p>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="flex flex-col gap-4">
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

            {/* 카테고리 Select (동적 생성) */}
            <div className="w-full sm:w-[160px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="카테고리" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 자료</SelectItem>
                  {/* DB에 있는 카테고리만 자동으로 표시 */}
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 기간 직접 입력 UI (custom일 때만 표시) */}
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

      {/* 자료 리스트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <Card 
              key={resource._id} 
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all group flex flex-col"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                      {resource.category}
                    </Badge>
                    {resource.isNewResource && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 text-[10px] px-1.5 py-0">
                        NEW
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {resource.title}
                  </CardTitle>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                  <HardDrive className="w-6 h-6" />
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed min-h-[40px]">
                  {resource.description || "자료에 대한 설명이 없습니다."}
                </p>
                
                {/* 파일 리스트 */}
                <div className="space-y-2">
                  {resource.files && resource.files.length > 0 ? (
                    resource.files.map((file, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="truncate">{file.fileName}</span>
                          <span className="text-xs text-slate-400 shrink-0 hidden sm:inline">| {file.fileSize}</span>
                        </div>
                        
                        <a 
                          href={`${file.filePath}?download=1`} 
                          download={file.fileName} 
                          className="flex items-center"
                        >
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-500 hover:text-blue-600">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic">첨부된 파일이 없습니다.</div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50 mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(resource.createdAt)}
                </div>
                <div className="text-xs text-slate-400">
                  총 {resource.files?.length || 0}개의 파일
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">검색된 자료가 없습니다.</p>
            <p className="text-sm mt-1">검색어나 필터 설정을 확인해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}