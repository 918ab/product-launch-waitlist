import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/Course";

// 1. 커리큘럼 조회 (GET)
export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ message: "Load Error" }, { status: 500 });
  }
}

// 2. 커리큘럼 생성 (POST)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, category, level, intro, curriculum, thumbnail, customCategory } = body;

    const finalCategory = category === "direct" ? customCategory : category;

    const newCourse = await Course.create({
      title,
      description,
      category: finalCategory,
      level,
      intro,
      curriculum,
      thumbnail,
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Create Error" }, { status: 500 });
  }
}

// 3. 커리큘럼 수정 (PUT)
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, title, description, category, level, intro, curriculum, thumbnail, customCategory } = body;

    const finalCategory = category === "direct" ? customCategory : category;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category: finalCategory,
        level,
        intro,
        curriculum,
        thumbnail,
      },
      { new: true } 
    );

    if (!updatedCourse) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Update Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "ID Required" }, { status: 400 });

    await Course.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Delete Error" }, { status: 500 });
  }
}