import { SinergiaDetectada } from "@/types/models";
import { TimelineEvent, TimelineEventType } from "@/types/synergies-viz";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Extract all chronological events from a synergy
 */
export function extractTimelineEvents(
  sinergia: SinergiaDetectada
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // 1. Detection event
  events.push({
    id: `${sinergia.id}-detection`,
    sinergiaId: sinergia.id,
    type: "detection",
    date: sinergia.detectada_en,
    label: "Detección",
    description: `Sinergia detectada: ${sinergia.insumo}`,
    insumo: sinergia.insumo,
    estado: sinergia.estado,
  });

  // 2. Update events
  if (sinergia.actualizada_en) {
    events.push({
      id: `${sinergia.id}-update`,
      sinergiaId: sinergia.id,
      type: "update",
      date: sinergia.actualizada_en,
      label: "Actualización",
      description: `Última actualización: ${format(
        sinergia.actualizada_en,
        "dd MMM yyyy",
        { locale: es }
      )}`,
      insumo: sinergia.insumo,
      estado: sinergia.estado,
    });
  }

  // 3. RFP events
  if (sinergia.rfp) {
    // RFP Emission
    events.push({
      id: `${sinergia.id}-rfp-emission`,
      sinergiaId: sinergia.id,
      type: "rfp_emission",
      date: sinergia.rfp.fecha_emision,
      label: "RFP Emitida",
      description: `RFP ${sinergia.rfp.rfp_id} emitida`,
      insumo: sinergia.insumo,
      estado: sinergia.estado,
      metadata: {
        rfp_id: sinergia.rfp.rfp_id,
      },
    });

    // RFP Closing
    events.push({
      id: `${sinergia.id}-rfp-closing`,
      sinergiaId: sinergia.id,
      type: "rfp_closing",
      date: sinergia.rfp.fecha_cierre,
      label: "Cierre RFP",
      description: `Cierre de RFP ${sinergia.rfp.rfp_id}`,
      insumo: sinergia.insumo,
      estado: sinergia.estado,
      metadata: {
        rfp_id: sinergia.rfp.rfp_id,
      },
    });

    // RFP Decision (if available)
    if (sinergia.rfp.fecha_decision) {
      events.push({
        id: `${sinergia.id}-rfp-decision`,
        sinergiaId: sinergia.id,
        type: "rfp_decision",
        date: sinergia.rfp.fecha_decision,
        label: "Decisión RFP",
        description: `Evaluación completada para RFP ${sinergia.rfp.rfp_id}`,
        insumo: sinergia.insumo,
        estado: sinergia.estado,
        metadata: {
          rfp_id: sinergia.rfp.rfp_id,
          proveedor: sinergia.rfp.evaluacion?.proveedor_recomendado,
        },
      });
    }
  }

  // 4. Committee decision
  if (sinergia.decision) {
    events.push({
      id: `${sinergia.id}-committee-decision`,
      sinergiaId: sinergia.id,
      type: "committee_decision",
      date: sinergia.decision.decidido_en,
      label: `Decisión: ${sinergia.decision.accion}`,
      description: sinergia.decision.motivo,
      insumo: sinergia.insumo,
      estado: sinergia.estado,
      metadata: {
        accion: sinergia.decision.accion,
        proveedor: sinergia.decision.proveedor_seleccionado,
        monto: sinergia.decision.po_monto_total,
        po_numero: sinergia.decision.po_numero,
      },
    });

    // PO Emission (if closed)
    if (
      sinergia.decision.accion === "cerrar" &&
      sinergia.decision.po_fecha_emision
    ) {
      events.push({
        id: `${sinergia.id}-po-emission`,
        sinergiaId: sinergia.id,
        type: "po_emission",
        date: sinergia.decision.po_fecha_emision,
        label: "PO Emitida",
        description: `PO ${sinergia.decision.po_numero} emitida`,
        insumo: sinergia.insumo,
        estado: sinergia.estado,
        metadata: {
          po_numero: sinergia.decision.po_numero,
          monto: sinergia.decision.po_monto_total,
        },
      });
    }
  }

  // 5. Delivery window start (first day)
  const [ventanaStart] = sinergia.ventana;
  events.push({
    id: `${sinergia.id}-delivery-start`,
    sinergiaId: sinergia.id,
    type: "delivery_window",
    date: ventanaStart,
    label: "Inicio Entrega",
    description: `Inicio de ventana de entrega`,
    insumo: sinergia.insumo,
    estado: sinergia.estado,
  });

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Extract all events from multiple synergies
 */
export function extractAllTimelineEvents(
  sinergias: SinergiaDetectada[]
): TimelineEvent[] {
  const allEvents: TimelineEvent[] = [];
  for (const sinergia of sinergias) {
    allEvents.push(...extractTimelineEvents(sinergia));
  }
  return allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Group events by date for rendering
 */
export function groupEventsByDate(
  events: TimelineEvent[]
): Map<string, TimelineEvent[]> {
  const grouped = new Map<string, TimelineEvent[]>();
  for (const event of events) {
    const dateKey = format(event.date, "yyyy-MM-dd");
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(event);
  }
  return grouped;
}

/**
 * Get event type icon/emoji
 */
export function getEventTypeIcon(type: TimelineEventType): string {
  switch (type) {
    case "detection":
      return "🔍";
    case "rfp_emission":
      return "📤";
    case "rfp_closing":
      return "🔒";
    case "rfp_decision":
      return "✅";
    case "committee_decision":
      return "⚖️";
    case "po_emission":
      return "📋";
    case "update":
      return "🔄";
    case "delivery_window":
      return "📦";
    default:
      return "•";
  }
}

/**
 * Get event type color
 */
export function getEventTypeColor(type: TimelineEventType): string {
  switch (type) {
    case "detection":
      return "var(--color-chart-5)";
    case "rfp_emission":
      return "var(--color-chart-4)";
    case "rfp_closing":
      return "var(--color-chart-3)";
    case "rfp_decision":
      return "var(--color-chart-1)";
    case "committee_decision":
      return "var(--color-primary)";
    case "po_emission":
      return "var(--color-chart-0)";
    case "update":
      return "var(--color-muted-foreground)";
    case "delivery_window":
      return "var(--color-chart-2)";
    default:
      return "var(--color-muted-foreground)";
  }
}
