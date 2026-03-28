import { getTutorials, saveTutorials } from "@/lib/tutorials";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getTutorials();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load tutorials" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    await saveTutorials(data);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("PUT /api/tutorials failed:", message);
    return NextResponse.json(
      {
        error: message,
        hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
        hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      },
      { status: 500 },
    );
  }
}
