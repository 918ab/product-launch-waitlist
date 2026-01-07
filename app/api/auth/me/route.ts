import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'secret-key';
    const decoded = jwt.verify(token, secret);

    return NextResponse.json(decoded);
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}