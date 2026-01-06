"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { 
  Search, 
  Filter, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Lock, 
  User, 
  PenLine,
  CornerDownRight,
  UserCircle,
  ShieldAlert // 비공개 알림 아이콘
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// 현재 로그인한 사용자 (가정)
const CURRENT_USER = "김학생"

const qnaList = [
  {
    id: 5,
    title: "교재 배송이 아직 안 왔어요 ㅠㅠ",
    question: "3일 전에 주문했는데 아직 배송 준비 중이라고 뜹니다.",
    answer: "안녕하세요. 택배사 파업으로 지연되고 있습니다.",
    date: "2025-01-21",
    author: "정급함",
    status: "answered",
    isSecret: true, // 남의 비공개 글 -> 익명 처리 & 내용 숨김
  },
  {
    id: 1,
    title: "1강 문장의 5형식에서 4형식 전환 질문입니다.",
    question: "4형식을 3형식으로 바꿀 때 전치사 for를 쓰는 동사들이 헷갈립니다.",
    answer: "make, buy, get, cook, find, build 등이 있습니다. MBC GF로 외우세요!",
    date: "2025-01-20",
    author: "김학생", // 나 -> "나"로 표시
    status: "answered", 
    isSecret: false,
  },
  {
    id: 2,
    title: "이번 주 월간 테스트 범위가 어디까지인가요?",
    question: "교재 30페이지까지가 맞나요?",
    answer: "네, 맞습니다.",
    date: "2025-01-19",
    author: "이수강",
    status: "answered",
    isSecret: false,
  },
  {
    id: 6,
    title: "선생님, 저 이번에 1등급 받을 수 있을까요?",
    question: "열심히 하고 있는데 불안합니다.",
    answer: null,
    date: "2025-01-22",
    author: "김학생", // 나 (비공개) -> "나"로 표시 & 내용은 보임
    status: "waiting",
    isSecret: true,
  },
  {
    id: 3,
    title: "선생님 상담 요청드립니다. (비공개)",
    question: "비공개 글입니다.",
    answer: null,
    date: "2025-01-18",
    author: "박고민", // 남의 비공개 글 -> 익명
    status: "waiting",
    isSecret: true,
  },
  {
    id: 4,
    title: "관계대명사 that은 언제 못 쓰나요?",
    question: "콤마 뒤랑 전치사 뒤에 못 쓴다고 배웠는데...",
    answer: null,
    date: "2025-01-18",
    author: "최열공",
    status: "waiting",
    isSecret: false,
  },
]

export default function QnaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isWriteOpen, setIsWriteOpen] = useState(false)

  const filteredList = qnaList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedList = [...filteredList].sort((a, b) => {
    const aIsMine = a.author === CURRENT_USER
    const bIsMine = b.author === CURRENT_USER
    if (aIsMine && !bIsMine) return -1
    if (!aIsMine && bIsMine) return 1
    return b.id - a.id
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Q&A 게시판</h1>
          <p className="text-slate-500 dark:text-slate-400">
            궁금한 점을 질문하면 선생님이 직접 답변해 드립니다.
          </p>
        </div>
        
        <Dialog open={isWriteOpen} onOpenChange={setIsWriteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md gap-2">
              <PenLine className="w-4 h-4" />
              질문하기
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle>새로운 질문 작성</DialogTitle>
              <DialogDescription>
                궁금한 내용을 자세히 적어주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">제목</Label>
                <Input id="title" placeholder="예: 5형식 동사가 헷갈립니다." className="bg-white dark:bg-slate-950" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">질문 내용</Label>
                <Textarea 
                  id="content" 
                  placeholder="내용을 입력하세요." 
                  className="min-h-[150px] bg-white dark:bg-slate-950 resize-none" 
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="secret" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <Label htmlFor="secret" className="cursor-pointer">비공개 글로 쓰기</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWriteOpen(false)}>취소</Button>
              <Button type="submit" className="bg-blue-600 text-white" onClick={() => setIsWriteOpen(false)}>등록하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="제목 또는 작성자 검색..." 
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="답변 상태" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 보기</SelectItem>
              <SelectItem value="waiting">답변 대기중</SelectItem>
              <SelectItem value="answered">답변 완료</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm min-h-[400px]">
        {sortedList.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedList.map((item) => {
              const isMyPost = item.author === CURRENT_USER
              
              // [로직] 열람 권한 확인 (내 글이거나, 비밀글이 아닌 경우)
              const canView = isMyPost || !item.isSecret

              // [로직] 작성자 표시 (내 글이면 "나", 남의 비밀글이면 "익명", 그 외엔 이름)
              const displayAuthor = isMyPost ? "나" : (item.isSecret ? "익명" : item.author)

              return (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <div 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 transition-all cursor-pointer group gap-4
                        ${isMyPost 
                          ? "bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20" 
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}
                      `}
                    >
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {isMyPost && (
                            <Badge className="bg-blue-600 hover:bg-blue-700">내 질문</Badge>
                          )}
                          {item.status === 'answered' ? (
                            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-0 hover:bg-green-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> 답변완료
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-0">
                              <Clock className="w-3 h-3 mr-1" /> 답변대기
                            </Badge>
                          )}
                          {item.isSecret && (
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                        
                        <h3 className={`font-medium truncate text-base transition-colors
                          ${isMyPost 
                            ? "text-blue-900 dark:text-blue-100 font-semibold" 
                            : "text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"}
                        `}>
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-400 shrink-0">
                        <div className={`flex items-center gap-1.5 ${isMyPost ? "text-blue-600 dark:text-blue-400 font-medium" : ""}`}>
                          {isMyPost ? <UserCircle className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          {/* [수정] 위에서 계산한 displayAuthor 사용 */}
                          {displayAuthor}
                        </div>
                        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 hidden sm:block"></div>
                        <div className="font-variant-numeric tabular-nums">
                          {item.date}
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[80vh] overflow-y-auto">
                    <DialogHeader className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        {item.status === 'answered' ? (
                          <Badge className="bg-green-500">답변완료</Badge>
                        ) : (
                          <Badge variant="secondary">답변대기</Badge>
                        )}
                        {item.isSecret && <Lock className="w-4 h-4 text-slate-400" />}
                      </div>
                      
                      {/* [수정] 제목 표시 */}
                      <DialogTitle className="text-xl font-bold leading-relaxed">
                        {canView ? item.title : "비공개 질문입니다."}
                      </DialogTitle>
                      
                      <DialogDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {displayAuthor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.date}
                        </span>
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-8">
                      {/* [수정] 권한에 따라 내용 표시 분기 */}
                      {canView ? (
                        <div className="space-y-8">
                          {/* 질문 */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">Q</span>
                              질문 내용
                            </h4>
                            <div className="pl-8 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {item.question}
                            </div>
                          </div>

                          {/* 답변 */}
                          {item.answer ? (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl space-y-3 border border-blue-100 dark:border-blue-900/30">
                              <h4 className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                <CornerDownRight className="w-5 h-5" />
                                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">A</span>
                                선생님 답변
                              </h4>
                              <div className="pl-8 text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                                {item.answer}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-500">
                              <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                              <p>아직 답변이 등록되지 않았습니다.</p>
                              <p className="text-xs mt-1">조금만 기다려주시면 빠르게 답변해 드릴게요!</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        // [권한 없음] 비공개 안내 화면
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                            <ShieldAlert className="w-8 h-8 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">비공개 글입니다.</h3>
                          <p className="text-slate-500 dark:text-slate-400">작성자와 선생님만 확인할 수 있는 글입니다.</p>
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <DialogClose asChild>
                         <Button type="button" variant="secondary" className="w-full sm:w-auto">닫기</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">등록된 질문이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}