// @ts-nocheck
import { NextResponse } from "wabix/server";

export function GET() {
  return NextResponse.json({ message: 'Hello World' });
}
