import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/leads";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ ok: false, error: "Please check the form", fieldErrors }, { status: 422 });
  }

  const { company_website, ...lead } = parsed.data;
  // Bots that fill the honeypot get a success response and nothing is saved.
  if (company_website) return NextResponse.json({ ok: true });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("Lead not saved: SUPABASE_URL / SUPABASE_ANON_KEY are not set");
    return NextResponse.json(
      { ok: false, error: "Our form is being set up. Please message us on WhatsApp or email instead." },
      { status: 503 },
    );
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("leads").insert({ ...lead, source: "website" });
  if (error) {
    console.error("Lead insert failed", error.message);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again, or message us on WhatsApp." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
