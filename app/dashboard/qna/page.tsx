"use client"

import { useState, useEffect } from "react"
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
  ShieldAlert,
  Loader2
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface QnaItem {
  _id: string
  title: string
  question: string
  answer?: string
  author: string
  authorId?: string
  status: "waiting" | "answered"
  isSecret: boolean
  createdAt: string
}

export default function QnaPage() {
  const [qnaList, setQnaList] = useState<QnaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // 글쓰기 상태
  const [isWriteOpen, setIsWriteOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newQuestion, setNewQuestion] = useState("")
  const [newIsSecret, setNewIsSecret] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 현재 로그인 유저 정보
  const [currentUser, setCurrentUser] = useState<{ name: string; _id: string } | null>(null)

  const { toast } = useToast()

  // 1. 초기 데이터 로딩
  useEffect(() => {
    // 유저 정보 가져오기
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setCurrentUser(parsedUser)
      } catch (e) {
        console.error("유저 정보 파싱 에러")
      }
    }
    fetchQnaList()
  }, [])

  const fetchQnaList = async () => {
    try {
      const res = await fetch("/api/qna")
      if (res.ok) {
        const data = await res.json()
        setQnaList(data)
      }
    } catch (error) {
      console.error("QnA 로딩 실패", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 2. 질문 등록
  const handleRegister = async () => {
    if (!currentUser) {
      toast({ title: "로그인이 필요합니다.", variant: "destructive" })
      return
    }
    if (!newTitle.trim() || !newQuestion.trim()) {
      toast({ title: "제목과 내용을 입력해주세요.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/qna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          question: newQuestion,
          isSecret: newIsSecret,
          author: currentUser.name,
          authorId: currentUser._id,
        }),
      })

      if (res.ok) {
        toast({ title: "질문이 등록되었습니다!" })
        setIsWriteOpen(false)
        setNewTitle(""); setNewQuestion(""); setNewIsSecret(false)
        fetchQnaList()
      } else {
        throw new Error("등록 실패")
      }
    } catch (error) {
      toast({ title: "오류가 발생했습니다.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  // 필터링 및 정렬
  const filteredList = qnaList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 내 글 우선 + 최신순 정렬
  const sortedList = [...filteredList].sort((a, b) => {
    if (!currentUser) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    const aIsMine = a.authorId === currentUser._id
    const bIsMine = b.authorId === currentUser._id
    
    if (aIsMine && !bIsMine) return -1
    if (!aIsMine && bIsMine) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
        
        {/* 질문하기 버튼 & 모달 */}
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
              <DialogDescription>궁금한 내용을 자세히 적어주세요.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">제목</Label>
                <Input 
                  id="title" 
                  placeholder="예: 5형식 동사가 헷갈립니다." 
                  className="bg-white dark:bg-slate-950" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">질문 내용</Label>
                <Textarea 
                  id="content" 
                  placeholder="내용을 입력하세요." 
                  className="min-h-[150px] bg-white dark:bg-slate-950 resize-none"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="secret" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  checked={newIsSecret}
                  onChange={(e) => setNewIsSecret(e.target.checked)}
                />
                <Label htmlFor="secret" className="cursor-pointer">비공개 글로 쓰기</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWriteOpen(false)} disabled={isSubmitting}>취소</Button>
              <Button onClick={handleRegister} className="bg-blue-600 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "등록하기"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 검색 & 필터 */}
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

      {/* 질문 목록 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : sortedList.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedList.map((item) => {
              const isMyPost = 
                currentUser?._id && 
                item.authorId && 
                String(item.authorId) === String(currentUser._id)
              const canView = isMyPost || !item.isSecret
              const displayAuthor = isMyPost ? "나" : (item.isSecret ? "익명" : item.author)

              return (
                <Dialog key={item._id}>
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
                          {isMyPost && <Badge className="bg-blue-600 hover:bg-blue-700">내 질문</Badge>}
                          {item.status === 'answered' ? (
                            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-0">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> 답변완료
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-0">
                              <Clock className="w-3 h-3 mr-1" /> 답변대기
                            </Badge>
                          )}
                          {item.isSecret && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                        <h3 className="font-medium truncate text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 shrink-0">
                        <div className="flex items-center gap-1.5">
                          {isMyPost ? <UserCircle className="w-4 h-4 text-blue-500" /> : <User className="w-4 h-4" />}
                          {displayAuthor}
                        </div>
                        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 hidden sm:block"></div>
                        <div className="tabular-nums">{formatDate(item.createdAt)}</div>
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[80vh] overflow-y-auto">
                    <DialogHeader className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        {item.status === 'answered' ? <Badge className="bg-green-500">답변완료</Badge> : <Badge variant="secondary">답변대기</Badge>}
                        {item.isSecret && <Lock className="w-4 h-4 text-slate-400" />}
                      </div>
                      <DialogTitle className="text-xl font-bold leading-relaxed">
                        {canView ? item.title : "비공개 질문입니다."}
                      </DialogTitle>
                      <DialogDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {displayAuthor}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(item.createdAt)}</span>
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-8">
                      {canView ? (
                        <div className="space-y-8">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">Q</span>
                              질문 내용
                            </h4>
                            <div className="pl-8 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {item.question}
                            </div>
                          </div>

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
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                          <ShieldAlert className="w-12 h-12 text-slate-300" />
                          <h3 className="text-lg font-bold">비공개 글입니다.</h3>
                          <p className="text-slate-500">작성자와 선생님만 확인할 수 있습니다.</p>
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                       <Button type="button" variant="secondary">닫기</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
            <p>등록된 질문이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}