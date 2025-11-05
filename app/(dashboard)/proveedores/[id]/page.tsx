"use client";

import { useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { COMPREHENSIVE_SAMPLE_2026_H1 } from "@/data/sample_data_extended";
import {
  LeaderboardProveedor,
  RFPConjunta,
  SinergiaDetectada,
} from "@/types/models";
import { useSynergiesStore } from "@/stores/synergies-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Award,
  AlertCircle,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";

/**
 * Decode supplier name from URL slug
 * This tries to match the original name from the leaderboard
 */
function decodeSupplierName(
  encoded: string,
  leaderboard: LeaderboardProveedor[]
): string {
  // Try to find exact match by comparing slugs
  const encodedLower = encoded.toLowerCase();
  const match = leaderboard.find((p) => {
    const slug = p.proveedor
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
    return slug === encodedLower;
  });

  if (match) {
    return match.proveedor;
  }

  // Fallback: try to reconstruct from slug
  return encoded
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ProveedorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const encodedName = params.id as string;

  // Get leaderboard data
  const leaderboard: LeaderboardProveedor[] = (
    "leaderboard" in COMPREHENSIVE_SAMPLE_2026_H1
      ? COMPREHENSIVE_SAMPLE_2026_H1.leaderboard
      : []
  ) as LeaderboardProveedor[];

  // Decode supplier name and find supplier
  const supplier = useMemo(() => {
    const supplierName = decodeSupplierName(encodedName, leaderboard);
    return leaderboard.find(
      (p) => p.proveedor.toLowerCase() === supplierName.toLowerCase()
    );
  }, [encodedName, leaderboard]);

  const supplierName =
    supplier?.proveedor || decodeSupplierName(encodedName, leaderboard);

  // Get store data and initialize if needed
  const { sinergias, rfps, initialize } = useSynergiesStore();

  useEffect(() => {
    if (sinergias.length === 0) {
      initialize();
    }
  }, [sinergias.length, initialize]);

  // Find related synergies and RFPs
  const relatedData = useMemo(() => {
    if (!supplier || !supplierName)
      return { synergies: [], rfps: [], offers: [] };

    const relatedSynergies: SinergiaDetectada[] = [];
    const relatedRFPs: RFPConjunta[] = [];
    const offers: Array<{
      rfp: RFPConjunta;
      synergy: SinergiaDetectada;
      offer: any;
    }> = [];

    // Find synergies where this supplier has offers
    sinergias.forEach((synergy) => {
      const rfp = rfps.find((r) => r.sinergia_id === synergy.id);
      if (rfp && rfp.ofertas) {
        const supplierOffers = rfp.ofertas.filter(
          (o) => o.proveedor.toLowerCase() === supplierName.toLowerCase()
        );
        if (supplierOffers.length > 0) {
          relatedSynergies.push(synergy);
          relatedRFPs.push(rfp);
          supplierOffers.forEach((offer) => {
            offers.push({ rfp, synergy, offer });
          });
        }
      }
    });

    return { synergies: relatedSynergies, rfps: relatedRFPs, offers };
  }, [supplier, supplierName, sinergias, rfps]);

  if (!supplier) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Proveedor no encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                No se encontró información para "{supplierName}"
              </p>
              <Button asChild>
                <Link href="/proveedores">Ver todos los proveedores</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="mt-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              {supplier.proveedor}
            </h2>
            <p className="text-muted-foreground mt-1">
              Detalle del proveedor - {supplier.periodo}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Rank #{supplier.rank_general}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplier.score_proveedor}</div>
            <p className="text-xs text-muted-foreground">Puntuación total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplier.tasa_exito_pct}%</div>
            <p className="text-xs text-muted-foreground">
              {supplier.ofertas_ganadoras}/{supplier.rfps_participadas} RFPs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monto Adjudicado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(supplier.monto_total_adjudicado / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">Total adjudicado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumplimiento</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(supplier.cumplimiento_promedio * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Performance</CardTitle>
            <CardDescription>
              Indicadores de desempeño del proveedor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Lead Time Promedio
              </span>
              <span className="font-semibold">
                {supplier.lead_time_promedio_dias} días
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Rank de Precio Competitivo
              </span>
              <Badge variant="secondary">
                #{supplier.precio_competitivo_rank}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Incidentes</span>
              <span className="font-semibold">{supplier.incidentes}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Volumen Total Adjudicado
              </span>
              <span className="font-semibold">
                {supplier.volumen_total_adjudicado.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificaciones</CardTitle>
            <CardDescription>
              Certificaciones y estándares del proveedor
            </CardDescription>
          </CardHeader>
          <CardContent>
            {supplier.certificaciones && supplier.certificaciones.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {supplier.certificaciones.map((cert, idx) => (
                  <Badge key={idx} variant="outline" className="text-sm">
                    {cert}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay certificaciones registradas
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Related Synergies */}
      {relatedData.synergies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Sinergias Relacionadas
            </CardTitle>
            <CardDescription>
              Sinergias donde este proveedor ha participado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedData.synergies.map((synergy) => (
                <Link
                  key={synergy.id}
                  href={`/synergies/${encodeURIComponent(synergy.id)}`}
                  className="block"
                >
                  <div className="rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{synergy.insumo}</h4>
                        <p className="text-sm text-muted-foreground">
                          {synergy.detalle_empresas.length} empresas
                        </p>
                      </div>
                      <Badge variant="outline">{synergy.estado}</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offers History */}
      {relatedData.offers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Historial de Ofertas
            </CardTitle>
            <CardDescription>
              Ofertas presentadas por este proveedor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sinergia</TableHead>
                    <TableHead>RFP ID</TableHead>
                    <TableHead className="text-right">
                      Precio Unitario
                    </TableHead>
                    <TableHead className="text-right">Lead Time</TableHead>
                    <TableHead className="text-right">SLA</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedData.offers.map(({ synergy, rfp, offer }, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Link
                          href={`/synergies/${encodeURIComponent(synergy.id)}`}
                          className="font-medium hover:underline"
                        >
                          {synergy.insumo}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {rfp.rfp_id}
                      </TableCell>
                      <TableCell className="text-right">
                        {offer.moneda || "USD"}{" "}
                        {offer.precio_unitario?.toLocaleString() || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {offer.lead_time_dias || "N/A"}{" "}
                        {offer.lead_time_dias ? "días" : ""}
                      </TableCell>
                      <TableCell className="text-right">
                        {offer.sla_propuesto
                          ? `${(offer.sla_propuesto * 100).toFixed(0)}%`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {rfp.evaluacion?.top_ofertas?.includes(
                          offer.oferta_id
                        ) ? (
                          <Badge variant="default">Top 3</Badge>
                        ) : (
                          <Badge variant="outline">En evaluación</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State for Related Data */}
      {relatedData.synergies.length === 0 &&
        relatedData.offers.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Sin participación activa
                </h3>
                <p className="text-muted-foreground">
                  Este proveedor aún no ha participado en sinergias o RFPs
                </p>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
