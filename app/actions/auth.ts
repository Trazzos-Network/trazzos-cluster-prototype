"use server";

import { thirdwebAuth } from "@/lib/services/thirdweb/auth-services";
import { cookies } from "next/headers";
import {
  type GenerateLoginPayloadParams,
  type VerifyLoginPayloadParams,
} from "thirdweb/auth";

/**
 * Generate login payload for wallet authentication
 */
export async function generatePayload(payload: GenerateLoginPayloadParams) {
  return thirdwebAuth.generatePayload(payload);
}

/**
 * Verify login payload and generate JWT token
 */
export async function login(payload: VerifyLoginPayloadParams): Promise<void> {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    
    const c = await cookies();
    // Set JWT cookie with 24 hour expiration
    c.set("jwt", jwt, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
}

/**
 * Check if user is logged in by verifying JWT token
 */
export async function isLoggedIn() {
  const c = await cookies();
  const jwt = c.get("jwt");

  if (!jwt?.value) {
    return false;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });

  if (!authResult.valid) {
    return false;
  }

  return true;
}

/**
 * Logout user by deleting JWT cookie
 */
export async function logout(): Promise<void> {
  const c = await cookies();
  c.delete("jwt");
}
