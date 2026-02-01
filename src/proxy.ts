import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Check if Clerk is properly configured
const isClerkConfigured = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  // Check if real keys are provided (not test/placeholder keys)
  if (!publishableKey || !secretKey) return false;
  if (publishableKey.includes('test') || publishableKey.includes('example')) return false;

  return true;
};

// Conditional middleware - use Clerk only if properly configured
export default function middleware(request: NextRequest) {
  if (isClerkConfigured()) {
    return clerkMiddleware()(request, {} as any);
  }
  // Skip authentication if Clerk is not configured
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|ogg|mov)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};