"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Demo QNA data
const qnaList = [
  {
    id: 1,
    title: "관계대명사 that과 which의 차이가 궁금합니다",
    author: "학생1",
    date: "2024-01-14",
    answered: true,
  },
  {
    id: 2,
    title: "완료시제 복습 자료 문의드립니다",
    author: "학생2",
    date: "2024-01-12",
    answered: true,
  },
  {
    id: 3,
    title: "다음 주 수업 관련 질문입니다",
    author: "학생3",
    date: "2024-01-10",
    answered: false,
  },
]

export default function DashboardQnaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast({
        title: "오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "질문 등록 완료",
      description: "질문이 성공적으로 등록되었습니다.",
    })

    setTitle("")
    setContent("")
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">QNA</h1>
          <p className="text-gray-500">궁금한 점을 질문해주세요.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          질문하기
        </Button>
      </div>

      {/* QNA List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {qnaList.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/qna/${item.id}`}
              className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded ${
                    item.answered ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {item.answered ? "답변완료" : "답변대기"}
                </span>
                <span className="font-medium text-gray-900">{item.title}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <span>{item.author}</span>
                <span>{item.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">질문하기</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  placeholder="질문 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <Textarea
                  id="content"
                  placeholder="질문 내용을 입력하세요"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  취소
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  등록
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
