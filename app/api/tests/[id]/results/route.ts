import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Test from "@/models/Test";
import Result from "@/models/Result";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const test = await Test.findById(id);
    if (!test) return NextResponse.json({ message: "시험을 찾을 수 없습니다." }, { status: 404 });

    const results = await Result.find({ testId: id }).sort({ score: -1 });

    const totalStudents = results.length;
    const scores = results.map((r: any) => r.score);
    const avgScore = totalStudents > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / totalStudents) : 0;
    const maxScore = totalStudents > 0 ? Math.max(...scores) : 0;

    const analyzedQuestions = test.questions.map((q: any) => {
      let correctCount = 0;
      if (totalStudents > 0) {
        results.forEach((r: any) => {
          const ansMap = r.answers instanceof Map ? Object.fromEntries(r.answers) : r.answers;
          const studentAnswer = ansMap ? ansMap[q.id] : "";
          
          if (studentAnswer && studentAnswer.toString().trim().includes(q.correctAnswer)) {
            correctCount++;
          }
        });
      }
      return {
        ...q.toObject(),
        correctRate: totalStudents > 0 ? Math.round((correctCount / totalStudents) * 100) : 0
      };
    });

    const rankedResults = results.map((r: any, index: number) => ({
      id: r._id,
      name: r.studentName,
      score: r.score,
      time: r.timeTaken,
      answers: r.answers,
      rank: index + 1
    }));

    return NextResponse.json({
      testTitle: test.title,
      stats: { total: totalStudents, average: avgScore, max: maxScore },
      questions: analyzedQuestions,
      results: rankedResults
    });

  } catch (error) {
    console.error("결과 로딩 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const resultId = searchParams.get("resultId");

    if (!resultId) {
      return NextResponse.json({ message: "삭제할 ID가 필요합니다." }, { status: 400 });
    }

    const deletedResult = await Result.findByIdAndDelete(resultId);

    if (!deletedResult) {
      return NextResponse.json({ message: "해당 기록을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ message: "삭제 성공" }, { status: 200 });

  } catch (error) {
    console.error("삭제 에러:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}