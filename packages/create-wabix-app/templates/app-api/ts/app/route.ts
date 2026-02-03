import { NextResponse } from "wabix/server";

export async function GET() {
  return NextResponse.json({ message: "Hello world!" });
}
