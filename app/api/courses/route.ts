import { NextResponse } from "next/server";
import db from "@/lib/db";
import Course from "@/models/Course";

export async function GET() {
  await db();
  const courses = await Course.find().sort({ createdAt: -1 });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  await db();
  const body = await req.json();
  const newCourse = await Course.create(body);
  return NextResponse.json(newCourse, { status: 201 });
}

export async function PUT(req: Request) {
  await db();
  const body = await req.json();
  const { id, ...updateData } = body;
  const updated = await Course.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  await db();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await Course.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}