"use client";

import { useEffect, useRef } from "react";
import { useActiveWallet } from "thirdweb/react";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn } from "@/app/actions/auth";

/**
 * Component that handles redirecting authenticated users from /auth to /home
 * When wallet is connected and user is authenticated, redirects to dashboard
 */
export function AuthRedirectHandler() {
  const wallet = useActiveWallet();
  const pathname = usePathname();
  const router = useRouter();
  const hasRedirectedRef = useRef<boolean>(false);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCheckingRef = useRef<boolean>(false);
  const pollCountRef = useRef<number>(0);

  useEffect(() => {
    // Only handle redirects on the /auth page
    if (pathname !== "/auth") {
      hasRedirectedRef.current = false;
      isCheckingRef.current = false;
      pollCountRef.current = 0;
      // Clear any ongoing checks
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      return;
    }

    // Prevent multiple redirects or checks
    if (hasRedirectedRef.current || isCheckingRef.current) {
      return;
    }

    // Check if wallet is connected
    const isWalletConnected = wallet !== null;

    // If no wallet is connected, don't do anything
    if (!isWalletConnected) {
      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      pollCountRef.current = 0;
      return;
    }

    // Mark that we're checking
    isCheckingRef.current = true;
    pollCountRef.current = 0;

    // Clear any existing interval
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    const maxPolls = 20; // Maximum 10 seconds (20 * 500ms)

    const checkAuth = async () => {
      // Prevent concurrent checks or if already redirected
      if (hasRedirectedRef.current || pathname !== "/auth") {
        return;
      }

      try {
        const loggedIn = await isLoggedIn();

        // Double-check we're still on /auth before redirecting
        if (loggedIn && !hasRedirectedRef.current && pathname === "/auth") {
          hasRedirectedRef.current = true;
          isCheckingRef.current = false;
          pollCountRef.current = 0;

          // Clear interval
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }

          // Use replace instead of push to avoid history issues
          router.replace("/home");
        } else if (pollCountRef.current >= maxPolls) {
          // Stop polling after max attempts
          isCheckingRef.current = false;
          pollCountRef.current = 0;
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        isCheckingRef.current = false;
        pollCountRef.current = 0;
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      }
    };

    // Check immediately
    void checkAuth();

    // Poll every 1000ms to catch async login completion, but limit attempts
    // Increased interval to reduce load and prevent rapid checks
    checkIntervalRef.current = setInterval(() => {
      // Only continue if we haven't redirected
      if (hasRedirectedRef.current) {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        return;
      }
      pollCountRef.current++;
      void checkAuth();
    }, 1000);

    // Cleanup interval on unmount or dependency change
    return () => {
      isCheckingRef.current = false;
      pollCountRef.current = 0;
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [wallet, pathname, router]);

  // This component doesn't render anything
  return null;
}
