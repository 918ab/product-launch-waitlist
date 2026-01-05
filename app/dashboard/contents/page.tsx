"use client"

import { BookOpen, CheckCircle } from "lucide-react"

const contents = [
  {
    title: "기초 영문법",
    description: "영어 문법의 기초를 탄탄하게 다지는 과정입니다.",
    lessons: 12,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "독해 마스터",
    description: "다양한 지문을 통해 독해력을 향상시킵니다.",
    lessons: 20,
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "영어 어휘",
    description: "필수 어휘를 체계적으로 학습합니다.",
    lessons: 30,
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "듣기 훈련",
    description: "영어 듣기 실력을 높이는 훈련 과정입니다.",
    lessons: 15,
    color: "from-orange-500 to-orange-600",
  },
]

export default function ContentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">컨텐츠 소개</h1>
        <p className="text-gray-500">배문환 영어 연구소에서 제공하는 학습 컨텐츠입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contents.map((content, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${content.color}`} />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${content.color} flex items-center justify-center flex-shrink-0`}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{content.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{content.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{content.lessons}개 강의</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
