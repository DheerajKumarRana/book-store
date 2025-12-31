import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith("/admin")) {
        // Fallback secret is only for dev, in prod it must be set
        const secret = process.env.NEXTAUTH_SECRET || "temporary_dev_secret_do_not_use_in_prod";
        const token = await getToken({ req, secret });

        // @ts-ignore
        if (token?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
