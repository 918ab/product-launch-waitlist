"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, FileText, Video, Bell, Trash2, Youtube, Download, 
  Pencil, Loader2, BookOpen, Paperclip, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function AdminContentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTypeTab, setActiveTypeTab] = useState("all") 
  const [contents, setContents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const [modalOpen, setModalOpen] = useState({
    video: false, resource: false, notice: false, course: false
  })
  
  const [editingId, setEditingId] = useState<string | null>(null)

  // 1. 영상 폼
  const [videoForm, setVideoForm] = useState({ title: "", link: "", category: "grammar", customCategory: "", desc: "", duration: "00:00" })
  
  // 2. 자료 폼
  const [resForm, setResForm] = useState({ title: "", category: "기타", customCategory: "", desc: "" })
  const [resFiles, setResFiles] = useState<FileList | null>(null)
  const [existingFiles, setExistingFiles] = useState<any[]>([])
  
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 3. 공지 폼
  const [noticeForm, setNoticeForm] = useState({ title: "", content: "", isImportant: false, target: "all" })
  // 4. 커리큘럼 폼
  const [courseForm, setCourseForm] = useState({ title: "", description: "", category: "grammar", customCategory: "", level: "초급", intro: "", curriculum: "" })

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [videoRes, resRes, noticeRes, courseRes] = await Promise.all([
        fetch("/api/contents", { cache: 'no-store' }), 
        fetch("/api/resources", { cache: 'no-store' }), 
        fetch("/api/notices", { cache: 'no-store' }), 
        fetch("/api/courses", { cache: 'no-store' })
      ])

      const videos = videoRes.ok ? await videoRes.json() : []
      const resources = resRes.ok ? await resRes.json() : []
      const notices = noticeRes.ok ? await noticeRes.json() : []
      const courses = courseRes.ok ? await courseRes.json() : []

      const allData = [
        ...videos.map((v:any) => ({ ...v, id: v._id, type: "video", date: v.createdAt?.split("T")[0] || "", detail: v.duration })),
        ...resources.map((r:any) => ({ ...r, id: r._id, type: "resource", date: r.createdAt?.split("T")[0] || "", detail: `${r.files?.length || 0}개 파일` })),
        
        // [수정] 공지사항: isImportant 여부에 따라 카테고리 필드 채우기
        ...notices.map((n:any) => ({ 
            ...n, 
            id: n._id, 
            type: "notice", 
            date: n.createdAt?.split("T")[0] || "", 
            detail: n.target === 'all' ? '전체' : n.target === 'student' ? '학생' : '외부',
            category: n.isImportant ? "중요" : "일반" // 여기서 변환
        })),
        
        ...courses.map((c:any) => ({ ...c, id: c._id, type: "course", date: c.createdAt?.split("T")[0] || "", detail: c.level }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setContents(allData)
    } catch (error) {
      console.error(error)
      toast({ title: "데이터 로딩 실패", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchAllData() }, [])

  const closeModal = () => {
    setModalOpen({ video: false, resource: false, notice: false, course: false })
    setEditingId(null)
    setVideoForm({ title: "", link: "", category: "grammar", customCategory: "", desc: "", duration: "00:00" })
    setResForm({ title: "", category: "기타", customCategory: "", desc: "" })
    setResFiles(null)
    setExistingFiles([])
    if(fileInputRef.current) fileInputRef.current.value = ""
    setNoticeForm({ title: "", content: "", isImportant: false, target: "all" })
    setCourseForm({ title: "", description: "", category: "grammar", customCategory: "", level: "초급", intro: "", curriculum: "" })
  }

  const handleEditClick = (item: any) => {
    setEditingId(item.id)
    if (item.type === 'video') {
      const isCustom = !["grammar", "reading", "listening", "vocabulary"].includes(item.category)
      setVideoForm({ 
        title: item.title, link: item.videoUrl, desc: item.description || "", 
        duration: item.duration || "00:00",
        category: isCustom ? "direct" : item.category,
        customCategory: isCustom ? item.category : ""
      })
      setModalOpen({ ...modalOpen, video: true })
    } 
    else if (item.type === 'resource') {
      const isCustom = !["기출문제", "단어장", "수업자료", "기타"].includes(item.category)
      setResForm({ 
        title: item.title, desc: item.description || "",
        category: isCustom ? "direct" : item.category,
        customCategory: isCustom ? item.category : ""
      })
      setExistingFiles(item.files || [])
      setModalOpen({ ...modalOpen, resource: true })
    }
    else if (item.type === 'notice') {
      setNoticeForm({ title: item.title, content: item.content, isImportant: item.isImportant, target: item.target || "all" })
      setModalOpen({ ...modalOpen, notice: true })
    }
    else if (item.type === 'course') {
      const isCustom = !["grammar", "reading", "vocabulary", "listening"].includes(item.category)
      setCourseForm({
        title: item.title, description: item.description, level: item.level, intro: item.intro,
        curriculum: item.curriculum ? item.curriculum.join("\n") : "",
        category: isCustom ? "direct" : item.category,
        customCategory: isCustom ? item.category : ""
      })
      setModalOpen({ ...modalOpen, course: true })
    }
  }

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    const endpointMap: Record<string, string> = { video: "contents", resource: "resources", notice: "notices", course: "courses" }
    
    try {
      const res = await fetch(`/api/${endpointMap[type]}?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "삭제되었습니다." })
        setContents(prev => prev.filter(c => c.id !== id))
      }
    } catch (e) {
      toast({ title: "삭제 실패", variant: "destructive" })
    }
  }

  const removeExistingFile = (indexToRemove: number) => {
    setExistingFiles(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // 자료 저장
  const saveResource = async () => {
    const finalCategory = resForm.category === "direct" ? resForm.customCategory : resForm.category
    
    if (existingFiles.length === 0 && (!resFiles || resFiles.length === 0)) {
        toast({ title: "최소 1개의 파일이 필요합니다.", variant: "destructive" }); return;
    }

    setIsUploading(true)
    try {
      let finalFileList = [...existingFiles]

      if (resFiles && resFiles.length > 0) {
        for (let i = 0; i < resFiles.length; i++) {
          const file = resFiles[i]
          const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: 'POST', body: file })
          
          if (!uploadRes.ok) {
             const err = await uploadRes.text();
             console.error(err);
             throw new Error("Vercel 업로드 실패");
          }
          const blob = await uploadRes.json()
          
          finalFileList.push({
            fileName: blob.pathname || file.name,
            filePath: blob.url,
            fileSize: (file.size / 1024 / 1024).toFixed(2) + " MB"
          })
        }
      }

      const dbRes = await fetch("/api/resources", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingId && { id: editingId }),
          title: resForm.title, 
          description: resForm.desc, 
          category: finalCategory,
          files: finalFileList, 
          isNewResource: true
        })
      })

      if (!dbRes.ok) {
         const err = await dbRes.json();
         throw new Error(err.message || "DB 저장 실패");
      }

      toast({ title: "저장 완료!" })
      closeModal()
      await fetchAllData()

    } catch (e: any) {
      console.error(e)
      toast({ title: e.message || "오류 발생", variant: "destructive" })
    } finally {
      setIsUploading(false)
    }
  }

  const saveVideo = async () => {
    const finalCategory = videoForm.category === "direct" ? videoForm.customCategory : videoForm.category
    const body = { title: videoForm.title, videoUrl: videoForm.link, description: videoForm.desc, category: finalCategory, duration: videoForm.duration, ...(editingId && { id: editingId }) }
    await fetch("/api/contents", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    closeModal(); fetchAllData(); toast({ title: "저장 완료" })
  }

  const saveNotice = async () => {
    const body = { title: noticeForm.title, content: noticeForm.content, isImportant: noticeForm.isImportant, target: noticeForm.target, ...(editingId && { id: editingId }) }
    await fetch("/api/notices", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    closeModal(); fetchAllData(); toast({ title: "저장 완료" })
  }

  const saveCourse = async () => {
    const finalCategory = courseForm.category === "direct" ? courseForm.customCategory : courseForm.category
    const body = {
      title: courseForm.title, description: courseForm.description, level: courseForm.level, 
      intro: courseForm.intro, curriculum: courseForm.curriculum.split("\n"),
      category: finalCategory, ...(editingId && { id: editingId })
    }
    await fetch("/api/courses", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    closeModal(); fetchAllData(); toast({ title: "저장 완료" })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-8 h-8" /> 컨텐츠 통합 관리
        </h1>
        <p className="text-slate-500">강의, 자료, 공지, 커리큘럼을 관리합니다.</p>
      </div>

      <div className="flex flex-col xl:flex-row justify-between gap-4 items-end xl:items-center">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full xl:w-auto">
          <Button onClick={() => setModalOpen({ ...modalOpen, video: true })} className="bg-blue-600 hover:bg-blue-700 text-white gap-2"><Youtube className="w-4 h-4" /> 영상</Button>
          <Button onClick={() => setModalOpen({ ...modalOpen, resource: true })} className="bg-orange-600 hover:bg-orange-700 text-white gap-2"><Download className="w-4 h-4" /> 자료</Button>
          <Button onClick={() => setModalOpen({ ...modalOpen, notice: true })} className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2"><Bell className="w-4 h-4" /> 공지</Button>
          <Button onClick={() => setModalOpen({ ...modalOpen, course: true })} className="bg-purple-600 hover:bg-purple-700 text-white gap-2"><BookOpen className="w-4 h-4" /> 소개</Button>
        </div>
        <div className="relative w-full xl:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="제목 검색..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto">
        {["all", "video", "resource", "notice", "course"].map(tab => (
          <button key={tab} onClick={() => setActiveTypeTab(tab)}
            className={cn("flex-1 px-4 py-2 text-sm font-medium rounded-md capitalize transition-all", activeTypeTab === tab ? "bg-white shadow text-black" : "text-slate-500")}
          >
            {tab === 'all' ? '전체' : tab === 'video' ? '영상' : tab === 'resource' ? '자료' : tab === 'notice' ? '공지' : '소개'}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>유형</TableHead>
              <TableHead>제목</TableHead>
              {/* [수정] 헤더 이름을 카테고리/중요 로 변경 */}
              <TableHead>카테고리/중요</TableHead>
              <TableHead>상세</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.filter(item => (activeTypeTab === "all" || item.type === activeTypeTab) && item.title.includes(searchTerm)).map((item) => (
              <TableRow key={item.id}>
                <TableCell className="capitalize font-medium text-xs text-slate-500">{item.type}</TableCell>
                <TableCell className="font-bold">{item.title}</TableCell>
                <TableCell>
                  {/* [수정] 공지사항이면 중요 여부, 그 외엔 카테고리 표시 */}
                  {item.type === 'notice' ? (
                    item.category === '중요' ? <Badge className="bg-red-500 hover:bg-red-600 border-0">중요(필독)</Badge> : <Badge variant="secondary">일반</Badge>
                  ) : (
                    <Badge variant="outline">{item.category}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-slate-500">{item.detail}</TableCell>
                <TableCell className="text-xs">{item.date}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => handleEditClick(item)}><Pencil className="w-4 h-4 text-blue-500" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id, item.type)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 1. 영상 모달 */}
      <Dialog open={modalOpen.video} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>{editingId ? "영상 수정" : "영상 등록"}</DialogTitle></DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <Label>카테고리</Label>
              <div className="flex gap-2">
                <Select value={videoForm.category} onValueChange={(v) => setVideoForm({ ...videoForm, category: v })}>
                  <SelectTrigger className="w-full sm:w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grammar">문법</SelectItem><SelectItem value="reading">독해</SelectItem>
                    <SelectItem value="listening">듣기</SelectItem><SelectItem value="vocabulary">어휘</SelectItem>
                    <SelectItem value="direct">직접 입력</SelectItem>
                  </SelectContent>
                </Select>
                {videoForm.category === "direct" && <Input className="flex-1" placeholder="직접 입력" value={videoForm.customCategory} onChange={(e) => setVideoForm({ ...videoForm, customCategory: e.target.value })} />}
              </div>
            </div>
            <div className="space-y-3"><Label>제목</Label><Input value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} /></div>
            <div className="space-y-3"><Label>링크</Label><Input value={videoForm.link} onChange={(e) => setVideoForm({ ...videoForm, link: e.target.value })} placeholder="https://..." /></div>
            <div className="space-y-3"><Label>시간 (예: 15:30)</Label><Input value={videoForm.duration} onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={saveVideo}>저장</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. 자료 모달 */}
      <Dialog open={modalOpen.resource} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent className="sm:max-w-[500px] gap-6">
          <DialogHeader><DialogTitle>{editingId ? "자료 수정" : "자료 등록"}</DialogTitle></DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <Label>카테고리</Label>
              <div className="flex gap-2">
                <Select value={resForm.category} onValueChange={(v) => setResForm({ ...resForm, category: v })}>
                  <SelectTrigger className="w-full sm:w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="기출문제">기출문제</SelectItem><SelectItem value="단어장">단어장</SelectItem>
                    <SelectItem value="수업자료">수업자료</SelectItem><SelectItem value="direct">직접 입력</SelectItem>
                  </SelectContent>
                </Select>
                {resForm.category === "direct" && <Input className="flex-1" placeholder="직접 입력" value={resForm.customCategory} onChange={(e) => setResForm({ ...resForm, customCategory: e.target.value })} />}
              </div>
            </div>
            <div className="space-y-3"><Label>제목</Label><Input value={resForm.title} onChange={(e) => setResForm({ ...resForm, title: e.target.value })} /></div>
            <div className="space-y-3">
              <Label>설명</Label>
              <Textarea value={resForm.desc} onChange={(e) => setResForm({ ...resForm, desc: e.target.value })} className="min-h-[100px] resize-none" placeholder="자료 설명" />
            </div>
            
            <div className="space-y-3">
              <Label>파일 (여러 개 선택 가능)</Label>
              {existingFiles.length > 0 && (
                <div className="mb-2 space-y-2">
                  <p className="text-xs text-slate-500 font-bold">기존 파일:</p>
                  {existingFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{file.fileName}</span>
                      </div>
                      <button onClick={() => removeExistingFile(i)} className="text-red-500 hover:bg-red-100 p-1 rounded"><X className="w-3 h-3"/></button>
                    </div>
                  ))}
                </div>
              )}

              <Input type="file" multiple ref={fileInputRef} onChange={(e) => setResFiles(e.target.files)} className="cursor-pointer" />
              
              {resFiles && resFiles.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-blue-500 font-bold">새로 추가될 파일:</p>
                  {Array.from(resFiles).map((file, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      <Paperclip className="w-3 h-3 shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs opacity-70 shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter><Button onClick={saveResource} disabled={isUploading}>{isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>저장 중</> : "저장"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. 공지 모달 */}
      <Dialog open={modalOpen.notice} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent className="sm:max-w-[500px] gap-6">
          <DialogHeader><DialogTitle>{editingId ? "공지 수정" : "공지 등록"}</DialogTitle></DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <Label>공개 대상</Label>
              <Select value={noticeForm.target} onValueChange={(v) => setNoticeForm({ ...noticeForm, target: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 공개</SelectItem>
                  <SelectItem value="student">학생만 공개</SelectItem>
                  <SelectItem value="guest">비회원만 공개</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3"><Label>제목</Label><Input value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} /></div>
            <div className="space-y-3"><Label>내용</Label><Textarea value={noticeForm.content} onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })} className="min-h-[100px]" /></div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" checked={noticeForm.isImportant} onChange={(e) => setNoticeForm({ ...noticeForm, isImportant: e.target.checked })} className="w-4 h-4" /> 
              <Label>중요(필독) 설정</Label>
            </div>
          </div>
          <DialogFooter><Button onClick={saveNotice}>저장</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. 커리큘럼 모달 */}
      <Dialog open={modalOpen.course} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto gap-6">
          <DialogHeader><DialogTitle>{editingId ? "커리큘럼 수정" : "커리큘럼 등록"}</DialogTitle></DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <Label>카테고리</Label>
              <div className="flex gap-2">
                <Select value={courseForm.category} onValueChange={(v) => setCourseForm({ ...courseForm, category: v })}>
                  <SelectTrigger className="w-full sm:w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grammar">문법</SelectItem><SelectItem value="reading">독해</SelectItem>
                    <SelectItem value="listening">듣기</SelectItem><SelectItem value="direct">직접 입력</SelectItem>
                  </SelectContent>
                </Select>
                {courseForm.category === "direct" && <Input className="flex-1" placeholder="입력" value={courseForm.customCategory} onChange={(e) => setCourseForm({ ...courseForm, customCategory: e.target.value })} />}
              </div>
            </div>
            <div className="space-y-3"><Label>제목</Label><Input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} /></div>
            <div className="space-y-3">
              <Label>난이도</Label>
              <Select value={courseForm.level} onValueChange={(v) => setCourseForm({ ...courseForm, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="초급">초급</SelectItem><SelectItem value="중급">중급</SelectItem><SelectItem value="고급">고급</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-3"><Label>한줄 요약</Label><Input value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} /></div>
            <div className="space-y-3"><Label>상세 소개</Label><Textarea value={courseForm.intro} onChange={(e) => setCourseForm({ ...courseForm, intro: e.target.value })} /></div>
            <div className="space-y-3"><Label>커리큘럼 (줄바꿈)</Label><Textarea value={courseForm.curriculum} onChange={(e) => setCourseForm({ ...courseForm, curriculum: e.target.value })} placeholder="1주차: ...&#13;&#10;2주차: ..." className="min-h-[100px]" /></div>
          </div>
          <DialogFooter><Button onClick={saveCourse}>저장</Button></DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}