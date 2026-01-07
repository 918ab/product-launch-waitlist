import { NextResponse } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db();
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "로딩 실패" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await db();
    const { id, status, role } = await req.json();
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await db();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "삭제됨" });
  } catch (error) {
    return NextResponse.json({ message: "삭제 실패" }, { status: 500 });
  }
}