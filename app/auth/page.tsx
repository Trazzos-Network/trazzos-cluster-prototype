"use client";

import { LoginButton } from "@/components/auth/login-button";
import { AuthRedirectHandler } from "@/components/auth/auth-redirect-handler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function AuthPage() {
  return (
    <>
      <AuthRedirectHandler />
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Conectar Wallet</CardTitle>
              <CardDescription className="mt-2">
                Conecta tu wallet para acceder a la plataforma Trazzos Cluster
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <LoginButton />
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Al conectar tu wallet, aceptas nuestros términos de servicio y
                política de privacidad.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
