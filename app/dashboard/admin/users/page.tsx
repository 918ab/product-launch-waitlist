"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Shield, 
  Mail,
  Calendar,
  Check,
  X,
  Loader2 // 로딩 아이콘 추가
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast" // 토스트 알림

// 데이터 타입 정의 (DB 구조에 맞게 수정)
interface UserData {
  id: string
  name: string
  email: string
  role: string
  status: string
  joined: string
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all") 
  
  // [수정] DB 데이터를 담을 State
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // [추가] DB에서 회원 목록 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users")
        if (res.ok) {
          const data = await res.json()
          
          // DB 데이터를 UI 형식으로 변환
          const formattedData = data.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status || "active", // status가 없으면 기본 active
            joined: u.createdAt.split("T")[0]
          }))
          setUsers(formattedData)
        }
      } catch (error) {
        console.error("회원 로딩 실패", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // [수정] 상태 변경 핸들러 (API 호출)
  const handleStatusChange = async (id: string, newStatus: string) => {
    // 낙관적 업데이트 (UI 먼저 반영)
    const previousUsers = [...users]
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ))

    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      })

      if (!res.ok) throw new Error("업데이트 실패")
      
      toast({ title: "회원 상태가 변경되었습니다." })

    } catch (error) {
      // 실패 시 롤백
      setUsers(previousUsers)
      toast({ title: "오류가 발생했습니다.", variant: "destructive" })
    }
  }

  const filteredUsers = users.filter(user => {
    const matchTab = activeTab === "all" ? true : user.status === activeTab
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchTab && matchSearch
  })

  const counts = {
    pending: users.filter(u => u.status === 'pending').length,
    active: users.filter(u => u.status === 'active').length,
    banned: users.filter(u => u.status === 'banned').length
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 md:w-8 md:h-8 text-slate-800 dark:text-slate-200" />
          회원 관리
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          신규 가입 회원을 승인하거나, 기존 회원을 관리합니다.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
        {/* 탭 버튼들 */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "all" 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
          >
            전체 회원
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={cn(
              "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
              activeTab === "pending" 
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
          >
            승인 대기
            {counts.pending > 0 && (
              <Badge className="h-5 min-w-[20px] px-1 bg-blue-600 text-white border-0 hover:bg-blue-600 flex items-center justify-center">
                {counts.pending}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={cn(
              "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "active" 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
          >
            활동 중
          </button>
          <button
            onClick={() => setActiveTab("banned")}
            className={cn(
              "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "banned" 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
          >
            정지됨
          </button>
        </div>

        {/* 검색창 */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="이름/이메일 검색" 
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 로딩 중 표시 */}
      {isLoading ? (
         <div className="flex justify-center py-20">
           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
         </div>
      ) : (
        <>
          {/* ======================================================= */}
          {/* 1. 모바일 뷰 (카드 리스트) */}
          {/* ======================================================= */}
          <div className="md:hidden space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                  {/* 상단: 이름 + 뱃지 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-slate-900 dark:text-white">{user.name}</span>
                      {user.role === 'admin' && <Badge className="bg-slate-800">관리자</Badge>}
                    </div>
                    {/* 상태 뱃지 */}
                    <div>
                      {user.status === 'active' && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">활동 중</Badge>}
                      {user.status === 'banned' && <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">정지됨</Badge>}
                      {user.status === 'pending' && <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">승인 대기</Badge>}
                    </div>
                  </div>

                  {/* 상세 정보 */}
                  <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {user.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 가입일: {user.joined}
                    </div>
                  </div>

                  {/* 하단: 액션 버튼 */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    {user.status === 'pending' ? (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                        >
                          <Check className="w-4 h-4 mr-1" /> 승인
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(user.id, 'banned')}
                          className="text-red-600 border-red-200 hover:bg-red-50 flex-1"
                        >
                          <X className="w-4 h-4 mr-1" /> 거절
                        </Button>
                      </>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            <MoreHorizontal className="w-4 h-4 mr-2" /> 관리 메뉴 열기
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>계정 관리</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {user.status !== 'active' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')} className="text-green-600 cursor-pointer">
                              <UserCheck className="mr-2 h-4 w-4" /> 활동 승인
                            </DropdownMenuItem>
                          )}
                          {user.status !== 'banned' && user.role !== 'admin' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'banned')} className="text-red-600 cursor-pointer">
                              <UserX className="mr-2 h-4 w-4" /> 계정 정지
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                데이터가 없습니다.
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* 2. 데스크탑 뷰 (테이블) */}
          {/* ======================================================= */}
          <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-slate-50 dark:bg-slate-950">
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-slate-500">#{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
                            {user.role === 'admin' && <Badge className="bg-slate-800">관리자</Badge>}
                            {user.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <Mail className="w-3 h-3" /> {user.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                            <Calendar className="w-3 h-3" /> {user.joined}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="whitespace-nowrap">
                            {user.status === 'active' && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">활동 중</Badge>}
                            {user.status === 'banned' && <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">정지됨</Badge>}
                            {user.status === 'pending' && <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">승인 대기</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {user.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusChange(user.id, 'active')}
                                className="h-8 bg-blue-600 hover:bg-blue-700 text-white gap-1"
                              >
                                <Check className="w-3 h-3" /> 승인
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusChange(user.id, 'banned')}
                                className="h-8 text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                              >
                                <X className="w-3 h-3" /> 거절
                              </Button>
                            </div>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>계정 관리</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user.status !== 'active' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')} className="text-green-600 cursor-pointer">
                                    <UserCheck className="mr-2 h-4 w-4" /> 활동 승인
                                  </DropdownMenuItem>
                                )}
                                {user.status !== 'banned' && user.role !== 'admin' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'banned')} className="text-red-600 cursor-pointer">
                                    <UserX className="mr-2 h-4 w-4" /> 계정 정지
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                          데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}