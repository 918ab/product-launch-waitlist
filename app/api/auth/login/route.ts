import { NextResponse } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await db();
    const { email, password } = await req.json();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json({ message: "가입되지 않은 이메일입니다." }, { status: 400 });
    }

    if (user.status === 'pending') {
      return NextResponse.json({ message: "관리자 승인 대기 중인 계정입니다." }, { status: 403 });
    }
    if (user.status === 'banned') {
      return NextResponse.json({ message: "접속이 차단된 계정입니다." }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name }, 
      process.env.JWT_SECRET || 'secret-key', 
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({ 
      message: "로그인 성공",
      user: { name: user.name, role: user.role } 
    });

    response.cookies.set('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1일
      path: '/',
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}