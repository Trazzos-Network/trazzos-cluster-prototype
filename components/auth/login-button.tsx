"use client";

import { useEffect, useState } from "react";
import { generatePayload, isLoggedIn, login, logout } from "@/app/actions/auth";
import { client } from "@/lib/services/thirdweb/client";
import { ConnectButton } from "thirdweb/react";

export function LoginButton() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state after component mounts to avoid hydration mismatch
    // This is safe because it only runs once on mount
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Render placeholder during SSR to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div style={{ height: "50px", minWidth: "165px" }} aria-hidden="true">
        <div
          style={{
            height: "50px",
            minWidth: "165px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>
    );
  }

  return (
    <ConnectButton
      locale="es_ES"
      connectButton={{
        label: "Conectar Wallet",
      }}
      client={client}
      auth={{
        isLoggedIn: async (address) => {
          return isLoggedIn();
        },
        doLogin: async (params) => {
          return login(params);
        },
        doLogout: async () => {
          return await logout();
        },
        getLoginPayload: async ({ address }) => {
          return generatePayload({ address });
        },
      }}
    />
  );
}
