import { NextResponse } from "next/server";
import db from "@/lib/db";
import Content from "@/models/Content"; 

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db();
    const contents = await Content.find().sort({ isPinned: -1, createdAt: -1 });
    return NextResponse.json(contents);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

// 2. 등록 (POST)
export async function POST(req: Request) {
  try {
    await db();
    const body = await req.json();
    
    const newContent = await Content.create(body);
    return NextResponse.json(newContent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "등록 실패" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await db();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ message: "ID가 필요합니다." }, { status: 400 });
    }

    const updatedContent = await Content.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await db();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID가 필요합니다." }, { status: 400 });
    }

    await Content.findByIdAndDelete(id);
    return NextResponse.json({ message: "삭제되었습니다." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "삭제 실패" }, { status: 500 });
  }
}