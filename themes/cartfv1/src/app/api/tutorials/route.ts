import { getTutorials, saveTutorials } from "@/lib/tutorials";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = getTutorials();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load tutorials" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    saveTutorials(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save tutorials" },
      { status: 500 },
    );
  }
}
