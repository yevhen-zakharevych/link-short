import { NextRequest, NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";

/**
 * Handles redirect requests for shortened links
 * @param request - The incoming request
 * @param params - Route parameters containing the shortcode
 * @returns Redirect response or 404 if link not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> },
) {
  const { shortcode } = await params;

  try {
    // Look up the link by short code
    const link = await getLinkByShortCode(shortcode);

    // If link not found, return 404
    if (!link) {
      return new NextResponse("Link not found", { status: 404 });
    }

    // Redirect to the original URL
    return NextResponse.redirect(link.originalUrl, { status: 301 });
  } catch (error) {
    console.error("Error redirecting link:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
