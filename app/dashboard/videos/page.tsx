"use client"

import { useState } from "react"
import { Play, Calendar, ExternalLink, Search, Filter, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const categories = ["전체", "문법", "독해", "어휘", "듣기", "회화"]

const videos = [
  {
    id: 1,
    title: "1강. 영문법 기초 - 품사의 이해",
    description: "영어 문장 구성의 기본이 되는 8품사에 대해 학습합니다.",
    date: "2024-01-15",
    duration: "45:30",
    youtubeUrl: "https://youtube.com/watch?v=example1",
    thumbnail: "/english-grammar-lesson.jpg",
    category: "문법",
  },
  {
    id: 2,
    title: "2강. 시제의 이해 - 현재, 과거, 미래",
    description: "영어의 기본 시제와 활용법을 배웁니다.",
    date: "2024-01-12",
    duration: "52:15",
    youtubeUrl: "https://youtube.com/watch?v=example2",
    thumbnail: "/english-tense-lesson.jpg",
    category: "문법",
  },
  {
    id: 3,
    title: "3강. 완료 시제 완벽 정리",
    description: "현재완료, 과거완료, 미래완료 시제를 마스터합니다.",
    date: "2024-01-10",
    duration: "48:00",
    youtubeUrl: "https://youtube.com/watch?v=example3",
    thumbnail: "/english-perfect-tense.jpg",
    category: "문법",
  },
  {
    id: 4,
    title: "4강. 관계대명사 총정리",
    description: "who, which, that 등 관계대명사의 모든 것을 배웁니다.",
    date: "2024-01-08",
    duration: "55:20",
    youtubeUrl: "https://youtube.com/watch?v=example4",
    thumbnail: "/english-relative-pronoun.jpg",
    category: "문법",
  },
  {
    id: 5,
    title: "5강. 독해의 기술 - 문맥 파악",
    description: "지문의 흐름을 빠르게 파악하는 방법을 배웁니다.",
    date: "2024-01-05",
    duration: "42:10",
    youtubeUrl: "https://youtube.com/watch?v=example5",
    thumbnail: "/reading-comprehension-english-lesson.jpg",
    category: "독해",
  },
  {
    id: 6,
    title: "6강. 필수 어휘 암기법",
    description: "효율적인 어휘 암기 방법과 필수 단어를 학습합니다.",
    date: "2024-01-03",
    duration: "38:45",
    youtubeUrl: "https://youtube.com/watch?v=example6",
    thumbnail: "/vocabulary-memorization-english-lesson.jpg",
    category: "어휘",
  },
]

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === "전체" || video.category === selectedCategory
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleVideoClick = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">복습영상</h1>
          <p className="text-slate-500">수업 복습 영상을 시청하세요.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Video className="w-4 h-4" />
          <span>총 {filteredVideos.length}개의 영상</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="영상 검색..."
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

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all group"
            >
              {/* Thumbnail */}
              <div
                className="relative aspect-video bg-slate-100 cursor-pointer overflow-hidden"
                onClick={() => handleVideoClick(video.youtubeUrl)}
              >
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Play className="w-7 h-7 text-slate-900 ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    {video.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 text-white text-xs font-medium rounded-lg">
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{video.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {video.date}
                  </span>
                  <Button
                    size="sm"
                    className="gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
                    onClick={() => handleVideoClick(video.youtubeUrl)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    시청하기
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
