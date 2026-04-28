import { NextResponse, type NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("nexora_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/friends/:path*",
    "/games/:path*",
    "/lobby/:path*",
  ],
}