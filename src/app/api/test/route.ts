import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ key: process.env.GROQ_API_KEY ? "exists" : "missing", cwd: process.cwd() });
}
