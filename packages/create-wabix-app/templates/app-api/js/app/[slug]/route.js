import { NextResponse } from "wabix/server";

export async function GET(request, { params }) {
  const { slug } = await params;
  return NextResponse.json({ message: `Hello ${slug}!` });
}
