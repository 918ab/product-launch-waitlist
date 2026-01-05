"use client"

import { use } from "react"
import Link from "next/link"
import { Header } from "../../components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

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

  .content {
    position: relative;
    z-index: 2;
  }
`

// Demo notice detail data
const noticeDetails: Record<string, { title: string; date: string; content: string }> = {
  "1": {
    title: "2024년 겨울학기 수강 안내",
    date: "2024-01-15",
    content: `안녕하세요, 배문환 영어 연구소입니다.

2024년 겨울학기 수강 신청이 시작되었습니다.

■ 수강 신청 기간: 2024년 1월 15일 ~ 1월 31일
■ 수업 시작일: 2024년 2월 1일

관심 있는 분들의 많은 참여 바랍니다.
문의사항은 QNA 게시판을 이용해 주세요.

감사합니다.`,
  },
  "2": {
    title: "설 연휴 휴강 안내 (2/9 ~ 2/12)",
    date: "2024-01-10",
    content: `안녕하세요, 배문환 영어 연구소입니다.

설 연휴 기간 동안 휴강임을 안내드립니다.

■ 휴강 기간: 2024년 2월 9일 ~ 2월 12일
■ 수업 재개: 2024년 2월 13일

복습 영상은 연휴 기간에도 이용 가능합니다.
새해 복 많이 받으세요!

감사합니다.`,
  },
}

export default function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const notice = noticeDetails[id] || {
    title: "공지사항",
    date: "2024-01-01",
    content: "공지사항 내용이 없습니다.",
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background: "radial-gradient(circle at center, #1E40AF, #000000)",
      }}
    >
      <style jsx global>
        {backgroundStyle}
      </style>
      <div className="bg-pattern"></div>
      <div className="content w-full">
        <Header isLoggedIn={false} />

        <div className="min-h-screen pt-28 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/notices">
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록으로
              </Button>
            </Link>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl ring-1 ring-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/10">
                <h1 className="text-2xl font-bold text-white mb-2">{notice.title}</h1>
                <p className="text-gray-500">{notice.date}</p>
              </div>
              <div className="p-8">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">{notice.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster
        toastOptions={{
          style: {
            background: "rgb(23 23 23)",
            color: "white",
            border: "1px solid rgb(63 63 70)",
          },
          className: "rounded-xl",
          duration: 5000,
        }}
      />
    </main>
  )
}
