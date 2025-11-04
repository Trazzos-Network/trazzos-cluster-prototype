"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { EstadoSinergia } from "@/types/models";
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
  Building,
  Calendar,
  FileText,
  Mail,
  Package,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency, getMaterialIcon } from "@/lib/synergies/calculations";
import Link from "next/link";
import { OfferEvaluationPanel } from "../components/OfferEvaluationPanel";

export default function SynergyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const synergyId = decodeURIComponent(params.id as string);
  const [evaluationPanelOpen, setEvaluationPanelOpen] = useState(false);

  // Get synergy from store
  const synergy = useSynergiesStore((state) => state.getSynergyById(synergyId));

  const isClosed = synergy?.estado === EstadoSinergia.CERRADA;
  const isInRFP = synergy?.estado === EstadoSinergia.EN_RFP;
  const hasDecision = !!synergy?.decision;
  const hasRFP = !!synergy?.rfp;

  // Debug: Log state changes
  useEffect(() => {
    if (synergy) {
      console.log("Evaluation panel state changed:", {
        evaluationPanelOpen,
        hasRFP,
        synergyId: synergy.id,
        rfpId: synergy.rfp?.rfp_id,
      });
    }
  }, [evaluationPanelOpen, hasRFP, synergy]);

  if (!synergy) {
    return (
      <div className="min-h-screen w-full bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Sinergia no encontrada
                </h2>
                <p className="text-muted-foreground mb-6">
                  La sinergia con ID {synergyId} no existe.
                </p>
                <Button asChild>
                  <Link href="/synergies">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a Sinergias
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-start gap-4">
            <div className="text-5xl">{getMaterialIcon(synergy.insumo)}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                {synergy.insumo}
              </h1>
              <p className="text-muted-foreground mb-4">ID: {synergy.id}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    isClosed ? "default" : isInRFP ? "secondary" : "outline"
                  }
                  className="text-sm"
                >
                  {synergy.estado.toUpperCase().replace("_", " ")}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Users className="h-3 w-3 mr-1" />
                  {synergy.empresas_involucradas} Empresas
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Package className="h-3 w-3 mr-1" />
                  {synergy.volumen_total} {synergy.unidad_medida}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--color-chart-3)]" />
                  Impacto Económico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ahorro Estimado
                    </p>
                    <p className="text-3xl font-bold text-[var(--color-chart-3)]">
                      {synergy.ahorro_estimado_pct}%
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {formatCurrency(synergy.ahorro_estimado_monto)}
                    </p>
                  </div>
                  {hasDecision && synergy.decision?.ahorro_real_pct && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ahorro Real
                      </p>
                      <p className="text-3xl font-bold text-[var(--color-chart-3)]">
                        {synergy.decision.ahorro_real_pct}%
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {formatCurrency(
                          synergy.decision.ahorro_real_monto || 0
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Cronología
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Detectada
                  </span>
                  <span className="text-sm font-medium">
                    {format(synergy.detectada_en, "dd MMM yyyy", {
                      locale: es,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Ventana de Entrega
                  </span>
                  <span className="text-sm font-medium">
                    {format(synergy.ventana[0], "dd MMM", { locale: es })} →{" "}
                    {format(synergy.ventana[1], "dd MMM yyyy", { locale: es })}
                  </span>
                </div>
                {hasRFP && synergy.rfp && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        RFP Emitida
                      </span>
                      <span className="text-sm font-medium">
                        {format(synergy.rfp.fecha_emision, "dd MMM yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Cierre RFP
                      </span>
                      <span className="text-sm font-medium">
                        {format(synergy.rfp.fecha_cierre, "dd MMM yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    {synergy.rfp.fecha_decision && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Decisión RFP
                        </span>
                        <span className="text-sm font-medium">
                          {format(synergy.rfp.fecha_decision, "dd MMM yyyy", {
                            locale: es,
                          })}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {hasDecision && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Decisión Comité
                      </span>
                      <span className="text-sm font-medium">
                        {synergy.decision &&
                          format(synergy.decision.decidido_en, "dd MMM yyyy", {
                            locale: es,
                          })}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Participating Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Empresas Participantes
                </CardTitle>
                <CardDescription>
                  Detalle de necesidades por empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead>Criticidad</TableHead>
                      <TableHead>Ventana Entrega</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {synergy.detalle_empresas.map((detalle, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {detalle.empresa}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {detalle.unidad}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {detalle.qty} {synergy.unidad_medida}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              detalle.criticidad === "Alta"
                                ? "destructive"
                                : detalle.criticidad === "Media"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {detalle.criticidad}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(detalle.ventana_entrega[0], "dd MMM", {
                            locale: es,
                          })}{" "}
                          -{" "}
                          {format(detalle.ventana_entrega[1], "dd MMM", {
                            locale: es,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* RFP Details - Show for active RFP or closed synergies */}
            {hasRFP && synergy.rfp && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Detalles del RFP
                  </CardTitle>
                  <CardDescription>ID: {synergy.rfp.rfp_id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Proveedores Invitados
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {synergy.rfp.proveedores_invitados.map((proveedor, i) => (
                        <Badge key={i} variant="outline">
                          {proveedor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {synergy.rfp.ofertas && synergy.rfp.ofertas.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Ofertas Recibidas ({synergy.rfp.ofertas.length})
                      </p>
                      <div className="space-y-3">
                        {synergy.rfp.ofertas
                          .sort(
                            (a, b) =>
                              (a.scoring?.rank || 99) - (b.scoring?.rank || 99)
                          )
                          .map((oferta) => (
                            <Card
                              key={oferta.oferta_id}
                              className={
                                oferta.scoring?.rank === 1
                                  ? "border-[var(--color-chart-3)] border-2"
                                  : ""
                              }
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                      {oferta.scoring?.rank === 1 && "🏆 "}
                                      {oferta.scoring?.rank === 2 && "🥈 "}
                                      {oferta.scoring?.rank === 3 && "🥉 "}
                                      {oferta.proveedor}
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                      {oferta.contacto} • {oferta.email}
                                    </CardDescription>
                                  </div>
                                  <Badge
                                    variant={
                                      oferta.scoring?.rank === 1
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    Score:{" "}
                                    {oferta.scoring?.score_total?.toFixed(1)}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">
                                      Precio Unitario:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {oferta.moneda}{" "}
                                      {oferta.precio_unitario.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Monto Total:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {oferta.moneda}{" "}
                                      {oferta.monto_total?.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Lead Time:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {oferta.lead_time_dias} días
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      SLA Propuesto:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {(oferta.sla_propuesto * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                  {oferta.descuento_volumen_pct && (
                                    <div>
                                      <span className="text-muted-foreground">
                                        Descuento Volumen:
                                      </span>{" "}
                                      <span className="font-medium text-green-600">
                                        {oferta.descuento_volumen_pct}%
                                      </span>
                                    </div>
                                  )}
                                  {oferta.scoring && (
                                    <div>
                                      <span className="text-muted-foreground">
                                        Ranking:
                                      </span>{" "}
                                      <span className="font-medium">
                                        #{oferta.scoring.rank}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {oferta.comentarios && (
                                  <div className="mt-3 pt-3 border-t">
                                    <p className="text-sm text-muted-foreground">
                                      {oferta.comentarios}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* RFP Evaluation - if available */}
                  {synergy.rfp.evaluacion && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">
                        Evaluación y Recomendación
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Proveedor Recomendado:
                          </span>{" "}
                          <span className="font-medium">
                            {synergy.rfp.evaluacion.proveedor_recomendado}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Justificación:
                          </span>{" "}
                          <p className="mt-1">
                            {synergy.rfp.evaluacion.justificacion}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Decision Info - Only for closed synergies */}
            {hasDecision && synergy.decision && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[var(--color-chart-3)]" />
                    Decisión Final del Comité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Acción Tomada
                      </p>
                      <p className="text-lg font-semibold capitalize">
                        {synergy.decision.accion}
                      </p>
                    </div>
                    {synergy.decision.proveedor_seleccionado && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Proveedor Seleccionado
                        </p>
                        <p className="text-lg font-semibold">
                          {synergy.decision.proveedor_seleccionado}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Motivo</p>
                    <p className="text-sm">{synergy.decision?.motivo || ""}</p>
                  </div>
                  {synergy.decision?.comentarios && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Comentarios
                      </p>
                      <p className="text-sm">{synergy.decision.comentarios}</p>
                    </div>
                  )}
                  {synergy.decision?.po_numero && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Número de PO
                          </p>
                          <p className="text-lg font-semibold">
                            {synergy.decision.po_numero}
                          </p>
                        </div>
                        {synergy.decision.po_monto_total && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Monto PO
                            </p>
                            <p className="text-lg font-semibold">
                              {formatCurrency(synergy.decision.po_monto_total)}
                            </p>
                          </div>
                        )}
                        {synergy.decision.po_fecha_emision && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Fecha Emisión PO
                            </p>
                            <p className="text-sm font-medium">
                              {format(
                                synergy.decision.po_fecha_emision,
                                "dd MMM yyyy",
                                { locale: es }
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {synergy.decision && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        Decidido por
                      </p>
                      <p className="text-sm font-medium">
                        {synergy.decision.decidido_por}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(
                          synergy.decision.decidido_en,
                          "dd MMM yyyy 'a las' HH:mm",
                          { locale: es }
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions - Only for active RFP */}
            {isInRFP && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Acciones</CardTitle>
                  <CardDescription>
                    Interacciones disponibles para esta sinergia
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {hasRFP && synergy.rfp && (
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={() => {
                        if (synergy.rfp?.documento_url) {
                          window.open(synergy.rfp.documento_url, "_blank");
                        }
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Documento RFP
                    </Button>
                  )}
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      window.location.href = `mailto:procurement@cluster.com?subject=Consulta sobre ${synergy.insumo}`;
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contactar Sourcing
                  </Button>
                  {synergy.rfp?.evaluacion && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setEvaluationPanelOpen(true);
                      }}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Ver Evaluación
                    </Button>
                  )}
                  {hasRFP && !synergy.rfp?.evaluacion && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        console.log("Evaluar Ofertas clicked", {
                          synergyId: synergy.id,
                          hasRFP: !!synergy.rfp,
                          offersCount: synergy.rfp?.ofertas?.length || 0,
                          evaluationPanelOpen: evaluationPanelOpen,
                        });
                        setEvaluationPanelOpen(true);
                        console.log("State updated, new value:", true);
                      }}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Evaluar Ofertas
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insumo:</span>
                  <span className="font-medium">{synergy.insumo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mes:</span>
                  <span className="font-medium">{synergy.mes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volumen Total:</span>
                  <span className="font-medium">
                    {synergy.volumen_total} {synergy.unidad_medida}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ventana (días):</span>
                  <span className="font-medium">
                    {synergy.ventana_dias} días
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge
                    variant={
                      isClosed ? "default" : isInRFP ? "secondary" : "outline"
                    }
                  >
                    {synergy.estado.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Acción Sugerida:
                  </span>
                  <span className="font-medium capitalize">
                    {synergy.accion_sugerida.replace("_", " ")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Offer Evaluation Panel - Always render if synergy has RFP, control visibility via open prop */}
      {synergy.rfp && (
        <OfferEvaluationPanel
          key={`eval-panel-${synergy.id}`}
          synergy={synergy}
          open={evaluationPanelOpen}
          onClose={() => {
            console.log("Closing evaluation panel");
            setEvaluationPanelOpen(false);
          }}
        />
      )}
    </div>
  );
}
