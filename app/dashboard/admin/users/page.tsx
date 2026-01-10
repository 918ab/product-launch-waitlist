"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, MoreHorizontal, UserCheck, UserX, Shield, Mail, Calendar, Check, X, Loader2, ChevronLeft, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  status: string
  joined: string
}

export default function AdminUsersPage() {
  // 상태 관리
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // 필터 및 페이지네이션 상태
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all") 
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0) // 전체 회원 수 (선택사항)

  const { toast } = useToast()

  // ✅ 데이터 가져오기 (페이지, 검색어, 탭이 바뀔 때마다 실행)
  useEffect(() => {
    // 디바운싱용 타이머 (검색어 입력 시 깜빡임 방지)
    const timer = setTimeout(() => {
      fetchUsers()
    }, 300) 

    return () => clearTimeout(timer)
  }, [currentPage, activeTab, searchTerm])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      // 쿼리 파라미터 생성
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        status: activeTab,
        search: searchTerm
      })

      const res = await fetch(`/api/users?${query.toString()}`)
      if (res.ok) {
        const data = await res.json()
        
        // 데이터 매핑
        const formattedData = data.users.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status || "active",
          joined: u.createdAt.split("T")[0]
        }))

        setUsers(formattedData)
        setTotalPages(data.pagination.totalPages)
        setTotalCount(data.pagination.total)
      }
    } catch (error) {
      console.error("회원 로딩 실패", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 탭 변경 시 1페이지로 리셋
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSearchTerm("") // 탭 바꿀 때 검색어 초기화 (선택사항)
  }

  // 검색어 변경 시 1페이지로 리셋
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // 상태 변경 핸들러
  const handleStatusChange = async (id: string, newStatus: string) => {
    const previousUsers = [...users]
    // 낙관적 업데이트
    setUsers(users.map(user => user.id === id ? { ...user, status: newStatus } : user))

    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      })
      if (!res.ok) throw new Error("실패")
      toast({ title: "상태가 변경되었습니다." })
      fetchUsers() // 확실하게 하기 위해 서버 데이터 다시 로드 (선택)
    } catch (error) {
      setUsers(previousUsers) // 롤백
      toast({ title: "오류가 발생했습니다.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 md:w-8 md:h-8 text-slate-800 dark:text-slate-200" />
          회원 관리
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          총 <span className="font-bold text-blue-600">{totalCount}</span>명의 회원이 조회되었습니다.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
        {/* 탭 버튼들 */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto no-scrollbar">
          {["all", "pending", "active", "banned"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all capitalize",
                activeTab === tab 
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
              )}
            >
              {tab === "all" ? "전체 회원" : tab === "pending" ? "승인 대기" : tab === "active" ? "활동 중" : "정지됨"}
            </button>
          ))}
        </div>

        {/* 검색창 */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="이름/이메일 검색" 
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* 로딩 및 테이블 */}
      {isLoading ? (
         <div className="flex justify-center py-20">
           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
         </div>
      ) : (
        <>
          {/* 모바일 뷰 */}
          <div className="md:hidden space-y-4">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-slate-900 dark:text-white">{user.name}</span>
                      {user.role === 'admin' && <Badge className="bg-slate-800">관리자</Badge>}
                    </div>
                    <div>
                      {user.status === 'active' && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">활동 중</Badge>}
                      {user.status === 'banned' && <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">정지됨</Badge>}
                      {user.status === 'pending' && <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">승인 대기</Badge>}
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</div>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {user.joined}</div>
                  </div>
                  {/* ...모바일 버튼 영역 (이전 코드와 동일)... */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    {/* (버튼 로직은 이전과 동일하므로 생략하거나 그대로 사용) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full"><MoreHorizontal className="w-4 h-4" /> 관리</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>승인/복구</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'banned')} className="text-red-600">정지/거절</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : <div className="py-10 text-center text-slate-500">데이터가 없습니다.</div>}
          </div>

          {/* 데스크탑 뷰 */}
          <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-slate-50 dark:bg-slate-950">
                  <TableRow>
                    <TableHead className="w-[80px]">순번</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-slate-500">
                            {/* 전체 순번 계산: (페이지-1)*20 + 인덱스 + 1 */}
                            {(currentPage - 1) * 20 + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
                            {user.role === 'admin' && <Badge className="bg-slate-800">관리자</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500">{user.email}</TableCell>
                        <TableCell className="text-slate-500">{user.joined}</TableCell>
                        <TableCell>
                            {user.status === 'active' && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">활동 중</Badge>}
                            {user.status === 'banned' && <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">정지됨</Badge>}
                            {user.status === 'pending' && <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">승인 대기</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                            {/* 데스크탑용 버튼 로직 (드롭다운 예시) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>활동 승인</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'banned')} className="text-red-600">계정 정지</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-500">데이터가 없습니다.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 페이지네이션 컨트롤 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4 pb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 px-3"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> 이전
              </Button>
              
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                <span className="text-slate-900 dark:text-white font-bold">{currentPage}</span> / {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 px-3"
              >
                다음 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}