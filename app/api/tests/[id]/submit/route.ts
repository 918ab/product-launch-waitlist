import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Test from "@/models/Test";
import Result from "@/models/Result";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const { userId, studentName, answers, timeTaken } = await request.json();

    if (!userId || !studentName) {
      return NextResponse.json({ message: "유저 정보가 없습니다." }, { status: 400 });
    }

    const existing = await Result.findOne({ testId: id, userId });
    if (existing) {
      return NextResponse.json({ message: "이미 제출된 시험입니다." }, { status: 409 });
    }

    const test = await Test.findById(id);
    if (!test) return NextResponse.json({ message: "시험 정보 없음" }, { status: 404 });

    let score = 0;
    test.questions.forEach((q: any) => {
      const studentAns = answers[q.id];
      const correctAns = q.correctAnswer;

      if (q.type === 'TEXT') {
        if (studentAns?.trim() === correctAns?.trim()) score += q.score;
      } else {
        if (studentAns === correctAns) score += q.score;
      }
    });

    const newResult = await Result.create({
      testId: id,
      userId,
      studentName,
      score,
      answers, 
      timeTaken,
      submittedAt: new Date()
    });

    return NextResponse.json({ message: "제출 성공", score }, { status: 201 });

  } catch (error) {
    console.error("제출 오류:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}