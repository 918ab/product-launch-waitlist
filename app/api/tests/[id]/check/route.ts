import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Result from "@/models/Result";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // 🔥 await 추가

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ taken: false });
    }

    const existingResult = await Result.findOne({ 
      testId: id, 
      userId: userId 
    });

    if (existingResult) {
      return NextResponse.json({ 
        taken: true, 
        score: existingResult.score,
        submittedAt: existingResult.submittedAt 
      });
    }

    return NextResponse.json({ taken: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "확인 실패" }, { status: 500 });
  }
}