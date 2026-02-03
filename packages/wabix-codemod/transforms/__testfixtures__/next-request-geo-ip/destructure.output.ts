// @ts-nocheck
import { type NextRequest, NextResponse } from "wabix/server";

import { geolocation, ipAddress } from "@vercel/functions";

export function GET(request: NextRequest) {
  const {
    buildId
  } = request;
  const ip = ipAddress(request);
  const geo = geolocation(request);
  return NextResponse.json({ buildId, geo, ip });
}
