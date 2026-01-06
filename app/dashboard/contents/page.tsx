"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  // DialogHeader, // 여기서는 커스텀 디자인을 위해 Header 컴포넌트 대신 직접 div로 짭니다.
  DialogTitle,    // ★ 중요: 이걸 꼭 써야 에러가 안 납니다.
  DialogTrigger,
  DialogDescription, // 접근성을 위해 추가 권장
} from "@/components/ui/dialog"
import { Search, Filter, BookOpen, CheckCircle, Star, BarChart } from "lucide-react"

// 더미 데이터 (동일함)
const contents = [
  {
    id: 1,
    title: "기초 문법 마스터",
    description: "영어의 뼈대를 세우는 필수 문법 강의입니다.",
    category: "grammar",
    level: "초급",
    color: "from-blue-500 to-cyan-400",
    details: {
      intro: "영어 공부를 처음 시작하거나, 기초가 부족한 분들을 위한 완벽 가이드입니다. 8품사부터 문장의 5형식까지 쉽고 재미있게 설명합니다.",
      curriculum: ["1주차: 영어 문장의 기본 구조 (8품사)", "2주차: 동사의 시제 완벽 정리", "3주차: 명사와 관사, 대명사", "4주차: 문장의 5형식 실전 연습"],
    }
  },
  {
    id: 2,
    title: "실전 독해 전략 (수능/모의고사)",
    description: "빠르고 정확하게 정답을 찾는 독해 스킬을 전수합니다.",
    category: "reading",
    level: "중급",
    color: "from-purple-500 to-pink-400",
    details: {
      intro: "지문을 다 읽지 않아도 정답이 보입니다. 출제자의 의도를 파악하고 논리적으로 정답을 추론하는 배문환 선생님만의 독해 비법을 공개합니다.",
      curriculum: ["빈칸 추론 논리적 해결법", "순서 배열 및 문장 삽입 꿀팁", "주제 및 제목 찾기 10초 컷", "장문 독해 시간 단축 스킬"],
    }
  },
  {
    id: 3,
    title: "고급 어휘 암기 (Voca 3000)",
    description: "빈출 어휘와 유의어, 반의어를 체계적으로 학습합니다.",
    category: "vocabulary",
    level: "고급",
    color: "from-emerald-500 to-teal-400",
    details: {
      intro: "단어 암기가 지루하다면 이 강의를 선택하세요. 어원 학습법과 연상 기억법을 통해 한 번 외우면 절대 까먹지 않는 기적을 경험하세요.",
      curriculum: ["수능 필수 빈출 단어 1000", "헷갈리기 쉬운 혼동 어휘 정리", "접두사/접미사로 확장하는 어휘력", "실전 예문으로 익히는 고급 어휘"],
    }
  },
  {
    id: 4,
    title: "리스닝 만점 귀뚫기",
    description: "미국식 발음 원리와 연음 법칙을 완벽하게 이해합니다.",
    category: "listening",
    level: "초급",
    color: "from-orange-400 to-amber-300",
    details: {
      intro: "들리지 않는 영어를 들리게 만들어 드립니다. 딕테이션 훈련과 쉐도잉 연습을 통해 리스닝 실력을 단기간에 끌어올립니다.",
      curriculum: ["연음 법칙과 발음 기호", "핵심 키워드 듣기 연습", "상황별 필수 표현 청취", "실전 모의고사 풀이"],
    }
  },
]

export default function ContentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

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
              <SelectItem value="grammar">문법 (Grammar)</SelectItem>
              <SelectItem value="reading">독해 (Reading)</SelectItem>
              <SelectItem value="vocabulary">어휘 (Voca)</SelectItem>
              <SelectItem value="listening">듣기 (Listening)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContents.length > 0 ? (
          filteredContents.map((content) => (
            <Dialog key={content.id}>
              <DialogTrigger asChild>
                <Card className="group overflow-hidden cursor-pointer border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                  <div className={`h-40 w-full bg-gradient-to-br ${content.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    <BookOpen className="text-white w-12 h-12 opacity-80 group-hover:scale-110 transition-transform duration-500" />
                    <Badge className="absolute top-3 right-3 bg-black/40 backdrop-blur-md hover:bg-black/60 border-0">
                      {content.level}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Badge variant="outline" className="mb-2 text-slate-500 border-slate-300 dark:border-slate-700 capitalize">
                          {content.category}
                        </Badge>
                        <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {content.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="line-clamp-2 text-slate-500 dark:text-slate-400">
                      {content.description}
                    </CardDescription>
                  </CardContent>

                  <CardFooter className="pt-0 text-sm text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    상세보기 &rarr;
                  </CardFooter>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden p-0">
                {/* [수정됨] 
                  기존: <h2>{content.title}</h2> 
                  변경: <DialogTitle>{content.title}</DialogTitle>
                */}
                <div className={`h-32 w-full bg-gradient-to-r ${content.color} p-6 flex items-end`}>
                  <div className="flex items-center gap-3">
                     <BookOpen className="text-white w-8 h-8" />
                     <DialogTitle className="text-2xl font-bold text-white shadow-sm">
                       {content.title}
                     </DialogTitle>
                  </div>
                </div>
                
                {/* 접근성 경고 방지를 위한 설명 추가 (Visually Hidden 될 수 있음) */}
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
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                        {content.details.intro}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        주요 커리큘럼
                      </h3>
                      <ul className="grid gap-2">
                        {content.details.curriculum.map((item, index) => (
                           <li key={index} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300 p-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                             <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
                               {index + 1}
                             </span>
                             {item}
                           </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </DialogContent>
            </Dialog>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">검색된 컨텐츠가 없습니다.</p>
            <p className="text-sm mt-1">다른 검색어나 카테고리를 선택해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}