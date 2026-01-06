"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  MessageCircle, 
  CheckCircle2, 
  Lock, 
  User, 
  CornerDownRight, 
  Send,
  Calendar,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"

const initialQna = [
  { 
    id: 1, 
    title: "1강 문장의 5형식 질문입니다.", 
    question: "4형식을 3형식으로 바꿀 때 전치사 for를 쓰는 동사들이 헷갈립니다.", 
    author: "김학생", 
    date: "2025-01-22", 
    status: "waiting", 
    answer: "",
    isSecret: false 
  },
  { 
    id: 2, 
    title: "교재 배송이 언제 시작되나요? (비공개)", 
    question: "주문한지 3일 지났는데 아직 배송준비중입니다.", 
    author: "이수강", 
    date: "2025-01-21", 
    status: "waiting", 
    answer: "",
    isSecret: true 
  },
  { 
    id: 3, 
    title: "관계대명사 that 사용법", 
    question: "계속적 용법에서는 that을 쓸 수 없나요?", 
    author: "박열공", 
    date: "2025-01-20", 
    status: "answered", 
    answer: "네, 맞습니다.",
    isSecret: false 
  },
  { 
    id: 4, 
    title: "선생님 상담 요청드려요.", 
    question: "성적이 너무 안 올라서 고민입니다...", 
    author: "최고민", 
    date: "2025-01-19", 
    status: "answered", 
    answer: "고민이 많겠네요.",
    isSecret: true 
  },
]

export default function AdminQnaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("waiting")
  const [qnaList, setQnaList] = useState(initialQna)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [answerText, setAnswerText] = useState("")

  const filteredList = qnaList.filter(item => {
    const matchTab = activeTab === "all" ? true : item.status === activeTab
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.author.includes(searchTerm)
    return matchTab && matchSearch
  })

  const waitingCount = qnaList.filter(item => item.status === "waiting").length

  const handleOpenModal = (item: any) => {
    setSelectedItem(item)
    setAnswerText(item.answer || "")
    setIsModalOpen(true)
  }

  const handleSaveAnswer = () => {
    if (!selectedItem) return
    setQnaList(qnaList.map(item => 
      item.id === selectedItem.id 
        ? { ...item, status: "answered", answer: answerText } 
        : item
    ))
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 헤더 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-slate-800 dark:text-slate-200" />
          Q&A 답변 관리
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          학생들의 질문에 답변을 작성하고 관리합니다.
        </p>
      </div>

      {/* 상단 컨트롤 (탭 + 검색) */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("waiting")}
            className={cn(
              "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
              activeTab === "waiting" 
                ? "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
          >
            답변 대기
            {waitingCount > 0 && (
              <Badge className="h-5 min-w-[20px] px-1 bg-red-600 text-white border-0 hover:bg-red-600 animate-pulse flex items-center justify-center">
                {waitingCount}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab("answered")}
            className={cn(
              "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
              activeTab === "answered" 
                ? "bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
          >
            답변 완료
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "all" 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
          >
            전체 보기
          </button>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="제목/작성자 검색..." 
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ======================================================= */}
      {/* 1. 모바일 뷰 (카드 리스트) - md 미만에서만 보임 */}
      {/* ======================================================= */}
      <div className="md:hidden space-y-4">
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3"
              onClick={() => handleOpenModal(item)}
            >
              {/* 상단: 상태 뱃지 + 날짜 */}
              <div className="flex items-center justify-between">
                {item.status === 'waiting' ? (
                  <Badge variant="secondary" className="bg-red-100 text-red-600 border-0">대기중</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-600 border-0">완료됨</Badge>
                )}
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.date}
                </span>
              </div>

              {/* 중단: 제목 */}
              <div className="flex items-center gap-2">
                {item.isSecret && <Lock className="w-4 h-4 text-slate-400 shrink-0" />}
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                  {item.title}
                </h3>
              </div>

              {/* 하단: 작성자 + 버튼 */}
              <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <User className="w-4 h-4" /> {item.author}
                </div>
                <Button size="sm" variant={item.status === 'waiting' ? "default" : "outline"} className={item.status === 'waiting' ? "bg-blue-600 h-8" : "h-8"}>
                  {item.status === 'waiting' ? "답변하기" : "수정하기"}
                </Button>
              </div>
            </div>
          ))
        ) : (
           <div className="py-10 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
             <p>해당하는 질문이 없습니다.</p>
           </div>
        )}
      </div>

      {/* ======================================================= */}
      {/* 2. 데스크탑 뷰 (테이블) - md 이상에서만 보임 */}
      {/* ======================================================= */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-950">
            <TableRow>
              <TableHead className="w-[120px] text-center">상태</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" onClick={() => handleOpenModal(item)}>
                  <TableCell className="text-center">
                    {item.status === 'waiting' ? (
                      <Badge variant="secondary" className="bg-red-100 text-red-600 border-0 whitespace-nowrap">대기중</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-600 border-0 whitespace-nowrap">완료됨</Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.isSecret && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                      <span className={cn("font-medium truncate max-w-[300px] block", item.status === 'waiting' ? "text-slate-900 dark:text-white font-bold" : "text-slate-600 dark:text-slate-400")}>
                        {item.title}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <User className="w-4 h-4" /> {item.author}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm text-slate-500 whitespace-nowrap">
                    {item.date}
                  </TableCell>
                  
                  <TableCell className="text-right whitespace-nowrap">
                    <Button size="sm" variant={item.status === 'waiting' ? "default" : "outline"} className={item.status === 'waiting' ? "bg-blue-600 hover:bg-blue-700" : ""}>
                      {item.status === 'waiting' ? "답변하기" : "수정하기"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  {activeTab === 'waiting' ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-green-500/50" />
                      <span>모든 질문에 답변을 완료했습니다! 🎉</span>
                    </div>
                  ) : (
                    <span>해당하는 질문이 없습니다.</span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 답변 작성 모달 (공통 사용) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>질문 답변하기</span>
              {selectedItem?.isSecret && <Badge variant="outline" className="text-xs font-normal ml-2"><Lock className="w-3 h-3 mr-1" />비공개 질문</Badge>}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">Q</span>
                {selectedItem?.author} 학생의 질문
                <span className="text-xs font-normal text-slate-400 ml-auto">{selectedItem?.date}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                <p className="font-bold mb-2">{selectedItem?.title}</p>
                {selectedItem?.question}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                <CornerDownRight className="w-5 h-5" />
                선생님 답변 작성
              </div>
              <Textarea 
                placeholder="답변 내용을 입력하세요." 
                className="min-h-[200px] bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 focus:border-blue-400 resize-none text-base"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleSaveAnswer} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Send className="w-4 h-4" />
              답변 등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}