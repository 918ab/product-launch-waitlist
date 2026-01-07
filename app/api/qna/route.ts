import { NextResponse } from "next/server";
import db from "@/lib/db";
import Qna from "@/models/Qna";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db();
    const qnas = await Qna.find().sort({ createdAt: -1 });
    return NextResponse.json(qnas);
  } catch (error) {
    return NextResponse.json({ message: "로딩 실패" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await db();
    const body = await req.json();
    const newQna = await Qna.create({ ...body, status: "waiting" });
    return NextResponse.json(newQna, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "등록 실패" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await db();
    const body = await req.json();
    const { id, answer } = body;

    if (!id) return NextResponse.json({ message: "ID 필요" }, { status: 400 });

    const updatedQna = await Qna.findByIdAndUpdate(
      id,
      { 
        answer, 
        status: "answered" 
      },
      { new: true }
    );

    return NextResponse.json(updatedQna);
  } catch (error) {
    return NextResponse.json({ message: "답변 저장 실패" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await db();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    await Qna.findByIdAndDelete(id);
    return NextResponse.json({ message: "삭제됨" });
  } catch (error) {
    return NextResponse.json({ message: "삭제 실패" }, { status: 500 });
  }
}