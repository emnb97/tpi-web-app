import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, type, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const { error } = await supabase.from("enquiries").insert([
      {
        name,
        email,
        phone: phone || "",
        type: type || "General",
        message: message || "",
        status: "New",
        date: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to submit enquiry." }, { status: 500 });
  }
}
