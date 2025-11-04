"use client";

import { useState, useMemo, useCallback } from "react";
import {
  EstadoSinergia,
  RFPConjunta,
  DecisionComite,
  PONumber,
  UserId,
  SinergiaId,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Link2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/synergies/calculations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ComitePage() {
  // Get data from store - use selectors directly instead of calling functions
  const rfps = useSynergiesStore((state) => state.rfps);
  const pos = useSynergiesStore((state) => state.pos);
  const sinergias = useSynergiesStore((state) => state.sinergias);
  const approveRFP = useSynergiesStore((state) => state.approveRFP);
  const rejectRFP = useSynergiesStore((state) => state.rejectRFP);

  // Compute pending RFPs using useMemo to avoid infinite loops
  const pendingRFPs = useMemo(
    () =>
      rfps.filter(
        (rfp) =>
          rfp.evaluacion &&
          rfp.evaluacion.requiere_aprobacion_comite &&
          rfp.evaluacion.aprobado === undefined
      ),
    [rfps]
  );

  // Helper to get synergy by ID
  const getSynergyById = useCallback(
    (id: string) => sinergias.find((s) => s.id === id),
    [sinergias]
  );

  const [selectedRFP, setSelectedRFP] = useState<RFPConjunta | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const generateHash = (poNum: string): string => {
    return `0x${poNum
      .replace(/[^0-9A-Z]/g, "")
      .padEnd(64, "0")
      .slice(0, 64)}`;
  };

  const generateBlockNumber = (): number => {
    return Math.floor(Math.random() * 10000000) + 18000000;
  };

  const handleApprove = (rfp: RFPConjunta) => {
    setSelectedRFP(rfp);
    setApprovalDialogOpen(true);
    setComment("");
  };

  const handleReject = (rfp: RFPConjunta) => {
    setSelectedRFP(rfp);
    setRejectionDialogOpen(true);
    setComment("");
  };

  const confirmApproval = async () => {
    if (!selectedRFP || !selectedRFP.evaluacion) return;

    setIsProcessing(true);

    try {
      const synergy = getSynergyById(selectedRFP.sinergia_id);
      if (!synergy) {
        setIsProcessing(false);
        return;
      }

      const topOffer = selectedRFP.ofertas.find(
        (o) => o.oferta_id === selectedRFP.evaluacion?.oferta_recomendada_id
      );
      if (!topOffer) {
        setIsProcessing(false);
        return;
      }

      // Generate PO number
      const nextPONumber = `PO-CLUSTER-2026-${String(pos.length + 3).padStart(
        3,
        "0"
      )}` as PONumber;

      // Create decision
      const decision: DecisionComite = {
        sinergia_id: selectedRFP.sinergia_id as SinergiaId,
        accion: "aprobar",
        proveedor_seleccionado: topOffer.proveedor,
        oferta_seleccionada_id: topOffer.oferta_id,
        motivo: comment.trim() || "Aprobado por comité",
        comentarios: comment.trim() || undefined,
        po_numero: nextPONumber,
        po_monto_total: topOffer.monto_total,
        po_fecha_emision: new Date(),
        ahorro_real_pct: selectedRFP.evaluacion.ahorro_vs_baseline_pct,
        ahorro_real_monto: selectedRFP.evaluacion.ahorro_vs_baseline_monto,
        decidido_por: "comite@cluster.com" as UserId,
        decidido_en: new Date(),
        notificado_a: [],
        notificado_en: new Date(),
      };

      // Simulate blockchain transaction
      setTimeout(() => {
        // Create PO with confirmed status after transaction
        const newPO = {
          po_numero: nextPONumber,
          sinergia_id: selectedRFP.sinergia_id,
          insumo: synergy.insumo,
          proveedor: topOffer.proveedor,
          monto_total: topOffer.monto_total,
          moneda: topOffer.moneda,
          fecha_emision: new Date(),
          empresas: synergy.empresas,
          transaction_hash: generateHash(nextPONumber),
          block_number: generateBlockNumber(),
          status: "confirmed" as const,
        };

        // Use store action to approve RFP (this updates everything)
        approveRFP(selectedRFP.rfp_id, newPO, decision);

        setApprovalDialogOpen(false);
        setSelectedRFP(null);
        setComment("");
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("Error approving RFP:", error);
      setIsProcessing(false);
    }
  };

  const confirmRejection = () => {
    if (!selectedRFP) return;

    // Create decision
    const decision: DecisionComite = {
      sinergia_id: selectedRFP.sinergia_id as SinergiaId,
      accion: "rechazar",
      motivo: comment.trim() || "Rechazado por comité",
      comentarios: comment.trim() || undefined,
      decidido_por: "comite@cluster.com" as UserId,
      decidido_en: new Date(),
      notificado_a: [],
      notificado_en: new Date(),
    };

    // Use store action to reject RFP (this updates everything)
    rejectRFP(selectedRFP.rfp_id, decision);

    setRejectionDialogOpen(false);
    setSelectedRFP(null);
    setComment("");
  };

  const synergyMap = useMemo(() => {
    const map = new Map();
    pendingRFPs.forEach((rfp) => {
      const synergy = getSynergyById(rfp.sinergia_id);
      if (synergy) {
        map.set(synergy.id, synergy);
      }
    });
    return map;
  }, [pendingRFPs, getSynergyById]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Comité de Aprobación
        </h2>
        <p className="text-muted-foreground">
          Revisa y aprueba RFPs pendientes de decisión
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pendientes ({pendingRFPs.length})
          </TabsTrigger>
          <TabsTrigger value="blockchain">
            Blockchain Transactions ({pos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRFPs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No hay RFPs pendientes
                  </h3>
                  <p className="text-muted-foreground">
                    Todas las RFPs han sido procesadas por el comité.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRFPs.map((rfp) => {
                const synergy = synergyMap.get(rfp.sinergia_id);
                const evaluation = rfp.evaluacion;
                const topOffer = rfp.ofertas.find(
                  (o) => o.oferta_id === evaluation?.oferta_recomendada_id
                );

                if (!synergy || !evaluation || !topOffer) return null;

                return (
                  <Card key={rfp.rfp_id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            {synergy.insumo}
                          </CardTitle>
                          <CardDescription>
                            RFP: {rfp.rfp_id} | {synergy.empresas.length}{" "}
                            empresas participantes
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {format(rfp.fecha_emision, "dd MMM yyyy", {
                            locale: es,
                          })}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Evaluation Summary */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Proveedor Recomendado
                          </Label>
                          <p className="text-lg font-semibold">
                            {evaluation.proveedor_recomendado}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Monto Total
                          </Label>
                          <p className="text-lg font-semibold">
                            {topOffer.moneda}{" "}
                            {topOffer.monto_total.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Ahorro Estimado
                          </Label>
                          <p className="text-lg font-semibold text-green-600">
                            {evaluation.ahorro_vs_baseline_pct.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">
                          Justificación
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {evaluation.justificacion}
                        </p>
                      </div>

                      <Separator />

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleApprove(rfp)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprobar y Emitir PO
                        </Button>
                        <Button
                          onClick={() => handleReject(rfp)}
                          variant="outline"
                          className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rechazar
                        </Button>
                        <Button variant="outline" asChild>
                          <a
                            href={rfp.documento_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Ver RFP
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Purchase Orders Emitidos (Blockchain)
              </CardTitle>
              <CardDescription>
                Todas las transacciones de POs registradas en blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pos.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No hay POs emitidos
                  </h3>
                  <p className="text-muted-foreground">
                    Los POs aparecerán aquí una vez que sean aprobados.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PO Number</TableHead>
                        <TableHead>Insumo</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Transaction Hash</TableHead>
                        <TableHead>Block</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pos
                        .sort(
                          (a, b) =>
                            b.fecha_emision.getTime() -
                            a.fecha_emision.getTime()
                        )
                        .map((po) => (
                          <TableRow key={po.po_numero}>
                            <TableCell className="font-mono font-semibold">
                              {po.po_numero}
                            </TableCell>
                            <TableCell>{po.insumo}</TableCell>
                            <TableCell>{po.proveedor}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {po.moneda} {po.monto_total.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {format(po.fecha_emision, "dd MMM yyyy", {
                                locale: es,
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  po.status === "confirmed"
                                    ? "default"
                                    : po.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {po.status === "confirmed"
                                  ? "Confirmed"
                                  : po.status === "pending"
                                  ? "Pending"
                                  : "Failed"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {po.transaction_hash?.slice(0, 16)}...
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              #{po.block_number?.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar RFP y Emitir PO</DialogTitle>
            <DialogDescription>
              Al aprobar esta RFP, se emitirá automáticamente una Purchase Order
              y se registrará la transacción en blockchain. La sinergia cambiará
              a estado &quot;Cerrada&quot;.
            </DialogDescription>
          </DialogHeader>
          {selectedRFP && (
            <div className="space-y-4 py-4">
              <div>
                <Label>RFP</Label>
                <p className="text-sm font-semibold">{selectedRFP.rfp_id}</p>
              </div>
              {synergyMap.get(selectedRFP.sinergia_id) && (
                <div>
                  <Label>Insumo</Label>
                  <p className="text-sm font-semibold">
                    {synergyMap.get(selectedRFP.sinergia_id)?.insumo}
                  </p>
                </div>
              )}
              {selectedRFP.evaluacion && (
                <div>
                  <Label>Proveedor Recomendado</Label>
                  <p className="text-sm font-semibold">
                    {selectedRFP.evaluacion.proveedor_recomendado}
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="comment">Comentarios (opcional)</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Agregar comentarios sobre la aprobación..."
                  className="mt-2"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button onClick={confirmApproval} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprobar y Emitir PO
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar RFP</DialogTitle>
            <DialogDescription>
              Al rechazar esta RFP, la sinergia cambiará a estado
              &quot;Rechazada&quot;.
            </DialogDescription>
          </DialogHeader>
          {selectedRFP && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="rejection-comment">
                  Motivo del rechazo (requerido)
                </Label>
                <Textarea
                  id="rejection-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Explica el motivo del rechazo..."
                  className="mt-2"
                  required
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmRejection}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={!comment.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
