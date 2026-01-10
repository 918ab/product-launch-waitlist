import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Test from "@/models/Test";

export async function GET() {
  try {
    await connectDB();

    const tests = await Test.find({})
      .select("-examPapers") 
      .sort({ createdAt: -1 });
      
    return NextResponse.json(tests);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.title || !body.startDate || !body.endDate) {
      return NextResponse.json({ message: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    const newTest = await Test.create({
      title: body.title,
      timeLimit: body.timeLimit,
      startDate: body.startDate,
      endDate: body.endDate,
      examPapers: body.examPapers,
      questions: body.questions,
    });

    return NextResponse.json({ message: "생성 성공", id: newTest._id }, { status: 201 });
  } catch (error) {
    console.error("생성 오류:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}