"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, Search, Trophy, User, CheckCircle2, ChevronRight, 
  BarChart3, Loader2, Trash2, AlertCircle // ✅ AlertCircle 추가 완료!
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

// API 응답 타입 정의
interface ResultData {
  testTitle: string
  stats: {
    total: number
    average: number
    max: number
  }
  questions: any[]
  results: any[]
}

export default function ExamResultPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  
  const { id } = use(params)

  const [data, setData] = useState<ResultData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  
  // 삭제 관련 상태
  const [deleteTarget, setDeleteTarget] = useState<any>(null)

  // 1. 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/tests/${id}/results`)
        if (res.ok) {
          const resultData = await res.json()
          setData(resultData)
        } else {
          alert("결과를 불러오는데 실패했습니다.")
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!deleteTarget || !data) return;

    try {
        const res = await fetch(`/api/tests/${id}/results?resultId=${deleteTarget.id}`, { 
            method: 'DELETE' 
        });

        if (!res.ok) {
            throw new Error("삭제 실패");
        }

        setData({
            ...data,
            results: data.results.filter((r) => r.id !== deleteTarget.id),
            stats: { ...data.stats, total: data.stats.total - 1 }
        });
        
        setDeleteTarget(null); 
    } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
      </div>
    )
  }

  if (!data) return null;

  const filteredResults = data.results.filter((r: any) => 
    r.name.includes(searchTerm)
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 space-y-6">
      
      {/* 1. 상단 헤더 */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit pl-0 hover:bg-transparent" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> 목록으로 돌아가기
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{data.testTitle} 결과</h1>
                <p className="text-slate-500 mt-1">총 {data.stats.total}명이 응시했습니다.</p>
            </div>
            <div className="flex gap-4">
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-slate-500">평균 점수</p>
                    <p className="text-xl font-bold text-violet-600">{data.stats.average}점</p>
                </div>
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-slate-500">최고 점수</p>
                    <p className="text-xl font-bold text-green-600">{data.stats.max}점</p>
                </div>
            </div>
        </div>
      </div>

      {/* 2. 검색 및 랭킹 테이블 */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
            <h3 className="font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> 성적 랭킹
            </h3>
            <div className="relative w-60">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <Input 
                    placeholder="이름 검색..." 
                    className="pl-9 h-9 bg-white dark:bg-slate-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {filteredResults.length > 0 ? (
          <Table>
              <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-50">
                      <TableHead className="w-[80px] text-center">순위</TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead className="text-center">점수</TableHead>
                      <TableHead className="text-center hidden md:table-cell">소요 시간</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredResults.map((student: any) => (
                      <TableRow key={student.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" onClick={() => setSelectedStudent(student)}>
                          <TableCell className="text-center font-medium">
                              {student.rank === 1 ? <span className="text-xl">🥇</span> : 
                               student.rank === 2 ? <span className="text-xl">🥈</span> : 
                               student.rank === 3 ? <span className="text-xl">🥉</span> : 
                               student.rank}
                          </TableCell>
                          <TableCell className="font-bold flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                  <User className="w-4 h-4" />
                              </div>
                              {student.name}
                          </TableCell>
                          <TableCell className="text-center">
                              <Badge className={cn(
                                  "text-sm px-2 py-0.5",
                                  student.score >= 90 ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" :
                                  student.score >= 70 ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200" :
                                  "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                              )}>
                                  {student.score}점
                              </Badge>
                          </TableCell>
                          <TableCell className="text-center text-slate-500 hidden md:table-cell">
                              {student.time}
                          </TableCell>
                          <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-violet-600">
                                      확인하기 <ChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        setDeleteTarget(student);
                                    }}
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </Button>
                              </div>
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
            <p>데이터가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 3. 학생 답안지 상세 모달 */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            {selectedStudent?.name} 학생의 답안지
                        </DialogTitle>
                        <p className="text-sm text-slate-500 mt-1">
                            총점: <span className="font-bold text-violet-600">{selectedStudent?.score}점</span> / 소요시간: {selectedStudent?.time}
                        </p>
                    </div>
                    {/* OMR 요약 (미니맵) */}
                    <div className="flex gap-1 flex-wrap justify-end max-w-[200px]">
                        {data.questions.map((q: any, i: number) => {
                            const studentAns = selectedStudent?.answers[q.id] || "";
                            const isCorrect = studentAns.toString().trim().includes(q.correctAnswer)
                            return (
                                <div key={q.id} className={cn(
                                    "w-6 h-6 md:w-8 md:h-8 rounded-md flex items-center justify-center text-xs font-bold border",
                                    isCorrect ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"
                                )}>
                                    {i + 1}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-6">
                {data.questions.map((q: any, idx: number) => {
                    const studentAnswer = selectedStudent?.answers[q.id] || "";
                    const isCorrect = studentAnswer.toString().trim().includes(q.correctAnswer)
                    
                    const correctRate = q.correctRate || 0;
                    
                    const rateColor = correctRate >= 70 ? "bg-green-500" : correctRate >= 40 ? "bg-orange-400" : "bg-red-500";
                    const rateTextColor = correctRate >= 70 ? "text-green-600" : correctRate >= 40 ? "text-orange-500" : "text-red-500";

                    return (
                        <div key={q.id} className={cn(
                            "p-5 rounded-2xl border relative transition-all",
                            isCorrect 
                                ? "bg-white border-green-200 dark:bg-slate-900 dark:border-green-900" 
                                : "bg-red-50/10 border-red-200 dark:bg-red-900/10 dark:border-red-900"
                        )}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 border-0">
                                            {q.type === 'CHOICE' ? '객관식' : '주관식'}
                                        </Badge>
                                        <span className="text-xs font-semibold text-slate-400">{q.score}점</span>
                                    </div>
                                    <span className="font-bold text-lg text-slate-800 dark:text-slate-200">
                                        {idx + 1}. {q.text}
                                    </span>
                                </div>
                                <div className="text-right">
                                    {isCorrect 
                                        ? <Badge className="bg-green-500 hover:bg-green-600">정답</Badge> 
                                        : <Badge className="bg-red-500 hover:bg-red-600">오답</Badge>
                                    }
                                </div>
                            </div>

                            {/* 답안 비교 박스 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {/* 학생 답안 */}
                                <div className={cn(
                                    "p-3 rounded-lg border",
                                    isCorrect ? "bg-green-50/50 border-green-100 dark:bg-green-900/20 dark:border-green-800" : "bg-white border-red-100 dark:bg-slate-900 dark:border-red-900/50"
                                )}>
                                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                        <User className="w-3 h-3" /> 학생 답안
                                    </p>
                                    <p className={cn("font-bold text-base", isCorrect ? "text-green-700 dark:text-green-300" : "text-red-600 dark:text-red-400 line-through")}>
                                        {studentAnswer || "(미입력)"}
                                    </p>
                                </div>

                                {/* 정답 */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> 정답
                                    </p>
                                    <p className="font-bold text-base text-slate-700 dark:text-slate-300">
                                        {q.correctAnswer}
                                    </p>
                                </div>
                            </div>

                            {/* 📊 전체 정답률 통계 바 */}
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center text-xs mb-1.5">
                                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                                        <BarChart3 className="w-3.5 h-3.5" /> 전체 정답률
                                    </span>
                                    <span className={cn("font-bold", rateTextColor)}>{correctRate}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={cn("h-full rounded-full transition-all duration-500", rateColor)} 
                                        style={{ width: `${correctRate}%` }} 
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 text-right">
                                    응시자 {data.stats.total}명 중 {Math.round((correctRate / 100) * data.stats.total)}명 정답
                                </p>
                            </div>

                        </div>
                    )
                })}
            </div>
        </DialogContent>
      </Dialog>

      {/* 4. 삭제 확인 모달 */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-0 rounded-xl">
            <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    기록 삭제 확인
                </DialogTitle>
                <DialogDescription className="text-slate-500 mt-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{deleteTarget?.name}</span> 님의 성적 데이터를 정말 삭제하시겠습니까?<br/>
                    이 작업은 되돌릴 수 없습니다.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => setDeleteTarget(null)} className="w-full">
                    취소
                </Button>
                <Button variant="destructive" onClick={handleDelete} className="w-full bg-red-600 hover:bg-red-700">
                    삭제하기
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}