import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  let tempJwt = req.cookies.get("tempJwt");

  let session = req.cookies.get("session");

  // not signed in
  if (!tempJwt && !session && !req.url.includes("/auth/sign")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // signed in and not verified
  if (tempJwt && !session && !req.url.includes("/auth/verify")) {
    return NextResponse.redirect(new URL("/auth/verify", req.url));
  }

  // signed in
  if (session && req.url.includes("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  NextResponse.next();
};

export const config = {
  matcher: "/((?!.*\\.).*)",
};
