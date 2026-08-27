import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  let next = requestUrl.searchParams.get("next") ?? "/explore";

  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/explore";
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=oauth_callback", requestUrl.origin),
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth callback error:", error.message);

    return NextResponse.redirect(
      new URL("/auth/login?error=oauth_callback", requestUrl.origin),
    );
  }

  return NextResponse.redirect(
    new URL(next, requestUrl.origin),
  );
}