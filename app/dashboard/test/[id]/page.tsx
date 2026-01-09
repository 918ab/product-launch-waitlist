"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Clock, Bookmark, LayoutGrid, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Lora, Inter } from "next/font/google"

// 영어 지문용 (가독성 명조체)
const lora = Lora({ 
  subsets: ["latin"], 
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

// UI용 (깔끔한 고딕체)
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
})

const EXAM_DATA = {
  id: "exam-101",
  title: "2026학년도 1학기 영어 중간고사",
  timeLimitMinutes: 60,
  questions: [
    {
      id: 1,
      type: "CHOICE",
      score: 3.5,
      text: "다음 빈칸에 들어갈 말로 가장 적절한 것은?",
      content: "Success represents the 1% of your work which results from the 99% that is called ______.",
      options: ["failure", "pleasure", "talent", "fortune", "effort"]
    },
    {
      id: 2,
      type: "CHOICE",
      score: 4.0,
      text: "밑줄 친 'It'이 가리키는 것으로 가장 적절한 것은?",
      content: "It is a long, narrow mark or band that differs in color or texture from the surface on either side of it.",
      options: ["Dot", "Stripe", "Shape", "Square", "Circle"]
    },
    {
      id: 3,
      type: "TEXT",
      score: 10.0,
      text: "다음 글의 주제를 한 문장으로 요약하시오.",
      content: "Many people believe that anger is a negative emotion...",
    },
    {
      id: 4,
      type: "CHOICE",
      score: 3.5,
      text: "다음 중 어법상 틀린 것은?",
      options: [
        "She suggested that we go to the park.",
        "I look forward to seeing you.",
        "He stopped to smoke.",
        "Would you mind opening the window?",
        "I remember to lock the door yesterday."
      ]
    },
    ...Array.from({ length: 5 }).map((_, i) => ({
      id: 5 + i,
      type: "CHOICE",
      score: 4.0,
      text: `[독해] 다음 글을 읽고 물음에 답하시오. (${i+1})`,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      options: ["Option A", "Option B", "Option C", "Option D", "Option E"]
    }))
  ]
}

export default function ExamPage() {
  const [timeLeft, setTimeLeft] = useState(EXAM_DATA.timeLimitMinutes * 60)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([])
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const [isMobileOMROpen, setIsMobileOMROpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleAnswer = (qId: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }))
  }

  const toggleMark = (qId: number) => {
    setMarkedQuestions(prev => prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId])
  }

  const scrollToQuestion = (qId: number) => {
    questionRefs.current[qId]?.scrollIntoView({ behavior: "smooth", block: "center" })
    setIsMobileOMROpen(false)
  }

  const progress = (Object.keys(answers).length / EXAM_DATA.questions.length) * 100

  const preventCopy = (e: React.SyntheticEvent) => {
    e.preventDefault();
  }

  return (
    <div 
      className={cn("fixed inset-0 z-50 bg-[#F8F9FC] dark:bg-slate-950 selection:bg-transparent overflow-y-auto select-none", inter.className)}
      onContextMenu={preventCopy}
      onCopy={preventCopy}
      onCut={preventCopy}
    >
      
      <header className="fixed top-0 left-0 right-0 z-[60] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="h-16 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-base md:text-lg font-bold border transition-colors",
                    timeLeft < 300 
                        ? "bg-red-50 text-red-600 border-red-100 animate-pulse" 
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                )}>
                    <Clock className="w-4 h-4" />
                    {formatTime(timeLeft)}
                </div>
                <h1 className="hidden md:block font-bold text-slate-800 dark:text-white truncate max-w-[300px]">
                    {EXAM_DATA.title}
                </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="lg:hidden"
                    onClick={() => setIsMobileOMROpen(!isMobileOMROpen)}
                >
                    <LayoutGrid className="w-4 h-4 mr-1"/>
                    <span className="text-xs">{Object.keys(answers).length}/{EXAM_DATA.questions.length}</span>
                </Button>
                <Button className="bg-slate-900 hover:bg-violet-600 text-white rounded-lg px-4 md:px-6 font-bold text-sm md:text-base shadow-md transition-all">
                    제출
                </Button>
            </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
             <div 
                className="h-full bg-violet-600 transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
            />
        </div>
      </header>

      <div className="h-16" />

      {/* 메인 컨텐츠 */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 문제 리스트 */}
        <div className="lg:col-span-9 space-y-8 md:space-y-12 pb-20">
          {EXAM_DATA.questions.map((q, idx) => (
            <div 
              key={q.id} 
              ref={el => questionRefs.current[q.id] = el}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2rem] p-5 md:p-10 transition-all border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className="flex gap-3 md:gap-4">
                    <span className="text-2xl md:text-3xl font-black text-slate-200 dark:text-slate-700 leading-none select-none mt-1">
                        {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 text-[10px] md:text-xs">
                                {q.type === 'CHOICE' ? '객관식' : '주관식'}
                            </Badge>
                            <span className="text-xs md:text-sm font-semibold text-slate-400">{q.score}점</span>
                        </div>
                        {/* ✅ [수정] 문제 제목 크기 확대 */}
                        <h3 className={cn("text-xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 leading-snug", lora.className)}>
                            {q.text}
                        </h3>
                    </div>
                </div>
                
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => toggleMark(q.id)}
                    className={cn(
                        "rounded-full shrink-0",
                        markedQuestions.includes(q.id) ? "bg-orange-50 text-orange-500" : "text-slate-300"
                    )}
                >
                    <Bookmark className={cn("w-5 h-5 md:w-6 md:h-6", markedQuestions.includes(q.id) && "fill-current")} />
                </Button>
              </div>

              {q.content && (
                <div className="bg-[#F8F9FC] dark:bg-slate-800/50 p-6 md:p-10 rounded-xl md:rounded-2xl mb-6 md:mb-8 border border-slate-100 dark:border-slate-800">
                    {/* ✅ [수정] 지문 글씨 크기 대폭 확대 (text-xl ~ 2xl) */}
                    <p className={cn("text-xl md:text-2xl text-slate-800 dark:text-slate-300 leading-loose", lora.className)}>
                        {q.content}
                    </p>
                </div>
              )}

              <div className="pl-0 md:pl-10">
                {q.type === 'CHOICE' ? (
                    <div className="grid gap-2 md:gap-3">
                        {q.options?.map((opt, i) => {
                            const isSelected = answers[q.id] === String(i + 1)
                            return (
                                <div 
                                    key={i}
                                    onClick={() => handleAnswer(q.id, String(i + 1))}
                                    className={cn(
                                        "flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl cursor-pointer border-2 transition-all active:scale-[0.99]",
                                        isSelected 
                                            ? "border-violet-600 bg-violet-50/50 dark:bg-violet-900/20 shadow-sm" 
                                            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold border shrink-0",
                                        isSelected 
                                            ? "bg-violet-600 border-violet-600 text-white" 
                                            : "bg-white border-slate-300 text-slate-500"
                                    )}>
                                        {i + 1}
                                    </div>
                                    {/* ✅ [수정] 보기 텍스트 크기도 조금 키움 */}
                                    <span className={cn(
                                        "text-lg md:text-xl font-medium",
                                        lora.className,
                                        isSelected ? "text-violet-900 dark:text-violet-100" : "text-slate-600 dark:text-slate-300"
                                    )}>
                                        {opt}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="relative">
                        <Textarea 
                            value={answers[q.id] || ""}
                            onChange={(e) => handleAnswer(q.id, e.target.value)}
                            className="min-h-[120px] md:min-h-[160px] text-lg md:text-xl p-4 md:p-6 rounded-xl md:rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 transition-all resize-none"
                            placeholder="이곳에 답안을 서술하시오..."
                        />
                        <div className="absolute bottom-3 right-3 text-xs md:text-sm text-slate-400 font-medium">
                            {(answers[q.id] || "").length}자 입력됨
                        </div>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PC용 OMR */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <OMRCard 
                questions={EXAM_DATA.questions} 
                answers={answers} 
                marked={markedQuestions} 
                progress={progress}
                onScroll={scrollToQuestion} 
            />
            {/* ❌ 초기화 버튼 삭제됨 */}
          </div>
        </div>

      </div>

      {/* 모바일 OMR Drawer */}
      {isMobileOMROpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOMROpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2">답안 표기란</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileOMROpen(false)}>
                        <X className="w-5 h-5"/>
                    </Button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                    <OMRCard 
                        questions={EXAM_DATA.questions} 
                        answers={answers} 
                        marked={markedQuestions} 
                        progress={progress}
                        onScroll={scrollToQuestion} 
                        isMobile={true}
                    />
                </div>
            </div>
        </div>
      )}
      
    </div>
  )
}

function OMRCard({ questions, answers, marked, progress, onScroll, isMobile = false }: any) {
    return (
        <div className={cn(
            "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 overflow-hidden",
            !isMobile && "rounded-3xl border shadow-xl shadow-slate-200/50 dark:shadow-none"
        )}>
            {!isMobile && (
                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-violet-500"/>
                        답안 표기란
                    </h3>
                    <div className="flex justify-between items-center mt-2 text-sm">
                        <span className="text-slate-500">진행률</span>
                        <span className="font-bold text-violet-600">{Math.round(progress)}%</span>
                    </div>
                </div>
            )}

            <div className={cn("grid grid-cols-5 gap-3", !isMobile && "p-6")}>
                {questions.map((q: any, i: number) => {
                    const isDone = answers[q.id]
                    const isMarked = marked.includes(q.id)
                    return (
                        <button
                            key={q.id}
                            onClick={() => onScroll(q.id)}
                            className={cn(
                                "relative h-10 w-10 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95",
                                isMarked 
                                    ? "bg-orange-100 text-orange-600 border-2 border-orange-400" 
                                    : isDone 
                                        ? "bg-violet-600 text-white" 
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            )}
                        >
                            {i + 1}
                            {isMarked && (
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
            
            <div className={cn("mt-4 grid grid-cols-2 gap-2 text-xs font-medium text-slate-500", !isMobile && "p-4 bg-slate-50 border-t")}>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-violet-600"/> 작성완료</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-200"/> 미작성</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400"/> 검토필요</div>
            </div>
        </div>
    )
}