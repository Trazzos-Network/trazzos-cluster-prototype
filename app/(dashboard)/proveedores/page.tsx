"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { COMPREHENSIVE_SAMPLE_2026_H1 } from "@/data/sample_data_extended";
import { LeaderboardProveedor } from "@/types/models";
import { Building2, Search, Package, CheckCircle } from "lucide-react";
import Link from "next/link";

/**
 * Encode supplier name to URL-safe format (slug)
 */
function encodeSupplierName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProveedoresPage() {
  // Get leaderboard from extended data
  const leaderboard: LeaderboardProveedor[] = (
    "leaderboard" in COMPREHENSIVE_SAMPLE_2026_H1
      ? COMPREHENSIVE_SAMPLE_2026_H1.leaderboard
      : []
  ) as LeaderboardProveedor[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Proveedores</h2>
        <p className="text-muted-foreground">
          Gestión y seguimiento de proveedores del clúster
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar proveedores..." className="pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Leaderboard de Proveedores
          </CardTitle>
          <CardDescription>
            Ranking por desempeño - Diciembre 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((prov: LeaderboardProveedor) => (
              <Link
                key={prov.proveedor}
                href={`/proveedores/${encodeSupplierName(prov.proveedor)}`}
                className="block rounded-lg p-4 space-y-2 cursor-pointer border border-border hover:border-primary hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-muted-foreground">
                      #{prov.rank_general}
                    </span>
                    <div>
                      <h3 className="font-semibold">{prov.proveedor}</h3>
                      <p className="text-sm text-muted-foreground">
                        Score: {prov.score_proveedor} | Tasa éxito:{" "}
                        {prov.tasa_exito_pct}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ${(prov.monto_total_adjudicado / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {prov.ofertas_ganadoras}/{prov.rfps_participadas} RFPs
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cumplimiento:</span>{" "}
                    {(prov.cumplimiento_promedio * 100).toFixed(0)}%
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lead Time:</span>{" "}
                    {prov.lead_time_promedio_dias}d
                  </div>
                  <div>
                    <span className="text-muted-foreground">Incidentes:</span>{" "}
                    {prov.incidentes}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Volumen:</span>{" "}
                    {prov.volumen_total_adjudicado.toLocaleString()}
                  </div>
                </div>
                {prov.certificaciones && prov.certificaciones.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {prov.certificaciones.map((cert: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proveedores
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard.length}</div>
            <p className="text-xs text-muted-foreground">Proveedores activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RFPs Ganadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboard.reduce((sum, p) => sum + p.ofertas_ganadoras, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de adjudicaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volumen Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                leaderboard.reduce(
                  (sum, p: LeaderboardProveedor) =>
                    sum + p.volumen_total_adjudicado,
                  0
                ) / 1000
              ).toFixed(0)}
              K
            </div>
            <p className="text-xs text-muted-foreground">
              Unidades adjudicadas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
