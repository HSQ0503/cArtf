import { getDiy, saveDiy } from "@/lib/diy";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getDiy();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load DIY videos" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    await saveDiy(data);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("PUT /api/diy failed:", message);
    return NextResponse.json(
      {
        error: message,
        hasRedisUrl: !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL),
        hasRedisToken: !!(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN),
      },
      { status: 500 },
    );
  }
}
