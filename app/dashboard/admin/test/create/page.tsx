"use client"

import { useState, useRef, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Save, Loader2, Plus, Trash2, FileImage, 
  UploadCloud, RotateCcw, Clock, ArrowLeft, Lock
} from "lucide-react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Question {
  id: number
  type: "CHOICE" | "TEXT"
  score: number
  correctAnswer: string
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = scaleSize < 1 ? MAX_WIDTH : img.width;
        canvas.height = scaleSize < 1 ? img.height * scaleSize : img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
    };
  });
};

function CreateOMRContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const examId = searchParams.get("id")
  const isEditMode = !!examId

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const paperInputRef = useRef<HTMLInputElement | null>(null)

  const [examInfo, setExamInfo] = useState({
    title: searchParams.get("title") || "",
    timeLimit: 60,
    startDate: searchParams.get("start")?.split("T")[0] || "",
    endDate: searchParams.get("end")?.split("T")[0] || "",
    startTime: searchParams.get("start")?.split("T")[1] || "09:00",
    endTime: searchParams.get("end")?.split("T")[1] || "10:00",
  })

  const [examPapers, setExamPapers] = useState<string[]>([])
  const [questionCount, setQuestionCount] = useState<number | string>(20) 
  const [defaultScore, setDefaultScore] = useState<number | string>(5)    
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (examInfo.startDate && examInfo.startTime && examInfo.endDate && examInfo.endTime) {
        const start = new Date(`${examInfo.startDate}T${examInfo.startTime}`)
        const end = new Date(`${examInfo.endDate}T${examInfo.endTime}`)
        
        const diffMs = end.getTime() - start.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))

        if (diffMins > 0) {
            setExamInfo(prev => ({ ...prev, timeLimit: diffMins }))
        }
    }
  }, [examInfo.startDate, examInfo.startTime, examInfo.endDate, examInfo.endTime])

  useEffect(() => {
    if (isEditMode) {
      const fetchExam = async () => {
        setIsLoading(true)
        try {
          const res = await fetch(`/api/tests/${examId}`)
          if (!res.ok) throw new Error("Load failed")
          const data = await res.json()
          
          const start = new Date(data.startDate)
          const end = new Date(data.endDate)

          setExamInfo({
            title: data.title,
            timeLimit: data.timeLimit,
            startDate: start.toISOString().split("T")[0],
            startTime: start.toTimeString().slice(0, 5),
            endDate: end.toISOString().split("T")[0],
            endTime: end.toTimeString().slice(0, 5),
          })
          setExamPapers(data.examPapers || [])
          setQuestions(data.questions || [])
          setQuestionCount(data.questions?.length || 20)
        } catch (e) {
          console.error(e)
          alert("시험 정보를 불러오지 못했습니다.")
          router.back()
        } finally {
          setIsLoading(false)
        }
      }
      fetchExam()
    }
  }, [isEditMode, examId, router])

  const handleNumberChange = (value: string, setter: (val: number | string) => void) => {
    if (value === "") { setter(""); return; }
    const num = Number(value);
    if (!isNaN(num)) { setter(num); }
  }

  const generateQuestions = () => {
    if(questions.length > 0 && !confirm("기존 입력된 답안이 초기화됩니다. 새로 생성하시겠습니까?")) return;
    const count = typeof questionCount === 'string' ? 20 : questionCount;
    const score = typeof defaultScore === 'string' ? 5 : defaultScore;
    const newQuestions: Question[] = Array.from({ length: count }).map((_, i) => ({
      id: i + 1, type: "CHOICE", score: score, correctAnswer: ""
    }))
    setQuestions(newQuestions)
  }

  const addQuestion = () => {
    const score = typeof defaultScore === 'string' ? 5 : defaultScore;
    const nextId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1
    setQuestions([...questions, { id: nextId, type: "CHOICE", score: score, correctAnswer: "" }])
  }

  const removeQuestion = (indexToRemove: number) => {
    if (questions.length === 1) return alert("최소 1문제는 있어야 합니다.")
    setQuestions(prev => prev.filter((_, idx) => idx !== indexToRemove).map((q, i) => ({ ...q, id: i + 1 })))
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQ = [...questions]
    newQ[index] = { ...newQ[index], [field]: value }
    if (field === 'type') newQ[index].correctAnswer = ""
    setQuestions(newQ)
  }

  const handlePaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const compressedImages: string[] = [];

      setIsSubmitting(true);
      try {
        for (const file of files) {
          const compressed = await compressImage(file);
          compressedImages.push(compressed);
        }
        setExamPapers(prev => [...prev, ...compressedImages]);
      } catch (err) {
        console.error("이미지 처리 실패", err);
        alert("오류가 발생했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  const removePaper = (index: number) => {
    setExamPapers(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!examInfo.title) return alert("시험 제목을 입력해주세요.")
    if (questions.some(q => !q.correctAnswer)) return alert("정답이 입력되지 않은 문제가 있습니다.")

    setIsSubmitting(true)
    try {
      const startDateTime = new Date(`${examInfo.startDate}T${examInfo.startTime}`)
      const endDateTime = new Date(`${examInfo.endDate}T${examInfo.endTime}`)

      const payload = {
        title: examInfo.title,
        timeLimit: examInfo.timeLimit,
        startDate: startDateTime,
        endDate: endDateTime,
        examPapers: examPapers, 
        questions: questions
      }

      const url = isEditMode ? `/api/tests/${examId}` : "/api/tests"
      const method = isEditMode ? "PUT" : "POST"

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.status === 413) throw new Error("LARGE_FILE")
      if (!res.ok) throw new Error("FAIL")
      
      alert(isEditMode ? "수정되었습니다." : "생성되었습니다.")
      router.push("/dashboard/admin/test")

    } catch (e: any) {
      console.error(e)
      alert(e.message === "LARGE_FILE" ? "이미지 용량이 너무 큽니다." : "오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalScore = questions.reduce((acc, q) => acc + Number(q.score), 0)

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pb-32 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" onClick={() => router.back()} className="pl-0 hover:bg-transparent">
                <ArrowLeft className="w-5 h-5 mr-2" /> 돌아가기
            </Button>
            <span className="text-xl font-bold text-slate-400">/</span>
            <span className="font-bold text-slate-800 dark:text-white">{isEditMode ? "시험 수정" : "새 시험 생성"}</span>
        </div>

        {/* 1. 상단: 시험 기본 설정 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 왼쪽: 제목 & 제한 시간 */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">시험 제목</label>
                    <Input 
                      className="text-xl md:text-2xl font-black border-none px-0 shadow-none focus-visible:ring-0 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-300"
                      placeholder="예: 2026 1학기 중간고사"
                      value={examInfo.title}
                      onChange={(e) => setExamInfo({...examInfo, title: e.target.value})}
                    />
                </div>
                
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700 w-full md:w-fit">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">제한 시간 (자동 계산)</span>
                        <div className="flex items-center gap-1">
                            <Input 
                                readOnly
                                className="w-16 h-8 p-0 text-xl font-bold border-none bg-transparent focus-visible:ring-0 text-slate-900 dark:text-white cursor-default" 
                                value={examInfo.timeLimit}
                            />
                            <span className="text-sm font-medium text-slate-400">분</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 오른쪽: 일시 설정 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">
                
                {/* 1열: 시작 일시 */}
                <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        시작 일시
                    </span>
                    <div className="flex gap-2">
                        <Input 
                            type="date" 
                            className="bg-white dark:bg-slate-900 flex-[2]" 
                            value={examInfo.startDate} 
                            onChange={(e) => setExamInfo({...examInfo, startDate: e.target.value})} 
                        />
                        <Input 
                            type="time" 
                            className="bg-white dark:bg-slate-900 flex-[1]" 
                            value={examInfo.startTime} 
                            onChange={(e) => setExamInfo({...examInfo, startTime: e.target.value})} 
                        />
                    </div>
                </div>

                {/* 2열: 종료 일시 */}
                <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        종료 일시
                    </span>
                    <div className="flex gap-2">
                        <Input 
                            type="date" 
                            className="bg-white dark:bg-slate-900 flex-[2]" 
                            value={examInfo.endDate} 
                            onChange={(e) => setExamInfo({...examInfo, endDate: e.target.value})} 
                        />
                        <Input 
                            type="time" 
                            className="bg-white dark:bg-slate-900 flex-[1]" 
                            value={examInfo.endTime} 
                            onChange={(e) => setExamInfo({...examInfo, endTime: e.target.value})} 
                        />
                    </div>
                </div>

                <p className="text-xs text-slate-400 text-right pt-2 border-t border-slate-200 dark:border-slate-700">
                    * 시작/종료 시간에 따라 제한 시간이 자동으로 설정됩니다.
                </p>
            </div>

          </div>
        </div>

        {/* 2. 중단: 시험지 이미지 업로드 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <FileImage className="w-5 h-5 text-violet-500" />
                    시험지 이미지
                </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {examPapers.map((img, idx) => (
                    <div key={idx} className="relative group aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <img src={img} alt={`page-${idx+1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => removePaper(idx)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                            P.{idx + 1}
                        </div>
                    </div>
                ))}
                <div onClick={() => paperInputRef.current?.click()} className="aspect-[3/4] rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all text-slate-400 hover:text-violet-600">
                    <UploadCloud className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold">이미지 추가</span>
                </div>
                <input type="file" multiple accept="image/*" className="hidden" ref={paperInputRef} onChange={handlePaperUpload} />
            </div>
        </div>

        {/* 3. 하단: OMR 생성 및 설정 */}
        <div className="space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> OMR 설정
                    </span>
                    <div className="hidden md:block h-4 w-[1px] bg-slate-300 dark:bg-slate-600 mx-2"/>
                    
                    <div className="flex items-center gap-2 flex-1 md:flex-none">
                        <span className="text-xs text-slate-500 whitespace-nowrap">문항 수</span>
                        <Input type="number" value={questionCount} onChange={(e) => handleNumberChange(e.target.value, setQuestionCount)} className="w-16 h-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
                    </div>
                    <div className="flex items-center gap-2 flex-1 md:flex-none">
                        <span className="text-xs text-slate-500 whitespace-nowrap">기본 배점</span>
                        <Input type="number" value={defaultScore} onChange={(e) => handleNumberChange(e.target.value, setDefaultScore)} className="w-16 h-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
                    </div>
                    <Button size="sm" onClick={generateQuestions} className="bg-slate-800 dark:bg-slate-700 text-white w-full md:w-auto mt-2 md:mt-0">
                        적용 / 초기화
                    </Button>
                </div>

                <div className="text-sm font-medium text-slate-500 self-end md:self-auto">
                    총점: <span className="text-violet-600 dark:text-violet-400 font-bold text-lg">{totalScore}</span> 점
                </div>
            </div>
            
            {/* 문항 입력 영역: 모바일 2줄 / 데스크탑 1줄 */}
            {questions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    {questions.map((q, idx) => (
                        <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            
                            {/* 1. 윗줄 (모바일) / 왼쪽 (데스크탑): 번호, 유형, 점수, 삭제 */}
                            <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-700 text-sm">
                                        {q.id}
                                    </span>
                                    <Select value={q.type} onValueChange={(val: "CHOICE" | "TEXT") => updateQuestion(idx, "type", val)}>
                                        <SelectTrigger className="w-[85px] h-9 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CHOICE">객관식</SelectItem>
                                            <SelectItem value="TEXT">주관식</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 모바일용 점수 & 삭제 (우측 정렬) */}
                                <div className="flex md:hidden items-center gap-2">
                                    <span className="text-xs text-slate-400">점수</span>
                                    <Input 
                                        type="number" 
                                        value={q.score} 
                                        onChange={(e) => handleNumberChange(e.target.value, (val) => updateQuestion(idx, "score", val))} 
                                        className="w-12 h-9 text-center px-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
                                    />
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => removeQuestion(idx)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* 2. 아랫줄 (모바일) / 중간 (데스크탑): 정답 입력 */}
                            <div className="w-full md:flex-1 min-w-0 mt-1 md:mt-0 order-last md:order-none">
                                {q.type === "CHOICE" ? (
                                    <div className="grid grid-cols-5 gap-2 md:flex md:gap-1">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => updateQuestion(idx, "correctAnswer", String(num))}
                                                className={cn(
                                                    // ✅ 모바일에서 버튼 크기 대폭 확대 (h-12, text-lg)
                                                    "h-14 md:h-9 md:flex-1 rounded-lg md:rounded-md text-xl md:text-sm font-bold border transition-all touch-manipulation",
                                                    q.correctAnswer === String(num) 
                                                        ? "bg-violet-600 text-white border-violet-600 shadow-md" 
                                                        : "bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-500 hover:text-violet-500"
                                                )}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <Input 
                                        placeholder="정답 입력" 
                                        value={q.correctAnswer} 
                                        onChange={(e) => updateQuestion(idx, "correctAnswer", e.target.value)} 
                                        className="h-14 md:h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 placeholder:text-slate-400 text-lg md:text-sm px-4 md:px-3" 
                                    />
                                )}
                            </div>

                            {/* 데스크탑용 점수 & 삭제 (모바일 숨김) */}
                            <div className="hidden md:flex items-center gap-2 shrink-0">
                                <Input 
                                    type="number" 
                                    value={q.score} 
                                    onChange={(e) => handleNumberChange(e.target.value, (val) => updateQuestion(idx, "score", val))} 
                                    className="w-14 h-9 text-center px-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
                                />
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => removeQuestion(idx)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-40 flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-dashed dark:border-slate-800">
                    <p className="text-center text-sm">위 설정에서 문항 수를 입력하고<br/>[적용 / 초기화] 버튼을 눌러주세요.</p>
                </div>
            )}
        </div>

        <div className="flex justify-center pt-4 pb-24">
            <Button onClick={addQuestion} variant="outline" className="h-12 md:h-10 px-6 rounded-full border-dashed border-2 border-slate-300 dark:border-slate-600 text-slate-500 hover:text-violet-600 hover:border-violet-400 bg-transparent text-base md:text-sm">
                <Plus className="w-4 h-4 mr-2" /> 1문제 추가
            </Button>
        </div>

        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col gap-3 z-50">
            <Button onClick={handleSave} disabled={isSubmitting} className="h-14 w-14 rounded-full bg-violet-600 text-white shadow-xl shadow-violet-200 dark:shadow-none hover:bg-violet-700 hover:scale-105 transition-all">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            </Button>
        </div>

      </div>
    </div>
  )
}

export default function CreateExamPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">로딩 중...</div>}>
      <CreateOMRContent />
    </Suspense>
  )
}