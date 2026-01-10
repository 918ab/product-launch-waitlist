"use client"

import type React from "react"
import { useState, useEffect } from "react" 
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, BookOpen, FolderOpen, Video, MessageCircle, LogOut, Bell, User, Sun, Moon,
  Users, FileText, ShieldCheck, Loader2,
  PenTool, CalendarDays // ✅ [추가] 시험 관련 아이콘 추가
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset,
  useSidebar
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// 1. 학생용 메뉴
const sidebarItems = [
  { name: "메인홈", href: "/dashboard", icon: Home },
  { name: "공지사항", href: "/dashboard/notices", icon: Bell },
  { name: "시험 응시", href: "/dashboard/test", icon: PenTool }, // ✅ [추가] 학생 시험 페이지
  { name: "컨텐츠소개", href: "/dashboard/contents", icon: BookOpen },
  { name: "자료실", href: "/dashboard/resources", icon: FolderOpen },
  { name: "복습영상", href: "/dashboard/videos", icon: Video },
  { name: "QNA", href: "/dashboard/qna", icon: MessageCircle },
]

// 2. 관리자용 메뉴
const adminItems = [
  { name: "회원 관리", href: "/dashboard/admin/users", icon: Users },
  { name: "시험 일정 관리", href: "/dashboard/admin/test", icon: CalendarDays }, // ✅ [추가] 관리자 시험 관리 페이지
  { name: "학습 관리", href: "/dashboard/admin/contents", icon: FileText },
  { name: "Q&A 관리", href: "/dashboard/admin/qna", icon: MessageCircle }, 
]

function DashboardSidebarContent({ user, isAdmin, handleLogout }: any) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const { isMobile, setOpenMobile } = useSidebar()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <>
      <SidebarContent className="p-3 mt-4">
        {/* 학생용 메뉴 그룹 */}
        <SidebarMenu>
          {sidebarItems.map((item) => {
            // 하위 경로까지 포함해서 활성화 (예: /dashboard/test/take/... 도 활성화)
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  onClick={handleLinkClick}
                  className={cn(
                    "h-10 transition-colors",
                    isActive 
                      ? "bg-blue-600 text-white hover:bg-blue-700 font-medium" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        {/* [동적] 관리자 전용 메뉴 (isAdmin이 true일 때만 보임) */}
        {isAdmin && (
          <div className="mt-6 animate-in fade-in slide-in-from-left-2 duration-500">
             <div className="px-4 mb-2 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-red-500" />
                Admin Console
             </div>
             <SidebarMenu>
              {adminItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      onClick={handleLinkClick}
                      className={cn(
                        "h-10 transition-colors",
                        isActive 
                          ? "bg-slate-800 text-white hover:bg-slate-900 font-medium dark:bg-slate-700"
                          : "text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
             </SidebarMenu>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white h-10 cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </div>
                <span className="font-medium">
                  {mounted && theme === 'dark' ? '라이트 모드' : '다크 모드'}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 h-10 cursor-pointer"
              onClick={handleLogout}
            >
              <div>
                <LogOut className="w-5 h-5 mr-3" />
                <span>로그아웃</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          router.push("/login")
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("로그아웃 실패", error)
    }
  }

  const isAdmin = user?.role === 'admin'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Sidebar className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" collapsible="icon">
           <DashboardSidebarContent user={user} isAdmin={isAdmin} handleLogout={handleLogout} />
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm flex h-16 items-center justify-between px-4 md:px-8 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden text-slate-500 dark:text-slate-400" />
              <div className="md:hidden font-bold text-slate-900 dark:text-white text-sm">
                배문환 영어 연구소
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${isAdmin ? "bg-slate-800 text-white" : "bg-blue-100 text-blue-600"}`}>
                  {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || "사용자"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role || "Student"}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>

        <Toaster />
      </div>
    </SidebarProvider>
  )
}