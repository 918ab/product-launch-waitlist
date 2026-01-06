import { NextResponse } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await db();
    const { email, password } = await req.json();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "가입되지 않은 이메일입니다." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    if (user.status === "pending") {
      return NextResponse.json(
        { message: "관리자 승인 대기 중입니다. 승인 후 로그인 가능합니다." },
        { status: 403 }
      );
    }

    if (user.status === "banned") {
      return NextResponse.json(
        { message: "이용이 제한된 계정입니다." },
        { status: 403 }
      );
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json({
      message: "로그인 성공",
      user: userWithoutPassword,
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}