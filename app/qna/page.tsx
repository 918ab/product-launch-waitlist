"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "../components/header"
import { Toaster } from "@/components/ui/toaster"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  Lock, 
  User, 
  Clock, 
  ShieldAlert, 
  CornerDownRight
} from "lucide-react"

// 배경 스타일
const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 1;
  }
  .content { position: relative; z-index: 2; }
`

const qnaList = [
  { 
    id: 1, 
    title: "수강 신청은 어떻게 하나요?", 
    question: "홈페이지에서 결제하려고 하는데 카드 결제가 안 떠요.",
    answer: "안녕하세요. 현재 PG사 점검으로 인해 무통장 입금만 가능합니다.",
    author: "김학생", 
    date: "2024-01-14", 
    status: "answered", 
    isSecret: false 
  },
  { 
    id: 2, 
    title: "복습 영상 다운로드가 가능한가요? (비공개)", 
    question: "비공개 질문입니다.",
    answer: "비공개 답변입니다.",
    author: "이학생", 
    date: "2024-01-12", 
    status: "answered", 
    isSecret: true 
  },
  { 
    id: 3, 
    title: "학습 자료 PDF 열람 방법 문의", 
    question: "자료실에 있는 PDF가 안 열려요. 권한이 없다고 나옵니다.",
    answer: null,
    author: "박학생", 
    date: "2024-01-10", 
    status: "waiting", 
    isSecret: false 
  },
]

export default function QnaPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredList = qnaList.filter((item) => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="min-h-screen text-white selection:bg-blue-500/30" style={{ background: "radial-gradient(circle at center, #111827, #000000)" }}>
      <style jsx global>{backgroundStyle}</style>
      <div className="bg-pattern"></div>
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="content w-full">
        <Header isLoggedIn={false} />

        <div className="min-h-screen pt-28 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* 상단 타이틀 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">QNA</h1>
              <p className="text-gray-400">자주 묻는 질문을 확인하세요</p>
            </div>

            {/* [변경됨] 로그인 안내 박스 (질문하기 버튼 대체) */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-8 backdrop-blur-sm">
              <p className="text-blue-300 text-sm text-center">
                질문을 작성하려면 <Link href="/login" className="underline font-medium hover:text-white transition-colors">로그인</Link>이 필요합니다.
              </p>
            </div>


            {/* 게시글 리스트 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl ring-1 ring-white/10 overflow-hidden shadow-2xl">
              <div className="divide-y divide-white/10">
                {filteredList.map((item) => {
                  const canView = !item.isSecret
                  const displayAuthor = item.isSecret ? "익명" : item.author

                  return (
                    <Dialog key={item.id}>
                      <DialogTrigger asChild>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-white/5 transition-colors cursor-pointer group gap-3 text-left">
                          <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${item.status === 'answered' ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"}`}>
                                {item.status === 'answered' ? "답변완료" : "답변대기"}
                              </span>
                              {item.isSecret && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                            </div>
                            <span className="text-white font-medium group-hover:text-blue-300 transition-colors truncate">
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 text-gray-500 text-sm w-full sm:w-auto mt-1 sm:mt-0 shrink-0">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              {displayAuthor}
                            </span>
                            <span className="flex items-center gap-1.5 tabular-nums">
                              <Clock className="w-3.5 h-3.5" />
                              {item.date}
                            </span>
                          </div>
                        </div>
                      </DialogTrigger>

                      {/* 상세 보기 모달 */}
                      <DialogContent className="bg-[#1e293b] border-slate-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl leading-relaxed flex items-center gap-2">
                            {canView ? item.title : "비공개 글입니다."}
                            {item.isSecret && <Lock className="w-5 h-5 text-gray-500" />}
                          </DialogTitle>
                          <DialogDescription className="text-slate-400 flex gap-4 text-sm mt-2">
                            <span>작성자: {displayAuthor}</span>
                            <span>작성일: {item.date}</span>
                          </DialogDescription>
                        </DialogHeader>

                        <div className="py-6">
                          {canView ? (
                            <div className="space-y-6">
                              {/* 질문 */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-white flex items-center gap-2 text-lg">
                                  <span className="text-blue-400">Q.</span> 질문
                                </h4>
                                <div className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-white/5">
                                  {item.question}
                                </div>
                              </div>
                              {/* 답변 */}
                              {item.answer ? (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-white flex items-center gap-2 text-lg">
                                    <span className="text-green-400">A.</span> 답변
                                  </h4>
                                  <div className="text-slate-300 leading-relaxed bg-blue-900/20 p-4 rounded-lg border border-blue-500/20 flex gap-3">
                                    <CornerDownRight className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    <div>{item.answer}</div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-6 text-slate-500 bg-white/5 rounded-lg border border-dashed border-white/10">
                                  아직 답변이 등록되지 않았습니다.
                                </div>
                              )}
                            </div>
                          ) : (
                            // 비공개 글일 때 보이는 화면
                            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 bg-white/5 rounded-xl border border-white/10">
                              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                                <ShieldAlert className="w-8 h-8 text-slate-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-white">비공개 글입니다.</h3>
                                <p className="text-slate-400 text-sm mt-1">
                                  작성자와 관리자만 내용을 확인할 수 있습니다.<br/>
                                </p>
                              </div>
                              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Link href="/login">로그인 하기</Link>
                              </Button>
                            </div>
                          )}
                        </div>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent">닫기</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )
                })}
              </div>
            </div>
            
            {/* 페이지네이션 (디자인용) */}
            <div className="flex justify-center mt-8 gap-2">
              <button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">1</button>
            </div>

          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}