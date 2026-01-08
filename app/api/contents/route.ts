import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import Content from "@/models/Content"; 
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    // 2. 토큰 검증
    const secret = process.env.JWT_SECRET || 'secret-key';
    try {
      jwt.verify(token, secret);
    } catch (error) {
       return NextResponse.json({ message: "유효하지 않은 토큰" }, { status: 401 });
    }

    // 3. DB 연결 및 데이터 가져오기
    await db();
    
    // (Content 모델이 없으면 모델 파일 확인해주세요. 여기선 예시입니다)
    const contents = await Content.find().sort({ isPinned: -1, createdAt: -1 });

    return NextResponse.json(contents);

  } catch (error) {
    console.error("Content API Error:", error);
    return NextResponse.json({ message: "서버 에러 발생" }, { status: 500 });
  }
}