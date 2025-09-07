import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    // Get the token using next-auth
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    // List of protected routes
    const protectedRoutes = ["/"]

    const pathname = req.nextUrl.pathname

    // Check if the route is protected
    if (protectedRoutes.includes(pathname)) {
        // If no token, redirect to login
        if (!token) {
            const url = req.nextUrl.clone()
            url.pathname = "/login"
            return NextResponse.redirect(url)
        }
    }

    // Allow access if token exists or route is not protected
    return NextResponse.next()
}

// Apply middleware only to these paths
export const config = {
    matcher: ["/"],
}
