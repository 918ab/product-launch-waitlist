import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename || !request.body) {
      return NextResponse.json({ message: "파일이 없습니다." }, { status: 400 });
    }

    let finalName = filename;
    const { blobs } = await list({ prefix: filename.split('.')[0], limit: 50 });
    
    const exists = blobs.some(b => b.pathname === finalName);
    
    if (exists) {
      const namePart = filename.substring(0, filename.lastIndexOf("."));
      const extPart = filename.substring(filename.lastIndexOf("."));
      let counter = 1;
      
      while (blobs.some(b => b.pathname === `${namePart} (${counter})${extPart}`)) {
        counter++;
      }
      finalName = `${namePart} (${counter})${extPart}`;
    }

    const blob = await put(finalName, request.body, {
      access: "public",
      addRandomSuffix: false, 
    });

    return NextResponse.json(blob);
    
  } catch (error) {
    console.error("❌ 업로드 에러:", error);
    return NextResponse.json(
      { message: "업로드 서버 에러 발생" },
      { status: 500 }
    );
  }
}