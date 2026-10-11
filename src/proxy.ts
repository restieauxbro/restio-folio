import { NextResponse, type NextRequest } from "next/server";
import { GATE_COOKIE, gatePassword, isValidToken } from "@/lib/gate";

export function proxy(request: NextRequest) {
  // Local development without a password configured stays open.
  if (!gatePassword() && process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  if (isValidToken(request.cookies.get(GATE_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const next = request.nextUrl.pathname + request.nextUrl.search;
  url.pathname = "/unlock";
  url.search = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Everything except the unlock page, Next internals and static files the unlock page needs.
    "/((?!unlock|_next/static|_next/image|favicon.ico|icon|apple-icon|robots.txt|fonts/).*)",
  ],
};
