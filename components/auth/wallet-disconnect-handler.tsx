"use client";

import { useEffect, useRef } from "react";
import { useActiveWallet } from "thirdweb/react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";

/**
 * Component that handles wallet disconnection on protected routes
 * Redirects to /auth when wallet is disconnected and user is on a protected route
 */
export function WalletDisconnectHandler() {
  const wallet = useActiveWallet();
  const pathname = usePathname();
  const router = useRouter();
  const wasConnectedRef = useRef<boolean>(false);

  // Protected routes that require authentication
  const protectedPaths = [
    "/home",
    "/synergies",
    "/proveedores",
    "/comite",
    "/settings",
  ];

  useEffect(() => {
    // Check if current route is protected
    const isProtectedRoute = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

    // Check if wallet is currently connected
    const isCurrentlyConnected = wallet !== null;

    // Check if wallet was previously connected but now disconnected
    const wasConnected = wasConnectedRef.current;
    const isDisconnected = !isCurrentlyConnected && wasConnected;

    // Update the previous connection state
    wasConnectedRef.current = isCurrentlyConnected;

    // If wallet is disconnected and user is on a protected route, clear JWT and redirect to /auth
    if (isDisconnected && isProtectedRoute) {
      // Clear JWT cookie and redirect to auth page
      void logout().then(() => {
        router.push("/auth");
      });
    }
  }, [wallet, pathname, router]);

  // This component doesn't render anything
  return null;
}
