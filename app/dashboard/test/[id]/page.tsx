"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Clock, CheckCircle2, Trophy, ListChecks, Lock, FileImage, Timer, Maximize2, X, AlertCircle, Home, BookOpen, Calculator
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card
} from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog"

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  const [status, setStatus] = useState<string>('loading')
  const [testData, setTestData] = useState<any>(null)
  
  const [now, setNow] = useState(new Date()) 
  const [timeLeft, setTimeLeft] = useState(0) 
  const [timeUntilStart, setTimeUntilStart] = useState(0) 

  const [answers, setAnswers] = useState<Record<number, string>>({})
  const answersRef = useRef<Record<number, string>>({}) 

  // 결과 통계
  const [resultStats, setResultStats] = useState({ earned: 0, total: 0, correctCount: 0, wrongCount: 0 })
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // 모달 제어
  const [showResultModal, setShowResultModal] = useState(false)
  const [isTimeOver, setIsTimeOver] = useState(false)
  
  const [activeTab, setActiveTab] = useState("paper")
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  // 시계
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 초기화
  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await fetch("/api/auth/me")
        if (!userRes.ok) return router.push("/login")
        const user = await userRes.json()
        setCurrentUser({ ...user, id: user.id || user._id })

        const checkRes = await fetch(`/api/tests/${id}/check?userId=${user.id || user._id}`, { cache: 'no-store' })
        const checkData = await checkRes.json()
        if (checkData.taken) {
          alert(`이미 응시한 시험입니다.\n점수: ${checkData.score}점`)
          return router.replace("/dashboard/test")
        }

        const testRes = await fetch(`/api/tests/${id}`)
        if (!testRes.ok) throw new Error("시험 로드 실패")
        const data = await testRes.json()
        setTestData(data)

        const nowTime = new Date().getTime()
        const start = new Date(data.startDate).getTime()
        const end = new Date(data.endDate).getTime()

        if (nowTime >= end) {
          setStatus('ended')
        } else if (nowTime < start) {
          setTimeUntilStart(Math.floor((start - nowTime) / 1000))
          setStatus('waiting')
        } else {
          calculateRemainingTime(data)
          setStatus('intro')
        }
      } catch (err) {
        console.error(err)
        router.back()
      }
    }
    init()
  }, [id, router])

  // 타이머 로직
  useEffect(() => {
    if (status !== 'waiting') return
    const timer = setInterval(() => {
      setTimeUntilStart((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          calculateRemainingTime(testData) 
          setStatus('intro')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [status, testData])

  useEffect(() => {
    if (status !== 'taking') return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsTimeOver(true)
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [status])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setExpandedImage(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const calculateRemainingTime = (data: any) => {
    const nowTime = new Date().getTime()
    const end = new Date(data.endDate).getTime()
    const limitSeconds = data.timeLimit * 60
    const physicalSecondsLeft = Math.floor((end - nowTime) / 1000)
    setTimeLeft(Math.min(limitSeconds, physicalSecondsLeft))
  }

  const formatTime = (seconds: number) => {
    if (seconds < 0) return "00:00"
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleAnswer = (qId: number, val: string) => {
    if (status === 'submitted') return;
    setAnswers(prev => {
        const newAnswers = { ...prev, [qId]: val };
        answersRef.current = newAnswers;
        return newAnswers;
    })
  }

  // ✅ [핵심 수정] 제출 로직: 점수 계산 후 즉시 모달 오픈 + 스크롤 잠금 해제 준비
  const handleSubmit = async (force = false) => {
    if (!force && !confirm("정말 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.")) return;
    
    try {
      const currentAnswers = answersRef.current; 
      let earnedScore = 0;
      let totalScore = 0;
      let correctCnt = 0;
      
      // 1. 점수 계산 (동기 처리)
      testData.questions.forEach((q: any) => {
        totalScore += q.score;
        let isCorrect = false;
        
        if (q.type === 'TEXT') {
            if (currentAnswers[q.id]?.trim() === q.correctAnswer?.trim()) isCorrect = true;
        } else {
            if (currentAnswers[q.id] === q.correctAnswer) isCorrect = true;
        }

        if (isCorrect) {
            earnedScore += q.score;
            correctCnt++;
        }
      });
      
      const finalStats = {
          earned: earnedScore,
          total: totalScore,
          correctCount: correctCnt,
          wrongCount: testData.questions.length - correctCnt
      };

      // 2. 상태 업데이트 (순서 중요)
      setResultStats(finalStats);
      setStatus('submitted'); // 이 시점에 화면에 정답/오답 표시됨
      
      // 3. 모달 강제 오픈 (약간의 딜레이를 주어 렌더링 꼬임 방지)
      setTimeout(() => {
        setShowResultModal(true);
      }, 100);
      
      // 4. 서버 전송
      const payload = {
        userId: currentUser.id,      
        studentName: currentUser.name || "Unknown", 
        answers: currentAnswers, 
        timeTaken: formatTime(testData.timeLimit * 60 - timeLeft) 
      }
      
      await fetch(`/api/tests/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (error) { console.error(error) }
  }

  // --- 렌더링 ---
  if (status === 'loading' || !testData) {
    return <div className="fixed inset-0 z-[9999] bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600"></div></div>
  }

  const objCount = testData ? testData.questions.filter((q: any) => q.type === 'CHOICE').length : 0
  const subjCount = testData ? testData.questions.filter((q: any) => q.type === 'TEXT').length : 0
  const totalMaxScore = testData ? testData.questions.reduce((acc: number, q: any) => acc + (q.score || 0), 0) : 0

  return (
    // ✅ [수정] overflow-hidden을 제거하고 flex 구조로 내부 스크롤 제어 (전체 스크롤 잠금 문제 해결)
    <div 
      className="fixed inset-0 z-[9999] bg-slate-50 dark:bg-slate-950 flex flex-col select-none font-sans"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      
      {/* === 1. 대기실 / 입장 / 종료 화면 === */}
      {(status === 'waiting' || status === 'intro' || status === 'ended') && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
            <Card className="w-full max-w-[440px] border-0 shadow-xl shadow-slate-200/60 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                <div className="bg-gradient-to-b from-violet-50/50 to-white dark:from-slate-800/50 dark:to-slate-900 p-8 text-center pb-6">
                    <Badge variant="secondary" className="mb-4 bg-white shadow-sm text-violet-600 border border-violet-100 hover:bg-white px-3 py-1.5 text-xs font-bold rounded-full">
                        {status === 'ended' ? "시험 종료" : "Online Test"}
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2 leading-snug">
                        {testData.title}
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-3 text-sm text-slate-500">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-bold">수험자</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser?.name}</span>
                    </div>
                </div>

                <div className="p-8 pt-2 space-y-6">
                    {status === 'ended' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">시험이 종료되었습니다.</h3>
                        </div>
                    ) : status === 'waiting' ? (
                        <div className="text-center py-6">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Starts in</span>
                            <div className="text-6xl font-black font-mono text-violet-600 dark:text-violet-400 tracking-tighter">
                                {formatTime(timeUntilStart)}
                            </div>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700">
                            <span className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wide">Questions</span>
                            <span className="text-xl font-black text-slate-800 dark:text-white">{objCount + subjCount}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700">
                            <span className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wide">Time Limit</span>
                            <span className="text-xl font-black text-violet-600 dark:text-violet-400">{testData.timeLimit}<span className="text-sm font-medium ml-1">min</span></span>
                        </div>
                    </div>

                    {status === 'intro' && (
                        <div className="bg-amber-50/60 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100/50 dark:border-amber-900/20 text-center">
                            <p className="text-xs font-medium text-amber-700 dark:text-amber-500 leading-relaxed">
                                시험 시작 후 <span className="font-bold">종료 시간</span>이 되면<br/>자동으로 답안이 제출됩니다.
                            </p>
                        </div>
                    )}

                    <div className="pt-2">
                        {status === 'ended' ? (
                            <Button onClick={() => router.push('/dashboard/test')} variant="outline" className="h-14 w-full font-bold rounded-2xl">
                                목록으로 돌아가기
                            </Button>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Button 
                                    onClick={() => setStatus('taking')} 
                                    disabled={status === 'waiting'}
                                    className={cn(
                                        "h-14 w-full text-lg font-bold rounded-2xl transition-all shadow-lg shadow-violet-200/50 dark:shadow-none",
                                        status === 'waiting' 
                                            ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 shadow-none" 
                                            : "bg-violet-600 hover:bg-violet-700 text-white hover:scale-[1.02]"
                                    )}
                                >
                                    {status === 'waiting' ? "입장 대기" : "시험 시작하기"}
                                </Button>
                                <Button variant="ghost" onClick={() => router.back()} className="h-12 w-full text-slate-400 font-medium hover:text-slate-600 rounded-2xl hover:bg-slate-100">
                                    나가기
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
      )}

      {/* === 2. 시험 응시 화면 === */}
      {(status === 'taking' || status === 'submitted') && (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
            {/* 헤더 */}
            <header className="h-[68px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-violet-600 text-white rounded-xl shadow-md shadow-violet-200 dark:shadow-none flex items-center justify-center font-bold text-sm">Q</div>
                    <h1 className="font-bold text-slate-800 dark:text-white truncate max-w-[120px] md:max-w-md text-sm md:text-base">{testData.title}</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end md:flex-row md:items-center gap-0.5 md:gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">종료 시간</span>
                        <span className="text-xs md:text-sm font-bold font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                             {new Date(testData.endDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </span>
                    </div>
                    {/* 타이머 */}
                    <div className={cn(
                        "h-9 px-3 rounded-lg flex items-center gap-1.5 font-mono text-lg font-bold tabular-nums transition-colors", 
                        timeLeft < 300 
                            ? "bg-red-50 text-red-500 border border-red-100 animate-pulse" 
                            : "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md shadow-slate-200 dark:shadow-none"
                    )}>
                        {timeLeft < 300 && <Clock className="w-3.5 h-3.5" />}
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </header>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* 컨텐츠 영역 */}
                    <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-slate-950">
                        <div className="h-full w-full max-w-4xl mx-auto bg-white dark:bg-slate-950 shadow-sm md:border-x md:border-slate-200/50 dark:md:border-slate-800">
                            
                            <TabsContent value="paper" className="h-full overflow-y-auto m-0 p-4 md:p-8 scrollbar-hide">
                                {testData.examPapers?.length > 0 ? (
                                    <div className="space-y-4 pb-20">
                                        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold text-center mb-2 flex items-center justify-center gap-2">
                                            <Maximize2 className="w-3 h-3"/> 이미지를 클릭하면 크게 볼 수 있습니다
                                        </div>
                                        {testData.examPapers.map((img: string, idx: number) => (
                                            <div 
                                                key={idx} 
                                                className="group relative bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-zoom-in hover:shadow-md transition-all"
                                                onClick={() => setExpandedImage(img)}
                                            >
                                                <img src={img} alt={`page-${idx+1}`} className="w-full rounded-lg" />
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                                                    <div className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center gap-2">
                                                        <Maximize2 className="w-4 h-4"/> 확대하기
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <FileImage className="w-10 h-10 opacity-20" />
                                        <span>등록된 시험지가 없습니다.</span>
                                    </div>
                                )}
                            </TabsContent>
                            
                            <TabsContent value="omr" className="h-full overflow-y-auto m-0 p-4 md:p-8 scrollbar-hide">
                                <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-950/95 backdrop-blur py-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-white">
                                        <span className="w-1 h-5 bg-violet-500 rounded-full inline-block"></span>
                                        답안 작성
                                    </h2>
                                    <div className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                                        진행률: <span className="text-violet-600 font-bold">{Object.keys(answers).length}</span> / {testData.questions.length}
                                    </div>
                                </div>
                                <div className="pb-24 pt-2">
                                    <OMRSheet questions={testData.questions} answers={answers} handleAnswer={handleAnswer} status={status} />
                                </div>
                            </TabsContent>

                        </div>
                    </div>
                    
                    {/* 하단 탭 바 */}
                    <div className="shrink-0 h-[72px] bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 z-50 flex items-center justify-center px-4 pb-2">
                        <div className="w-full max-w-4xl flex gap-4 items-center h-full pt-2">
                            <TabsList className="flex-1 h-12 grid grid-cols-2 bg-slate-100/80 dark:bg-slate-900 p-1 rounded-xl">
                                <TabsTrigger value="paper" className="rounded-lg text-sm font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-violet-600 data-[state=active]:shadow-sm transition-all text-slate-500">
                                    <FileImage className="w-4 h-4 mr-1.5" /> 시험지
                                </TabsTrigger>
                                <TabsTrigger value="omr" className="rounded-lg text-sm font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-violet-600 data-[state=active]:shadow-sm transition-all text-slate-500">
                                    <ListChecks className="w-4 h-4 mr-1.5" /> 답안지
                                </TabsTrigger>
                            </TabsList>
                            
                            {status !== 'submitted' ? (
                                <Button onClick={() => handleSubmit(false)} className="h-12 px-6 bg-violet-600 hover:bg-violet-700 text-white font-bold shrink-0 rounded-xl shadow-lg shadow-violet-200 dark:shadow-none hover:-translate-y-0.5 transition-all">
                                    제출
                                </Button>
                            ) : (
                                <Button onClick={() => router.push('/dashboard/test')} variant="outline" className="h-12 px-6 shrink-0 font-bold rounded-xl border-slate-300">
                                    나가기
                                </Button>
                            )}
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
      )}

      {/* 이미지 확대 모달 */}
      {expandedImage && (
        <div 
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setExpandedImage(null)}
        >
            <button 
                onClick={() => setExpandedImage(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
            >
                <X className="w-8 h-8" />
            </button>
            <img 
                src={expandedImage} 
                alt="Expanded Exam Paper" 
                className="max-w-full max-h-full w-auto h-auto object-contain rounded shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
      )}

      {/* 📊 [결과 모달] z-index를 최상위로 설정하여 무조건 보이게 함 */}
      <Dialog 
        open={showResultModal} 
        onOpenChange={(open) => {
            setShowResultModal(open);
            // 🔓 다이얼로그 닫힐 때 스크롤 잠금 강제 해제 (Radix UI 버그 방지)
            if (!open) {
                document.body.style.pointerEvents = 'auto';
                document.body.style.overflow = 'auto';
            }
        }}
      >
        <DialogContent className="sm:max-w-sm text-center p-0 bg-white dark:bg-slate-900 rounded-[2rem] border-0 shadow-2xl overflow-hidden z-[10002]">
            <div className="p-8 pb-6">
                <DialogHeader>
                    <div className="mx-auto bg-violet-50 text-violet-600 w-16 h-16 rounded-2xl rotate-3 flex items-center justify-center mb-5 ring-4 ring-white shadow-lg shadow-violet-100">
                        {isTimeOver ? <Timer className="w-8 h-8"/> : <Trophy className="w-8 h-8" />}
                    </div>
                    <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">
                        {isTimeOver ? "시간 종료!" : "제출 완료"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 text-sm mt-2 font-medium">
                        시험이 종료되었습니다.<br/>결과를 확인해주세요.
                    </DialogDescription>
                </DialogHeader>

                {/* 결과 통계 카드 */}
                <div className="mt-6 space-y-3">
                    {/* 총점 */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Score</div>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{resultStats.earned}</span>
                            <span className="text-lg text-slate-300 font-bold">/ {resultStats.total}</span>
                        </div>
                    </div>
                    
                    {/* 정답/오답 개수 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50/50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/20">
                            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                                <CheckCircle2 className="w-4 h-4" /> <span className="text-xs font-bold">맞은 문제</span>
                            </div>
                            <span className="text-2xl font-black text-slate-800 dark:text-white">{resultStats.correctCount}</span>
                        </div>
                        <div className="bg-red-50/50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/20">
                            <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                                <AlertCircle className="w-4 h-4" /> <span className="text-xs font-bold">틀린 문제</span>
                            </div>
                            <span className="text-2xl font-black text-slate-800 dark:text-white">{resultStats.wrongCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 버튼 (선택지) */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
                <Button onClick={() => { setShowResultModal(false); setActiveTab('omr'); }} className="w-full h-12 font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-md flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> 오답 확인하기
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard/test')} className="w-full h-12 font-bold text-slate-500 hover:text-slate-700 hover:bg-white border-slate-200 rounded-xl flex items-center gap-2">
                    <Home className="w-4 h-4" /> 목록으로 나가기
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OMRSheet({ questions, answers, handleAnswer, status }: any) {
    return (
        <div className="space-y-4">
            {questions.map((q: any, idx: number) => {
                const isCorrect = status === 'submitted' && (
                    q.type === 'TEXT' 
                        ? answers[q.id]?.trim() === q.correctAnswer?.trim()
                        : answers[q.id] === q.correctAnswer
                )
                const isWrong = status === 'submitted' && !isCorrect

                return (
                    <div key={q.id} className={cn(
                        "flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-slate-900",
                        isCorrect ? "border-green-500 shadow-sm" :
                        isWrong ? "border-red-500 shadow-sm" :
                        "border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]"
                    )}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black shrink-0 transition-colors",
                                    status === 'submitted' 
                                        ? (isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white") 
                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                )}>
                                    {idx + 1}
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">{q.score}점</span>
                            </div>
                            {status === 'submitted' && (
                                <span className={cn("text-xs font-bold px-2 py-1 rounded-md", isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
                                    {isCorrect ? "정답" : "오답"}
                                </span>
                            )}
                        </div>

                        <div className="pl-1 pt-1">
                            {q.type === 'CHOICE' ? (
                                <div className="flex justify-between gap-2">
                                    {[1, 2, 3, 4, 5].map((num) => {
                                        const numStr = String(num)
                                        const isSelected = answers[q.id] === numStr
                                        const isAns = q.correctAnswer === numStr

                                        let btnClass = "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-violet-300 hover:text-violet-500"
                                        
                                        if (status === 'submitted') {
                                            if (isAns) btnClass = "bg-green-500 border-green-500 text-white" 
                                            else if (isSelected) btnClass = "bg-red-500 border-red-500 text-white"
                                            else btnClass = "opacity-30 border-slate-100"
                                        } else {
                                            if (isSelected) btnClass = "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200 ring-2 ring-violet-100"
                                        }

                                        return (
                                            <button
                                                key={num}
                                                onClick={() => handleAnswer(q.id, numStr)}
                                                disabled={status === 'submitted'}
                                                className={cn("flex-1 h-11 rounded-xl border-2 text-sm font-bold transition-all duration-200 active:scale-95", btnClass)}
                                            >
                                                {num}
                                            </button>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="relative">
                                    <Input 
                                        value={answers[q.id] || ""}
                                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                                        disabled={status === 'submitted'}
                                        placeholder="정답 입력"
                                        className={cn(
                                            "h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold text-base px-4 focus-visible:ring-violet-500 rounded-xl",
                                            status === 'submitted' && isCorrect && "border-green-500 text-green-700 bg-green-50",
                                            status === 'submitted' && isWrong && "border-red-500 text-red-600 bg-red-50"
                                        )}
                                    />
                                    {isWrong && (
                                        <div className="flex items-center gap-2 mt-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                                            <CheckCircle2 className="w-3 h-3"/> 정답: {q.correctAnswer}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}