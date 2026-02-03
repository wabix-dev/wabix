// @ts-nocheck
import { type NextRequest, NextResponse } from "wabix/server";

export function GET(request: NextRequest) {
  const geo = request.geo as NextRequest['geo']
  const ip = request.ip
  return NextResponse.json({ geo, ip })
}
