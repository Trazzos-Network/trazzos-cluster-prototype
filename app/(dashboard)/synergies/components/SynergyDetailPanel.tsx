"use client";

import { SinergiaDetectada } from "@/types/models";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, getMaterialIcon } from "@/lib/synergies/calculations";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Building,
  Calendar,
  DollarSign,
  FileText,
  Mail,
  Package,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

interface SynergyDetailPanelProps {
  synergy: SinergiaDetectada | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Detailed side panel for synergy information
 * Shows RFP details, participating companies, timeline, and actions
 */
export function SynergyDetailPanel({
  synergy,
  open,
  onClose,
}: SynergyDetailPanelProps) {
  if (!synergy) return null;

  const estadoColors: Record<string, string> = {
    cerrada: "default",
    en_rfp: "secondary",
    aprobada: "default",
    pendiente: "outline",
    contraoferta: "outline",
    rechazada: "destructive",
    recomendada: "secondary",
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-4">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="text-4xl">{getMaterialIcon(synergy.insumo)}</div>
              <div className="flex-1">
                <SheetTitle className="text-2xl leading-tight">
                  {synergy.insumo}
                </SheetTitle>
                <SheetDescription className="mt-1">
                  ID: {synergy.id}
                </SheetDescription>
              </div>
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={
                (estadoColors[synergy.estado] as
                  | "default"
                  | "secondary"
                  | "destructive"
                  | "outline") || "outline"
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
        </SheetHeader>

        <div className="space-y-6 mt-6">
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
                {synergy.decision && (
                  <div>
                    <p className="text-sm text-muted-foreground">Ahorro Real</p>
                    <p className="text-3xl font-bold text-[var(--color-chart-3)]">
                      {synergy.decision.ahorro_real_pct}%
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {formatCurrency(synergy.decision.ahorro_real_monto)}
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
                <span className="text-sm text-muted-foreground">Detectada</span>
                <span className="text-sm font-medium">
                  {format(synergy.detectada_en, "dd MMM yyyy", { locale: es })}
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
              {synergy.rfp && (
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* RFP Details */}
          {synergy.rfp && (
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
                    <p className="text-sm text-muted-foreground mb-2">
                      Ofertas Recibidas ({synergy.rfp.ofertas.length})
                    </p>
                    <div className="space-y-2">
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
                                    {oferta.contacto}
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
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">
                                    Precio:
                                  </span>{" "}
                                  {oferta.moneda} {oferta.precio_unitario}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Total:
                                  </span>{" "}
                                  {oferta.moneda}{" "}
                                  {oferta.monto_total?.toLocaleString()}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Lead Time:
                                  </span>{" "}
                                  {oferta.lead_time_dias} días
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Descuento:
                                  </span>{" "}
                                  {oferta.descuento_volumen_pct}%
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Decision Info */}
          {synergy.decision && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[var(--color-chart-3)]" />
                  Decisión Final
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Proveedor Seleccionado
                  </p>
                  <p className="text-lg font-semibold">
                    {synergy.decision.proveedor_seleccionado}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Orden de Compra
                  </p>
                  <p className="text-lg font-semibold">
                    {synergy.decision.po_numero}
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Decidido el</p>
                  <p className="text-sm font-medium">
                    {format(synergy.decision.decidido_en, "dd MMM yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {synergy.rfp && (
              <Button className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Ver Documento RFP
              </Button>
            )}
            <Button variant="outline" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Contactar Sourcing
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
