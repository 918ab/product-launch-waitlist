import { NextResponse } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await db();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    const query: any = {};

    if (status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [ 
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)  
      .limit(limit);  

    const totalCount = await User.countDocuments(query);

    return NextResponse.json({
      users,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        page,
        limit
      }
    });

  } catch (error) {
    console.error("User Fetch Error:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
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