import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SynergiesStoreProvider } from "@/components/synergies-store-provider";
import { LoginButton } from "@/components/auth/login-button";
import { WalletDisconnectHandler } from "@/components/auth/wallet-disconnect-handler";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SynergiesStoreProvider>
      <WalletDisconnectHandler />
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col w-full">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Trazzos Dashboard</h1>
            <div className="ml-auto flex items-center gap-4">
              <LoginButton />
            </div>
          </header>
          <div className="flex-1 p-6">{children}</div>
        </main>
      </SidebarProvider>
    </SynergiesStoreProvider>
  );
}
