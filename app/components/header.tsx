"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface HeaderProps {
  isLoggedIn?: boolean
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const pathname = usePathname()

  // Public navigation (not logged in)
  const publicNav = [
    { name: "메인홈", href: "/" },
    { name: "강사소개", href: "/about" },
    { name: "공지사항", href: "/notices" },
    { name: "QNA", href: "/qna" },
  ]

  // Private navigation (logged in)
  const privateNav = [
    { name: "메인홈", href: "/dashboard" },
    { name: "컨텐츠소개", href: "/dashboard/contents" },
    { name: "자료실", href: "/dashboard/resources" },
    { name: "복습영상", href: "/dashboard/videos" },
    { name: "QNA", href: "/dashboard/qna" },
  ]

  const navItems = isLoggedIn ? privateNav : publicNav

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <nav className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-2 shadow-lg">
        {/* Logo */}
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 text-white font-bold text-sm mr-2"
        >
          배
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                pathname === item.href
                  ? "text-white bg-slate-700"
                  : "text-gray-300 hover:text-white hover:bg-slate-700/50",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Button */}
        <div className="ml-2">
          {isLoggedIn ? (
            <Link
              href="/logout"
              className="flex items-center gap-2 px-5 py-2 bg-white text-slate-800 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              로그아웃
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2 bg-white text-slate-800 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              로그인
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
