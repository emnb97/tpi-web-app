import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;

  if (!validUser || !validPass) {
    return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
  }

  if (
    username.toLowerCase().trim() === validUser.toLowerCase() &&
    password.trim() === validPass
  ) {
    // In production: set an HttpOnly session cookie here using next-auth or iron-session
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Access denied." }, { status: 401 });
}
