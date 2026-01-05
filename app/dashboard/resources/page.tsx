"use client"

import { useState, Suspense } from "react"
import { FileText, Download, Calendar, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const categories = ["전체", "문법", "어휘", "독해", "듣기", "기타"]

const resources = [
  {
    id: 1,
    title: "기초 영문법 정리 노트",
    description: "필수 문법 사항을 정리한 자료입니다.",
    date: "2024-01-15",
    fileType: "PDF",
    fileSize: "2.4 MB",
    category: "문법",
  },
  {
    id: 2,
    title: "주요 어휘 리스트",
    description: "자주 출제되는 필수 어휘를 정리했습니다.",
    date: "2024-01-12",
    fileType: "PDF",
    fileSize: "1.8 MB",
    category: "어휘",
  },
  {
    id: 3,
    title: "독해 연습 문제집",
    description: "독해력 향상을 위한 연습 문제입니다.",
    date: "2024-01-10",
    fileType: "PDF",
    fileSize: "3.2 MB",
    category: "독해",
  },
  {
    id: 4,
    title: "리스닝 스크립트",
    description: "듣기 훈련용 스크립트 자료입니다.",
    date: "2024-01-08",
    fileType: "PDF",
    fileSize: "1.5 MB",
    category: "듣기",
  },
  {
    id: 5,
    title: "동사 변형 총정리",
    description: "불규칙 동사와 규칙 동사 변형표입니다.",
    date: "2024-01-05",
    fileType: "PDF",
    fileSize: "0.8 MB",
    category: "문법",
  },
  {
    id: 6,
    title: "숙어 200선",
    description: "필수 숙어 200개를 정리한 자료입니다.",
    date: "2024-01-03",
    fileType: "PDF",
    fileSize: "1.2 MB",
    category: "어휘",
  },
]

function ResourcesContent() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "전체" || resource.category === selectedCategory
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">자료실</h1>
          <p className="text-slate-500">학습에 필요한 자료를 다운로드하세요.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FileText className="w-4 h-4" />
          <span>총 {filteredResources.length}개의 자료</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="자료 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{resource.title}</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                      {resource.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{resource.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {resource.date}
                    </span>
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded">{resource.fileType}</span>
                    <span>{resource.fileSize}</span>
                  </div>
                </div>
              </div>
              <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-4 h-4" />
                다운로드
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={null}>
      <ResourcesContent />
    </Suspense>
  )
}
