import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowRight, Network, TrendingUp, Users, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Network className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Trazzos Cluster</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content - Single Section Landing */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          {/* Hero */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="h-4 w-4" />
              Plataforma de Gestión de Sinergias
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Optimiza la <span className="text-primary">colaboración</span>{" "}
              entre empresas
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Gestiona sinergias, RFPs y proveedores de forma inteligente.
              Maximiza el ahorro y potencia la eficiencia operativa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/home">
                  Acceder al Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8"
              >
                <Link href="/synergies">Explorar Sinergias</Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                <Network className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Visualización de Redes</h3>
              <p className="text-sm text-muted-foreground">
                Descubre sinergias y conexiones entre empresas de forma visual e
                interactiva
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Análisis de Impacto</h3>
              <p className="text-sm text-muted-foreground">
                Evalúa el potencial de ahorro y el impacto económico de cada
                sinergia
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Gestión Colaborativa</h3>
              <p className="text-sm text-muted-foreground">
                Coordina RFPs, evaluaciones y decisiones del comité en una sola
                plataforma
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2025 Trazzos Cluster. Plataforma de gestión de sinergias
            empresariales.
          </p>
        </div>
      </footer>
    </div>
  );
}
