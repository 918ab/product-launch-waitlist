import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Test from "@/models/Test";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const test = await Test.findById(id);
    if (!test) return NextResponse.json({ message: "시험 없음" }, { status: 404 });
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedTest = await Test.findByIdAndUpdate(
      id, 
      {
        title: body.title,
        timeLimit: body.timeLimit,
        startDate: body.startDate,
        endDate: body.endDate,
        examPapers: body.examPapers,
        questions: body.questions
      },
      { new: true } 
    );

    if (!updatedTest) return NextResponse.json({ message: "시험 없음" }, { status: 404 });

    return NextResponse.json({ message: "수정 성공" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "수정 실패" }, { status: 500 });
  }
}

// DELETE (삭제)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        await Test.findByIdAndDelete(id);
        return NextResponse.json({ message: "삭제 성공" });
    } catch (error) {
        return NextResponse.json({ message: "삭제 실패" }, { status: 500 });
    }
}