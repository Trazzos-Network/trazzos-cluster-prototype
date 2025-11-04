"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COMPREHENSIVE_SAMPLE_2026_H1 } from "@/data/sample_data_extended";
import { SAMPLE_OUTPUT } from "@/data/sample_data";
import { EstadoSinergia, Criticidad } from "@/types/models";
import { useSynergiesStore } from "@/stores/synergies-store";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  Package,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  // Get synergies from store
  const sinergias = useSynergiesStore((state) => state.sinergias);

  // KPIs is an array in extended data, get the latest one, or use single object from basic data
  const kpis = Array.isArray(COMPREHENSIVE_SAMPLE_2026_H1.kpis)
    ? COMPREHENSIVE_SAMPLE_2026_H1.kpis[
        COMPREHENSIVE_SAMPLE_2026_H1.kpis.length - 1
      ]
    : COMPREHENSIVE_SAMPLE_2026_H1.kpis || SAMPLE_OUTPUT.kpis;
  const leaderboard =
    COMPREHENSIVE_SAMPLE_2026_H1.leaderboard || SAMPLE_OUTPUT.leaderboard;
  const paradas = COMPREHENSIVE_SAMPLE_2026_H1.paradas || SAMPLE_OUTPUT.paradas;
  const paradasCount = paradas.length;
  const empresasParticipantes = kpis.empresas_participantes;

  // Calculate active synergies from store using useMemo to avoid infinite loops
  const sinergiasCerradas = useMemo(
    () => sinergias.filter((s) => s.estado === EstadoSinergia.CERRADA),
    [sinergias]
  );
  const sinergiasActivas = useMemo(
    () => sinergias.filter((s) => s.estado === EstadoSinergia.EN_RFP),
    [sinergias]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Clúster Petroquímico Cartagena
        </h2>
        <p className="text-muted-foreground">
          Dashboard de sinergias y optimización de compras conjuntas
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ahorro Consolidado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(kpis.ahorro_real_total / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.ahorro_promedio_por_sinergia_pct}% promedio por sinergia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sinergias Detectadas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.sinergias_detectadas}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.sinergias_activas} activas, {kpis.sinergias_cerradas}{" "}
              cerradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empresas Participantes
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{empresasParticipantes}</div>
            <p className="text-xs text-muted-foreground">
              {paradasCount} paradas programadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fill Rate</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.fill_rate_pct}%</div>
            <p className="text-xs text-muted-foreground">
              {kpis.stockouts_criticos} stockouts críticos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Multi-View Tabs */}
      <Tabs defaultValue="sinergias" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sinergias">Sinergias</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="rfp">RFPs</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>

        {/* Sinergias Tab */}
        <TabsContent value="sinergias" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Active Synergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Sinergias Activas
                </CardTitle>
                <CardDescription>RFPs en proceso de evaluación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sinergiasActivas.map((sinergia) => (
                    <Link
                      key={sinergia.id}
                      href={`/synergies/${encodeURIComponent(sinergia.id)}`}
                      className="block"
                    >
                      <div className="rounded-lg border p-4 space-y-2 hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{sinergia.insumo}</h3>
                          <Badge variant="secondary">
                            {sinergia.estado.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Empresas:
                            </span>{" "}
                            {sinergia.empresas_involucradas}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Volumen:
                            </span>{" "}
                            {sinergia.volumen_total} {sinergia.unidad_medida}
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Ahorro estimado:
                            </span>{" "}
                            <span className="font-bold text-green-600">
                              $
                              {(
                                (sinergia.ahorro_estimado_monto || 0) / 1000
                              ).toFixed(0)}
                              K ({sinergia.ahorro_estimado_pct}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Closed Synergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Sinergias Cerradas
                </CardTitle>
                <CardDescription>Adjudicaciones completadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sinergiasCerradas.map((sinergia) => (
                    <Link
                      key={sinergia.id}
                      href={`/synergies/${encodeURIComponent(sinergia.id)}`}
                      className="block"
                    >
                      <div className="rounded-lg border p-4 space-y-2 hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{sinergia.insumo}</h3>
                          <Badge>Cerrada</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Proveedor:
                            </span>{" "}
                            {sinergia.decision?.proveedor_seleccionado}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Empresas:
                            </span>{" "}
                            {sinergia.empresas_involucradas}
                          </div>
                          <div>
                            <span className="text-muted-foreground">PO:</span>{" "}
                            {sinergia.decision?.po_numero}
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Ahorro real:
                            </span>{" "}
                            <span className="font-bold text-green-600">
                              $
                              {(
                                (sinergia.decision?.ahorro_real_monto || 0) /
                                1000
                              ).toFixed(0)}
                              K ({sinergia.decision?.ahorro_real_pct}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Synergy Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle por Empresa</CardTitle>
              <CardDescription>
                Participación en sinergias activas y cerradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sinergiasCerradas[0]?.detalle_empresas.map((detalle, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{detalle.empresa}</p>
                      <p className="text-sm text-muted-foreground">
                        {detalle.unidad}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold">
                        {detalle.qty} {sinergiasCerradas[0].unidad_medida}
                      </p>
                      <Badge
                        variant={
                          detalle.criticidad === Criticidad.ALTA
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {detalle.criticidad}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendario" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paradas Programadas - Q1 2026</CardTitle>
              <CardDescription>
                Calendario consolidado del clúster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paradas.map((parada) => (
                  <div
                    key={parada.parada_id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{parada.empresa}</h3>
                        <p className="text-sm text-muted-foreground">
                          {parada.planta} - {parada.unidad}
                        </p>
                      </div>
                      <Badge
                        variant={
                          parada.criticidad === Criticidad.ALTA
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {parada.criticidad}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <Calendar className="inline h-4 w-4 mr-1" />
                        <span className="text-muted-foreground">
                          Inicio:
                        </span>{" "}
                        {new Date(parada.inicio).toLocaleDateString("es-ES")}
                      </div>
                      <div>
                        <Calendar className="inline h-4 w-4 mr-1" />
                        <span className="text-muted-foreground">Fin:</span>{" "}
                        {new Date(parada.fin).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                    <p className="text-sm">{parada.alcance}</p>
                    {parada.ventana_firme && (
                      <Badge variant="outline">Ventana Firme</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RFP Tab */}
        <TabsContent value="rfp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RFP - Refractarios Alto Alúmina</CardTitle>
              <CardDescription>
                {sinergiasCerradas[0]?.rfp?.rfp_id} - Completada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Emisión</p>
                    <p className="font-medium">
                      {new Date(
                        sinergiasCerradas[0]?.rfp?.fecha_emision || ""
                      ).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cierre</p>
                    <p className="font-medium">
                      {new Date(
                        sinergiasCerradas[0]?.rfp?.fecha_cierre || ""
                      ).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Decisión</p>
                    <p className="font-medium">
                      {new Date(
                        sinergiasCerradas[0]?.rfp?.fecha_decision || ""
                      ).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Ofertas Recibidas</h4>
                  <div className="space-y-2">
                    {sinergiasCerradas[0]?.rfp?.ofertas.map((oferta) => (
                      <div
                        key={oferta.oferta_id}
                        className={`rounded-lg border p-3 ${
                          oferta.scoring?.rank === 1
                            ? "border-green-500 bg-green-50 dark:bg-green-950"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {oferta.scoring?.rank === 1 && (
                              <span className="text-2xl">🏆</span>
                            )}
                            {oferta.scoring?.rank === 2 && (
                              <span className="text-2xl">🥈</span>
                            )}
                            {oferta.scoring?.rank === 3 && (
                              <span className="text-2xl">🥉</span>
                            )}
                            <span className="font-semibold">
                              {oferta.proveedor}
                            </span>
                          </div>
                          <Badge>Score: {oferta.scoring?.score_total}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Precio:
                            </span>{" "}
                            ${oferta.precio_unitario.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Lead Time:
                            </span>{" "}
                            {oferta.lead_time_dias}d
                          </div>
                          <div>
                            <span className="text-muted-foreground">SLA:</span>{" "}
                            {(oferta.sla_propuesto * 100).toFixed(0)}%
                          </div>
                        </div>
                        {oferta.comentarios && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {oferta.comentarios}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="proveedores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard de Proveedores</CardTitle>
              <CardDescription>
                Ranking por desempeño - Diciembre 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((prov) => (
                  <div
                    key={prov.proveedor}
                    className="rounded-lg border p-4 space-y-2"
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
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Cumplimiento:
                        </span>{" "}
                        {(prov.cumplimiento_promedio * 100).toFixed(0)}%
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Lead Time:
                        </span>{" "}
                        {prov.lead_time_promedio_dias}d
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Incidentes:
                        </span>{" "}
                        {prov.incidentes}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Métricas Económicas</CardTitle>
                <CardDescription>Período: {kpis.periodo}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Ahorro Estimado Total
                    </span>
                    <span className="font-bold">
                      ${(kpis.ahorro_estimado_total / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Ahorro Real Total
                    </span>
                    <span className="font-bold text-green-600">
                      ${(kpis.ahorro_real_total / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Descuento Promedio Volumen
                    </span>
                    <span className="font-bold">
                      {kpis.descuento_promedio_volumen_pct}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Ahorro Promedio por Sinergia
                    </span>
                    <span className="font-bold">
                      {kpis.ahorro_promedio_por_sinergia_pct}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Operativas</CardTitle>
                <CardDescription>Eficiencia del proceso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Cobertura Calendario
                    </span>
                    <span className="font-bold">
                      {kpis.cobertura_calendario_pct}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Tasa de Aceptación
                    </span>
                    <span className="font-bold">
                      {kpis.tasa_aceptacion_pct}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Tiempo Promedio Decisión
                    </span>
                    <span className="font-bold">
                      {kpis.tiempo_promedio_decision_dias}d
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Tiempo Promedio Ciclo
                    </span>
                    <span className="font-bold">
                      {kpis.tiempo_promedio_ciclo_dias}d
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Insumos por Ahorro</CardTitle>
              <CardDescription>
                Los 5 insumos con mayor ahorro generado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {kpis.top_insumos_ahorro.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{item.insumo}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.volumen_total} unidades | {item.sinergias}{" "}
                        {item.sinergias === 1 ? "sinergia" : "sinergias"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ${(item.ahorro_total / 1000).toFixed(0)}K
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.ahorro_pct}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
