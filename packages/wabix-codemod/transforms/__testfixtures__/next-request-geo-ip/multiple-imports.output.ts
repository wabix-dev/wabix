// @ts-nocheck
import Link from "wabix/link";
// should added RIGHT BELOW the FIRST "wabix/server" import
import type { NextRequest } from "wabix/server";
import { geolocation, ipAddress } from "@vercel/functions";
import Script from "wabix/script";
import { notFound } from "wabix/navigation";
import { NextResponse } from "wabix/server";

export function GET(request: NextRequest) {
  const geo = geolocation(request)
  const ip = ipAddress(request)
  return NextResponse.json({ geo, ip })
}
