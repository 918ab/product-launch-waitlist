"use client"

import Link from "next/link"
import { FolderOpen, Video, MessageCircle, BookOpen } from "lucide-react"

const quickLinks = [
  {
    name: "컨텐츠소개",
    description: "학습 컨텐츠 안내",
    href: "/dashboard/contents",
    icon: BookOpen,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "자료실",
    description: "학습 자료 다운로드",
    href: "/dashboard/resources",
    icon: FolderOpen,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "복습영상",
    description: "복습 영상 시청",
    href: "/dashboard/videos",
    icon: Video,
    color: "from-pink-500 to-pink-600",
  },
  {
    name: "QNA",
    description: "질문하기",
    href: "/dashboard/qna",
    icon: MessageCircle,
    color: "from-orange-500 to-orange-600",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">환영합니다</span>
          <h1 className="text-3xl font-bold mb-2">배문환 영어 연구소</h1>
          <p className="text-blue-100 max-w-lg">
            체계적인 영어 학습 시스템으로 여러분의 영어 실력 향상을 도와드립니다.
          </p>
          <div className="flex gap-3 mt-6">
            <Link
              href="/dashboard/resources"
              className="px-5 py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              자료실 가기
            </Link>
            <Link
              href="/dashboard/videos"
              className="px-5 py-2.5 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              복습영상 보기
            </Link>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-24 h-24 bg-white/10 rounded-full" />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">바로가기</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{link.name}</h3>
                <p className="text-sm text-gray-500">{link.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
