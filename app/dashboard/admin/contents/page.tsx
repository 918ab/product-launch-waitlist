"use client"

import { useState } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  FileText, 
  Video, 
  Bell, 
  Trash2,
  Youtube,
  Download,
  Pencil,
  Loader2,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"

const initialContents = [
  { id: 1, title: "1강. 문장의 5형식 완벽 분석", type: "video", category: "grammar", date: "2025-01-20", detail: "45:30", link: "https://youtube.com/..." },
  { id: 2, title: "2025 문법 핵심 요약집.pdf", type: "resource", category: "grammar", date: "2025-01-20", detail: "15MB", file: "file_path..." },
  { id: 3, title: "[필독] 2월 월간 테스트 안내", type: "notice", target: "student", date: "2025-01-18", detail: "수강생" },
  { id: 4, title: "수능 영단어 Day 1-10", type: "resource", category: "vocabulary", date: "2025-01-15", detail: "8MB", file: "file_path..." },
]

export default function AdminContentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [contents, setContents] = useState(initialContents)
  const [activeTypeTab, setActiveTypeTab] = useState("all") 

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isFetchingYoutube, setIsFetchingYoutube] = useState(false)
  const [youtubeInfo, setYoutubeInfo] = useState({ duration: "", thumbnail: "" })

  const filteredContents = contents.filter(item => {
    const matchTab = activeTypeTab === "all" ? true : item.type === activeTypeTab
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchTab && matchSearch
  })

  const handleDelete = (id: number) => {
    if(confirm("정말 삭제하시겠습니까?")) {
      setContents(contents.filter(item => item.id !== id))
    }
  }

  const handleEditClick = (item: any) => {
    setEditingItem(item)
    if (item.type === 'video') setIsVideoModalOpen(true)
    else if (item.type === 'resource') setIsResourceModalOpen(true)
    else if (item.type === 'notice') setIsNoticeModalOpen(true)
  }

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setEditingItem(null)
      setYoutubeInfo({ duration: "", thumbnail: "" })
      setIsFetchingYoutube(false)
    }
    if (!open && isVideoModalOpen) setIsVideoModalOpen(false)
    if (!open && isResourceModalOpen) setIsResourceModalOpen(false)
    if (!open && isNoticeModalOpen) setIsNoticeModalOpen(false)
  }

  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    if (url.length > 10) {
      setIsFetchingYoutube(true)
      setTimeout(() => {
        setIsFetchingYoutube(false)
        setYoutubeInfo({ duration: "48:20", thumbnail: "" })
      }, 1500)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 md:w-8 md:h-8 text-slate-800 dark:text-slate-200" />
          컨텐츠 관리
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          강의, 자료, 공지사항을 등록하고 관리합니다.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row justify-between gap-4 items-end xl:items-center">
        
        {/* 등록 버튼 그룹 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full xl:w-auto">
          {/* 1. 영상 */}
          <Dialog open={isVideoModalOpen} onOpenChange={handleModalClose}>
            {!editingItem && (
              <Button onClick={() => setIsVideoModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full">
                <Youtube className="w-4 h-4" /> <span className="hidden sm:inline">영상 등록</span><span className="sm:hidden">영상</span>
              </Button>
            )}
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900">
              <DialogHeader>
                <DialogTitle>{editingItem ? "영상 수정" : "새로운 영상 등록"}</DialogTitle>
                <DialogDescription>YouTube 링크를 입력하세요.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                 <div className="space-y-2">
                  <Label>카테고리</Label>
                  <Select defaultValue={editingItem?.category || "grammar"}>
                    <SelectTrigger className="bg-white dark:bg-slate-950"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grammar">문법</SelectItem>
                      <SelectItem value="reading">독해</SelectItem>
                      <SelectItem value="listening">듣기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>강의 제목</Label>
                  <Input defaultValue={editingItem?.title} className="bg-white dark:bg-slate-950" />
                </div>
                <div className="space-y-2">
                  <Label>YouTube 링크</Label>
                  <Input defaultValue={editingItem?.link} onChange={handleYoutubeLinkChange} className="bg-white dark:bg-slate-950" />
                  {isFetchingYoutube && <div className="text-xs text-blue-500">정보 가져오는 중...</div>}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">취소</Button></DialogClose>
                <Button type="submit" className="bg-blue-600 text-white">저장</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 2. 자료 */}
          <Dialog open={isResourceModalOpen} onOpenChange={handleModalClose}>
            {!editingItem && (
              <Button onClick={() => setIsResourceModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white gap-2 w-full">
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">자료 등록</span><span className="sm:hidden">자료</span>
              </Button>
            )}
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900">
              <DialogHeader><DialogTitle>자료 등록</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                 <Label>제목</Label>
                 <Input defaultValue={editingItem?.title} className="bg-white dark:bg-slate-950" />
                 <Label>파일 업로드</Label>
                 <Input type="file" className="bg-white dark:bg-slate-950" />
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">취소</Button></DialogClose>
                <Button type="submit" className="bg-orange-600 text-white">저장</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 3. 공지 */}
          <Dialog open={isNoticeModalOpen} onOpenChange={handleModalClose}>
            {!editingItem && (
              <Button onClick={() => setIsNoticeModalOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 w-full">
                <Bell className="w-4 h-4" /> <span className="hidden sm:inline">공지 등록</span><span className="sm:hidden">공지</span>
              </Button>
            )}
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900">
               <DialogHeader><DialogTitle>공지 등록</DialogTitle></DialogHeader>
               <div className="grid gap-4 py-4">
                 <Label>제목</Label>
                 <Input defaultValue={editingItem?.title} className="bg-white dark:bg-slate-950" />
                 <Label>내용</Label>
                 <Textarea className="bg-white dark:bg-slate-950" />
               </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">취소</Button></DialogClose>
                <Button type="submit" className="bg-yellow-500 text-white">저장</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* 검색창 */}
        <div className="relative w-full xl:w-72 mt-4 xl:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="제목 검색..." 
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-full overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTypeTab("all")}
          className={cn(
            "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
            activeTypeTab === "all" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"
          )}
        >
          전체 보기
        </button>
        <button
          onClick={() => setActiveTypeTab("video")}
          className={cn(
            "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
            activeTypeTab === "video" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500"
          )}
        >
          영상
        </button>
        <button
          onClick={() => setActiveTypeTab("resource")}
          className={cn(
            "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
            activeTypeTab === "resource" ? "bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm" : "text-slate-500"
          )}
        >
          자료
        </button>
        <button
          onClick={() => setActiveTypeTab("notice")}
          className={cn(
            "whitespace-nowrap flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
            activeTypeTab === "notice" ? "bg-white dark:bg-slate-800 text-yellow-600 dark:text-yellow-400 shadow-sm" : "text-slate-500"
          )}
        >
          공지
        </button>
      </div>

      {/* ======================================================= */}
      {/* 1. 모바일 뷰 (카드 리스트) */}
      {/* ======================================================= */}
      <div className="md:hidden space-y-4">
        {filteredContents.length > 0 ? (
          filteredContents.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
              {/* 상단: 유형 아이콘 + 제목 */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {item.type === 'video' && <Video className="w-5 h-5 text-blue-500" />}
                    {item.type === 'resource' && <FileText className="w-5 h-5 text-orange-500" />}
                    {item.type === 'notice' && <Bell className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
                        {item.detail}
                      </Badge>
                      <Badge variant="outline" className="border-slate-200 text-slate-500 font-normal">
                        {item.type === 'notice' ? (
                          item.target === 'student' ? '수강생' : '전체'
                        ) : (
                          item.category
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단: 날짜 + 액션 버튼 */}
              <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.date}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-3" onClick={() => handleEditClick(item)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-3 hover:text-red-600 hover:border-red-200" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
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
                <TableHead className="w-[100px]">유형</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>상세정보</TableHead>
                <TableHead>카테고리/대상</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContents.length > 0 ? (
                filteredContents.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-slate-500">#{item.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {item.type === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                        {item.type === 'resource' && <FileText className="w-4 h-4 text-orange-500" />}
                        {item.type === 'notice' && <Bell className="w-4 h-4 text-yellow-500" />}
                        <span className="capitalize text-xs font-medium">
                          {item.type === 'video' ? '영상' : item.type === 'resource' ? '자료' : '공지'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {item.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 whitespace-nowrap">
                        {item.detail}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize font-normal text-slate-500 border-slate-300 dark:border-slate-700 whitespace-nowrap">
                        {item.type === 'notice' ? (
                          item.target === 'student' ? '수강생 전용' : item.target === 'all' ? '전체 공개' : '외부 전용'
                        ) : (
                          item.category
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                      {item.date}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditClick(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 hover:text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    등록된 컨텐츠가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}