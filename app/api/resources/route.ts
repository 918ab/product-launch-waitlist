import { NextResponse } from "next/server";
import db from "@/lib/db";
import Resource from "@/models/Resource";

export const dynamic = 'force-dynamic';

export async function GET() {
  await db();
  const resources = await Resource.find().sort({ createdAt: -1 });
  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  try {
    await db();
    const body = await req.json();
    console.log("📥 저장할 데이터:", body); 

    const newResource = await Resource.create(body);
    return NextResponse.json(newResource, { status: 201 });

  } catch (error: any) {
    console.error("❌ DB 저장 에러:", error);
    return NextResponse.json(
      { message: error.message || "DB 저장 실패" }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await db();
    const body = await req.json();
    const { id, ...updateData } = body;
    const updated = await Resource.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await db();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Resource.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "삭제 실패" }, { status: 500 });
  }
}