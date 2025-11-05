import { client } from "@/lib/services/thirdweb/client";
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";

const privateKey = process.env.NEXT_PUBLIC_ADMIN_WALLET_PRIVATE_KEY || "";

if (!privateKey) {
  throw new Error(
    "NEXT_PUBLIC_ADMIN_WALLET_PRIVATE_KEY is not set. Please add it to your .env.local file."
  );
}

const authDomain = process.env.NEXT_PUBLIC_AUTH_DOMAIN || "localhost:3000";

export const thirdwebAuth = createAuth({
  domain: authDomain,
  adminAccount: privateKeyToAccount({
    client: client,
    privateKey: privateKey,
  }),
});
