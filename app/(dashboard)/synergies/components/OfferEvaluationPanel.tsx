"use client";

import { useState, useMemo, useEffect } from "react";
import {
  SinergiaDetectada,
  OfertaProveedor,
  EvaluacionRFP,
  OfertaId,
  UserId,
} from "@/types/models";
import { useSynergiesStore } from "@/stores/synergies-store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calculator,
  Trophy,
  TrendingUp,
  X,
  Save,
  AlertCircle,
} from "lucide-react";

interface OfferEvaluationPanelProps {
  synergy: SinergiaDetectada;
  open: boolean;
  onClose: () => void;
}

interface OfferScoring {
  oferta_id: string;
  punt_precio: number;
  punt_lead_time: number;
  punt_sla: number;
  punt_certificaciones: number;
  score_total: number;
}

/**
 * Panel de Evaluación de Ofertas para el Auditor
 * Permite calificar ofertas según criterios y generar recomendación
 */
export function OfferEvaluationPanel({
  synergy,
  open,
  onClose,
}: OfferEvaluationPanelProps) {
  const updateRFPEvaluation = useSynergiesStore(
    (state) => state.updateRFPEvaluation
  );
  // Memoize offers to prevent unnecessary recalculations
  const offers = useMemo(
    () => synergy.rfp?.ofertas || [],
    [synergy.rfp?.ofertas]
  );
  const [ponderadores, setPonderadores] = useState({
    peso_precio: 0.6,
    peso_lead: 0.25,
    peso_sla: 0.15,
  });
  const [justificacion, setJustificacion] = useState("");

  // Debug logging
  useEffect(() => {
    if (open && synergy.rfp) {
      console.log("OfferEvaluationPanel opened", {
        synergyId: synergy.id,
        offersCount: offers.length,
        hasRFP: !!synergy.rfp,
      });
    }
  }, [open, synergy.id, offers.length, synergy.rfp]);

  // Auto-calculate scores using useMemo instead of useEffect + useState
  const scorings = useMemo<Record<string, OfferScoring>>(() => {
    if (!open || offers.length === 0) {
      return {};
    }

    // Find min/max values for normalization
    const precios = offers.map((o) => o.precio_unitario);
    const leadTimes = offers.map((o) => o.lead_time_dias);
    const slas = offers.map((o) => o.sla_propuesto);

    const minPrecio = Math.min(...precios);
    const maxPrecio = Math.max(...precios);
    const minLeadTime = Math.min(...leadTimes);
    const maxLeadTime = Math.max(...leadTimes);
    const minSLA = Math.min(...slas);
    const maxSLA = Math.max(...slas);

    // Calculate scoring for each offer
    const calculateScoring = (oferta: OfertaProveedor): OfferScoring => {
      // Normalize and score (0-100, higher is better)
      // Precio: menor es mejor
      const punt_precio =
        maxPrecio === minPrecio
          ? 100
          : ((maxPrecio - oferta.precio_unitario) / (maxPrecio - minPrecio)) *
            100;

      // Lead Time: menor es mejor
      const punt_lead_time =
        maxLeadTime === minLeadTime
          ? 100
          : ((maxLeadTime - oferta.lead_time_dias) /
              (maxLeadTime - minLeadTime)) *
            100;

      // SLA: mayor es mejor
      const punt_sla =
        maxSLA === minSLA
          ? 100
          : ((oferta.sla_propuesto - minSLA) / (maxSLA - minSLA)) * 100;

      // Certificaciones: contar número de certificaciones (normalizado)
      const maxCertificaciones = Math.max(
        ...offers.map((o) => o.certificaciones?.length || 0),
        1
      );
      const punt_certificaciones =
        ((oferta.certificaciones?.length || 0) / maxCertificaciones) * 100;

      // Weighted total score
      const score_total =
        punt_precio * ponderadores.peso_precio +
        punt_lead_time * ponderadores.peso_lead +
        punt_sla * ponderadores.peso_sla +
        punt_certificaciones * 0.05; // 5% for certifications

      return {
        oferta_id: oferta.oferta_id,
        punt_precio: Math.round(punt_precio * 10) / 10,
        punt_lead_time: Math.round(punt_lead_time * 10) / 10,
        punt_sla: Math.round(punt_sla * 10) / 10,
        punt_certificaciones: Math.round(punt_certificaciones * 10) / 10,
        score_total: Math.round(score_total * 10) / 10,
      };
    };

    const newScorings: Record<string, OfferScoring> = {};
    offers.forEach((oferta) => {
      newScorings[oferta.oferta_id] = calculateScoring(oferta);
    });
    return newScorings;
  }, [open, offers, ponderadores]);

  // Rank offers by score
  const rankedOffers = useMemo(() => {
    return [...offers].sort((a, b) => {
      const scoreA = scorings[a.oferta_id]?.score_total || 0;
      const scoreB = scorings[b.oferta_id]?.score_total || 0;
      return scoreB - scoreA; // Higher score first
    });
  }, [offers, scorings]);

  const topOffer = rankedOffers[0];
  const topScoring = topOffer ? scorings[topOffer.oferta_id] : null;

  const handleSaveEvaluation = () => {
    if (!synergy.rfp || !topOffer) return;

    // Calculate savings (compare with baseline - first offer or average)
    const baselinePrice = offers[0]?.monto_total || topOffer.monto_total;
    const savingsAmount = baselinePrice - topOffer.monto_total;
    const savingsPct =
      baselinePrice > 0 ? (savingsAmount / baselinePrice) * 100 : 0;

    // Create evaluation object
    const evaluation: EvaluacionRFP = {
      rfp_id: synergy.rfp.rfp_id,
      top_ofertas: rankedOffers
        .slice(0, 3)
        .map((o) => o.oferta_id) as OfertaId[],
      proveedor_recomendado: topOffer.proveedor,
      oferta_recomendada_id: topOffer.oferta_id as OfertaId,
      justificacion:
        justificacion.trim() ||
        `Mejor score total: ${topScoring?.score_total.toFixed(1)}. ${
          topOffer.proveedor
        } ofrece el mejor balance entre precio, lead time y SLA.`,
      ahorro_vs_baseline_pct: savingsPct,
      ahorro_vs_baseline_monto: savingsAmount,
      evaluado_por: ["auditor@cluster.com" as UserId],
      evaluado_en: new Date(),
      requiere_aprobacion_comite: true,
      aprobado: undefined,
    };

    // Update RFP evaluation in store
    updateRFPEvaluation(synergy.rfp.rfp_id, evaluation);

    // Close panel after save
    onClose();
  };

  // Don't render if synergy doesn't have RFP
  if (!synergy.rfp) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="p-8 !w-[95vw] sm:!w-[85vw] md:!w-[75vw] lg:!w-[65vw] xl:!max-w-5xl overflow-y-auto"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Evaluación de Ofertas - {synergy.insumo}
          </SheetTitle>
          <SheetDescription>
            RFP: {synergy.rfp.rfp_id} | {offers.length} ofertas recibidas
          </SheetDescription>
        </SheetHeader>

        {offers.length === 0 ? (
          <div className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay ofertas disponibles
            </h3>
            <p className="text-muted-foreground mb-4">
              Aún no se han recibido ofertas para esta RFP. Una vez se reciban
              ofertas de los proveedores, podrás evaluarlas aquí.
            </p>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Weight Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Configuración de Ponderadores
                </CardTitle>
                <CardDescription>
                  Ajusta los pesos de cada criterio de evaluación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="peso_precio">
                      Peso Precio: {(ponderadores.peso_precio * 100).toFixed(0)}
                      %
                    </Label>
                    <Input
                      id="peso_precio"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={ponderadores.peso_precio * 100}
                      onChange={(e) =>
                        setPonderadores({
                          ...ponderadores,
                          peso_precio: parseInt(e.target.value) / 100,
                        })
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="peso_lead">
                      Peso Lead Time:{" "}
                      {(ponderadores.peso_lead * 100).toFixed(0)}%
                    </Label>
                    <Input
                      id="peso_lead"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={ponderadores.peso_lead * 100}
                      onChange={(e) =>
                        setPonderadores({
                          ...ponderadores,
                          peso_lead: parseInt(e.target.value) / 100,
                        })
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="peso_sla">
                      Peso SLA: {(ponderadores.peso_sla * 100).toFixed(0)}%
                    </Label>
                    <Input
                      id="peso_sla"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={ponderadores.peso_sla * 100}
                      onChange={(e) =>
                        setPonderadores({
                          ...ponderadores,
                          peso_sla: parseInt(e.target.value) / 100,
                        })
                      }
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Offers Evaluation Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evaluación de Ofertas</CardTitle>
                <CardDescription>
                  Scoring calculado automáticamente según criterios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Rank</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead className="text-right">
                          Precio Unit.
                        </TableHead>
                        <TableHead className="text-right">Lead Time</TableHead>
                        <TableHead className="text-right">SLA</TableHead>
                        <TableHead className="text-right">
                          Punt. Precio
                        </TableHead>
                        <TableHead className="text-right">Punt. Lead</TableHead>
                        <TableHead className="text-right">Punt. SLA</TableHead>
                        <TableHead className="text-right">
                          Punt. Cert.
                        </TableHead>
                        <TableHead className="text-right font-bold">
                          Score Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rankedOffers.map((oferta, index) => {
                        const scoring = scorings[oferta.oferta_id];
                        const isTop = index === 0;
                        return (
                          <TableRow
                            key={oferta.oferta_id}
                            className={isTop ? "bg-muted/50" : ""}
                          >
                            <TableCell>
                              {isTop ? (
                                <Trophy className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <span className="font-bold">#{index + 1}</span>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {oferta.proveedor}
                            </TableCell>
                            <TableCell className="text-right">
                              {oferta.moneda}{" "}
                              {oferta.precio_unitario.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {oferta.lead_time_dias} días
                            </TableCell>
                            <TableCell className="text-right">
                              {(oferta.sla_propuesto * 100).toFixed(0)}%
                            </TableCell>
                            <TableCell className="text-right">
                              {scoring?.punt_precio.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right">
                              {scoring?.punt_lead_time.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right">
                              {scoring?.punt_sla.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right">
                              {scoring?.punt_certificaciones.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              <Badge
                                variant={isTop ? "default" : "secondary"}
                                className="text-sm"
                              >
                                {scoring?.score_total.toFixed(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Recommendation */}
            {topOffer && topScoring && (
              <Card className="border-[var(--color-chart-3)] border-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--color-chart-3)]" />
                    Recomendación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">
                      Proveedor Recomendado
                    </Label>
                    <p className="text-xl font-bold mt-1">
                      {topOffer.proveedor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {topOffer.contacto} • {topOffer.email}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Precio Total
                      </Label>
                      <p className="text-lg font-semibold">
                        {topOffer.moneda}{" "}
                        {topOffer.monto_total.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Score Total
                      </Label>
                      <p className="text-lg font-semibold">
                        {topScoring.score_total.toFixed(1)} / 100
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Ahorro Estimado
                      </Label>
                      <p className="text-lg font-semibold text-green-600">
                        {synergy.ahorro_estimado_pct}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="justificacion">
                      Justificación de la Recomendación
                    </Label>
                    <Textarea
                      id="justificacion"
                      placeholder="Explica por qué este proveedor es la mejor opción..."
                      value={justificacion}
                      onChange={(e) => setJustificacion(e.target.value)}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEvaluation}
                disabled={!justificacion.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Evaluación
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
