"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isLoggedIn?: boolean
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const pathname = usePathname()

  // 로그인 전 메뉴
  const publicNav = [
    { name: "메인홈", href: "/" },
    { name: "강사소개", href: "/about" },
    { name: "공지사항", href: "/notices" },
    { name: "QNA", href: "/qna" },
  ]

  // 로그인 후 메뉴
  const privateNav = [
    { name: "메인홈", href: "/dashboard" },
    { name: "컨텐츠소개", href: "/dashboard/contents" },
    { name: "자료실", href: "/dashboard/resources" },
    { name: "복습영상", href: "/dashboard/videos" },
    { name: "QNA", href: "/dashboard/qna" },
  ]

  const navItems = isLoggedIn ? privateNav : publicNav

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 animate-in slide-in-from-top-full duration-700 fade-in">
      {/* 반응형 컨테이너:
        모바일에서는 너비를 줄이고(w-auto), 데스크탑에서는 내용을 다 보여줌 
      */}
      <nav className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/10 transition-all hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 hover:border-white/20">
        
        {/* --- [모바일 화면] 햄버거 메뉴 버튼 --- */}
        <div className="md:hidden flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </DropdownMenuTrigger>
            
            {/* 드롭다운 내용 */}
            <DropdownMenuContent 
              align="start" 
              className="w-56 bg-[#111827]/95 backdrop-blur-xl border-white/10 text-white rounded-xl mt-2 p-2 shadow-2xl"
            >
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:bg-white/10 focus:text-white",
                      pathname === item.href ? "bg-blue-600/20 text-blue-300" : "text-gray-400 hover:text-white"
                    )}
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* --- [데스크탑 화면] 가로형 메뉴 --- */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                pathname === item.href
                  ? "text-white bg-slate-700 shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-slate-700/50 hover:scale-105",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* --- 공통: 로그인/로그아웃 버튼 (항상 표시) --- */}
        <div className="pl-2 border-l border-white/10 ml-1">
          {isLoggedIn ? (
            <Link
              href="/logout"
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              로그아웃
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              로그인
              {/* 모바일에서는 화살표 아이콘 숨김 (공간 절약) */}
              <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}