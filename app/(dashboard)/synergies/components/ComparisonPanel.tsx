"use client";

import { SinergiaDetectada } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, DollarSign, Calendar, Users } from "lucide-react";
import { formatCurrency } from "@/lib/synergies/calculations";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ESTADO_COLORS, CRITICIDAD_COLORS } from "@/types/synergies-viz";
import { Separator } from "@/components/ui/separator";

interface ComparisonPanelProps {
  sinergias: [SinergiaDetectada, SinergiaDetectada];
  onClose: () => void;
}

/**
 * Side-by-side comparison panel for two synergies
 */
export function ComparisonPanel({
  sinergias: [sinergia1, sinergia2],
  onClose,
}: ComparisonPanelProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-2xl">Comparación de Sinergias</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-6">
            {/* Sinergia 1 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {sinergia1.insumo}
                </h3>
                <Badge
                  className="mb-2"
                  style={{ backgroundColor: ESTADO_COLORS[sinergia1.estado] }}
                >
                  {sinergia1.estado.replace(/_/g, " ").toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground">{sinergia1.id}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Ahorro
                  </p>
                  <p className="text-xl font-bold text-[var(--color-chart-3)]">
                    {sinergia1.ahorro_estimado_pct}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(sinergia1.ahorro_estimado_monto || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Volumen
                  </p>
                  <p className="text-xl font-bold">
                    {sinergia1.volumen_total} {sinergia1.unidad_medida}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Empresas
                  </p>
                  <p className="text-xl font-bold">
                    {sinergia1.empresas_involucradas}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Ventana
                  </p>
                  <p className="text-xs font-medium">
                    {format(sinergia1.ventana[0], "dd MMM", { locale: es })} -{" "}
                    {format(sinergia1.ventana[1], "dd MMM", { locale: es })}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Empresas Participantes
                </p>
                <div className="space-y-2">
                  {sinergia1.detalle_empresas.map((detalle, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm p-2 rounded border"
                    >
                      <span>{detalle.empresa}</span>
                      <div className="flex items-center gap-2">
                        <span>
                          {detalle.qty} {sinergia1.unidad_medida}
                        </span>
                        <Badge
                          className="text-xs"
                          style={{
                            backgroundColor:
                              CRITICIDAD_COLORS[detalle.criticidad],
                          }}
                        >
                          {detalle.criticidad}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sinergia 2 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {sinergia2.insumo}
                </h3>
                <Badge
                  className="mb-2"
                  style={{ backgroundColor: ESTADO_COLORS[sinergia2.estado] }}
                >
                  {sinergia2.estado.replace(/_/g, " ").toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground">{sinergia2.id}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Ahorro
                  </p>
                  <p className="text-xl font-bold text-[var(--color-chart-3)]">
                    {sinergia2.ahorro_estimado_pct}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(sinergia2.ahorro_estimado_monto || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Volumen
                  </p>
                  <p className="text-xl font-bold">
                    {sinergia2.volumen_total} {sinergia2.unidad_medida}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Empresas
                  </p>
                  <p className="text-xl font-bold">
                    {sinergia2.empresas_involucradas}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Ventana
                  </p>
                  <p className="text-xs font-medium">
                    {format(sinergia2.ventana[0], "dd MMM", { locale: es })} -{" "}
                    {format(sinergia2.ventana[1], "dd MMM", { locale: es })}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Empresas Participantes
                </p>
                <div className="space-y-2">
                  {sinergia2.detalle_empresas.map((detalle, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm p-2 rounded border"
                    >
                      <span>{detalle.empresa}</span>
                      <div className="flex items-center gap-2">
                        <span>
                          {detalle.qty} {sinergia2.unidad_medida}
                        </span>
                        <Badge
                          className="text-xs"
                          style={{
                            backgroundColor:
                              CRITICIDAD_COLORS[detalle.criticidad],
                          }}
                        >
                          {detalle.criticidad}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <Separator className="my-6" />
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Diferencia de Ahorro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {Math.abs(
                    (sinergia1.ahorro_estimado_pct || 0) -
                      (sinergia2.ahorro_estimado_pct || 0)
                  ).toFixed(1)}
                  %
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Diferencia de Volumen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {Math.abs(
                    sinergia1.volumen_total - sinergia2.volumen_total
                  ).toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {sinergia1.unidad_medida}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Empresas Comunes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {
                    sinergia1.detalle_empresas.filter((d1) =>
                      sinergia2.detalle_empresas.some(
                        (d2) => d2.empresa === d1.empresa
                      )
                    ).length
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
