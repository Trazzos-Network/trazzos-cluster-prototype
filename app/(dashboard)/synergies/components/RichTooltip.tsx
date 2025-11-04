"use client";

import { SinergiaDetectada } from "@/types/models";
import { GraphNode, CompanyNode } from "@/types/synergies-viz";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/synergies/calculations";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface RichTooltipProps {
  node: GraphNode;
}

/**
 * Rich tooltip content for graph nodes
 * Shows detailed information based on node type
 */
export function RichTooltip({ node }: RichTooltipProps) {
  if (node.type === "company") {
    return <CompanyTooltipContent node={node} />;
  }

  if (node.type === "synergy") {
    return <SynergyTooltipContent node={node} />;
  }

  if (node.type === "material") {
    return <MaterialTooltipContent node={node} />;
  }

  return null;
}

function CompanyTooltipContent({ node }: { node: CompanyNode }) {
  return (
    <div className="space-y-2 min-w-[250px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold text-base">{node.name}</h4>
          <p className="text-xs text-muted-foreground">Empresa del Clúster</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t">
        <div>
          <p className="text-xs text-muted-foreground">Sinergias Activas</p>
          <p className="text-lg font-bold">{node.sinergias_count}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Ahorro Total</p>
          <p className="text-lg font-bold text-[var(--color-chart-3)]">
            {formatCurrency(node.total_ahorro)}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">Volumen Consolidado</p>
        <p className="text-sm font-medium">
          {formatNumber(node.total_volumen)} unidades
        </p>
      </div>
    </div>
  );
}

function SynergyTooltipContent({
  node,
}: {
  node: { type: "synergy"; data: SinergiaDetectada; radius: number };
}) {
  const { data } = node;
  const estadoColors: Record<string, string> = {
    cerrada: "default",
    en_rfp: "secondary",
    aprobada: "default",
    pendiente: "outline",
  };

  return (
    <div className="space-y-3 min-w-[350px]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-base leading-tight">
            {data.insumo}
          </h4>
          <Badge
            variant={
              (estadoColors[data.estado] as
                | "default"
                | "secondary"
                | "destructive"
                | "outline") || "outline"
            }
            className="mt-1"
          >
            {data.estado.toUpperCase().replace("_", " ")}
          </Badge>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[var(--color-chart-3)]">
            {data.ahorro_estimado_pct}%
          </p>
          <p className="text-xs text-muted-foreground">ahorro</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2 border-t text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Volumen</p>
          <p className="font-semibold">
            {data.volumen_total} {data.unidad_medida}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Empresas</p>
          <p className="font-semibold">{data.empresas_involucradas}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Monto</p>
          <p className="font-semibold text-[var(--color-chart-3)]">
            {formatCurrency(data.ahorro_estimado_monto)}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t text-sm">
        <p className="text-xs text-muted-foreground mb-1">Ventana de Entrega</p>
        <p className="font-medium">
          {format(data.ventana[0], "dd MMM", { locale: es })} →{" "}
          {format(data.ventana[1], "dd MMM yyyy", { locale: es })}
        </p>
      </div>

      {data.detalle_empresas.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            Empresas Participantes
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.detalle_empresas.map((detalle, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs py-1"
              >
                <span className="font-medium">{detalle.empresa}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {detalle.qty} {data.unidad_medida}
                  </span>
                  <Badge
                    variant={
                      detalle.criticidad === "Alta" ? "destructive" : "outline"
                    }
                    className="text-[10px] h-5"
                  >
                    {detalle.criticidad}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.rfp && (
        <div className="pt-2 border-t bg-accent/10 -mx-3 -mb-3 px-3 py-2 rounded-b-lg">
          <p className="text-xs font-medium flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[var(--color-chart-1)] rounded-full animate-pulse" />
            RFP Activa - Cierre:{" "}
            {format(data.rfp.fecha_cierre, "dd MMM", { locale: es })}
          </p>
        </div>
      )}
    </div>
  );
}

function MaterialTooltipContent({
  node,
}: {
  node: { type: "material"; category: string; icon: string };
}) {
  return (
    <div className="space-y-2 min-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{node.icon}</div>
        <div>
          <h4 className="font-semibold text-base capitalize">
            {node.category}
          </h4>
          <p className="text-xs text-muted-foreground">Categoría de Material</p>
        </div>
      </div>
    </div>
  );
}
