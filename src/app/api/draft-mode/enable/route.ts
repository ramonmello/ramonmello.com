import { NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET() {
  const draft = await draftMode();
  draft.enable();

  return NextResponse.json({ message: "Draft mode enabled" }, { status: 200 });
}
