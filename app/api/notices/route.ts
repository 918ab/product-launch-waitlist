import { NextResponse } from "next/server";
import db from "@/lib/db";
import Notice from "@/models/Notice";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db();
    // [수정] 정렬 순서 변경: 중요 공지(-1) 우선, 그 다음 최신순(-1)
    const notices = await Notice.find().sort({ isImportant: -1, createdAt: -1 });
    return NextResponse.json(notices);
  } catch (error) {
    return NextResponse.json({ message: "로딩 실패" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await db();
    const body = await req.json();
    const newNotice = await Notice.create(body);
    return NextResponse.json(newNotice, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "등록 실패" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await db();
    const body = await req.json();
    const { id, ...updateData } = body;
    const updated = await Notice.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await db();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Notice.findByIdAndDelete(id);
    return NextResponse.json({ message: "삭제됨" });
  } catch (error) {
    return NextResponse.json({ message: "삭제 실패" }, { status: 500 });
  }
}