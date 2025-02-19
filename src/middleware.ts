import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/services/:path*"],
};

export default withAuth(function middleware(request: NextRequest) {
  request.headers.set("x-url", request.url);

  return NextResponse.next({ request });
});
