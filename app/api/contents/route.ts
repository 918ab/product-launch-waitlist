import { NextResponse } from "next/server";
import db from "@/lib/db";
import Content from "@/models/Content";

export async function GET() {
  await db();
  const contents = await Content.find().sort({ createdAt: -1 });
  return NextResponse.json(contents);
}

export async function POST(req: Request) {
  await db();
  const body = await req.json();
  const newContent = await Content.create(body);
  return NextResponse.json(newContent, { status: 201 });
}

export async function PUT(req: Request) {
  await db();
  const body = await req.json();
  const { id, ...updateData } = body;
  const updated = await Content.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  await db();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await Content.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}