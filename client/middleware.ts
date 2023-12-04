import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  // signed in and verified
  // let jwt = req.cookies.get("jwt");
  // signed in and not verified
  let tempJwt = req.cookies.get("tempJwt");

  let session = req.cookies.get("session");

  if (!tempJwt && !session && !req.url.includes("/auth/sign")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (tempJwt && !session && !req.url.includes("/auth/verify")) {
    return NextResponse.redirect(new URL("/auth/verify", req.url));
  }

  if (session && req.url.includes("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  NextResponse.next();
};

export const config = {
  matcher: "/((?!.*\\.).*)",
};
