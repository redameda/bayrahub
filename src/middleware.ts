import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    // Get the token using next-auth
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    const pathname = req.nextUrl.pathname

    // Protect only the home page
    if (pathname === "/") {
        // If no token, redirect back to home page
        if (!token) {
            const url = req.nextUrl.clone()
            url.pathname = "/" // redirect to home
            return NextResponse.redirect(url)
        }
    }

    // Allow access if token exists or route is not protected
    return NextResponse.next()
}

// Apply middleware only to home page
export const config = {
    matcher: ["/"],
}
