// @ts-nocheck
import { type NextRequest, NextResponse } from "wabix/server";
import { geolocation, ipAddress, Geo } from "@vercel/functions";

export function GET(request: NextRequest) {
  const geo = request.geo as Geo
  const ip = request.ip
  return NextResponse.json({ geo, ip })
}
