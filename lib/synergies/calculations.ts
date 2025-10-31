import { SinergiaDetectada } from "@/types/models";
import {
  GraphData,
  GraphNode,
  GraphEdge,
  CompanyNode,
  SynergyNode,
  MaterialNode,
  COMPANY_COLORS,
  MATERIAL_COLORS,
} from "@/types/synergies-viz";

// ============================================================================
// GRAPH DATA TRANSFORMATION
// ============================================================================

export function transformToGraphData(
  sinergias: SinergiaDetectada[]
): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const companyMap = new Map<string, CompanyNode>();
  const materialMap = new Map<string, MaterialNode>();

  // Process each synergy
  sinergias.forEach((sinergia) => {
    // Create synergy node
    const synergyNode: SynergyNode = {
      id: sinergia.id,
      type: "synergy",
      data: sinergia,
      radius: 40 + sinergia.empresas_involucradas * 5,
    };
    nodes.push(synergyNode);

    // Extract material category
    const materialCategory = extractMaterialCategory(sinergia.insumo);
    const materialId = `material-${materialCategory}`;

    // Create or update material node
    if (!materialMap.has(materialId)) {
      const materialNode: MaterialNode = {
        id: materialId,
        type: "material",
        category: materialCategory,
        icon: getMaterialIcon(sinergia.insumo),
        color: getMaterialColor(materialCategory),
      };
      materialMap.set(materialId, materialNode);
    }

    // Create edge: synergy -> material
    edges.push({
      id: `${sinergia.id}-${materialId}`,
      source: sinergia.id,
      target: materialId,
      type: "synergy-material",
      value: 1,
    });

    // Process companies
    sinergia.detalle_empresas.forEach((detalle) => {
      const companyId = `company-${slugify(detalle.empresa)}`;

      // Create or update company node
      if (!companyMap.has(companyId)) {
        const companyNode: CompanyNode = {
          id: companyId,
          type: "company",
          name: detalle.empresa,
          sinergias_count: 0,
          total_ahorro: 0,
          total_volumen: 0,
          color: COMPANY_COLORS[detalle.empresa] || "#6b7280",
        };
        companyMap.set(companyId, companyNode);
      }

      // Update company stats
      const companyNode = companyMap.get(companyId)!;
      companyNode.sinergias_count++;
      companyNode.total_ahorro +=
        (sinergia.ahorro_estimado_monto || 0) / sinergia.empresas_involucradas;
      companyNode.total_volumen += detalle.qty;

      // Create edge: company -> synergy
      edges.push({
        id: `${companyId}-${sinergia.id}`,
        source: companyId,
        target: sinergia.id,
        type: "company-synergy",
        value: detalle.qty,
        label: `${detalle.qty} ${sinergia.unidad_medida}`,
        criticidad: detalle.criticidad,
      });
    });
  });

  // Add all nodes
  nodes.push(...Array.from(companyMap.values()));
  nodes.push(...Array.from(materialMap.values()));

  return { nodes, edges };
}

// ============================================================================
// MATERIAL HELPERS
// ============================================================================

function extractMaterialCategory(insumo: string): string {
  const lower = insumo.toLowerCase();
  if (lower.includes("refractario")) return "refractario";
  if (lower.includes("catalizador")) return "catalizador";
  if (lower.includes("tubo")) return "tubo";
  if (lower.includes("platino") || lower.includes("pt-rh")) return "platino";
  if (lower.includes("ladrillo")) return "ladrillo";
  return "otro";
}

export function getMaterialIcon(insumo: string): string {
  const lower = insumo.toLowerCase();
  if (lower.includes("refractario")) return "🔥";
  if (lower.includes("catalizador")) return "⚗️";
  if (lower.includes("tubo")) return "🔧";
  if (lower.includes("platino") || lower.includes("pt-rh")) return "💎";
  if (lower.includes("ladrillo")) return "🧱";
  return "📦";
}

function getMaterialColor(category: string): string {
  return MATERIAL_COLORS[category] || MATERIAL_COLORS.default;
}

// ============================================================================
// CALCULATIONS
// ============================================================================

export function calculateOverlapPeriod(
  ventana1: [Date, Date],
  ventana2: [Date, Date]
): number {
  const start = Math.max(ventana1[0].getTime(), ventana2[0].getTime());
  const end = Math.min(ventana1[1].getTime(), ventana2[1].getTime());
  const days = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  return days;
}

export function isDateInRange(
  date: Date,
  range: [Date | null, Date | null]
): boolean {
  const [start, end] = range;
  if (!start && !end) return true;
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

export function calculateRFPProgress(rfp: {
  fecha_emision: Date;
  fecha_cierre: Date;
}): number {
  const now = new Date();
  const total = rfp.fecha_cierre.getTime() - rfp.fecha_emision.getTime();
  const elapsed = now.getTime() - rfp.fecha_emision.getTime();
  return Math.min(Math.max(elapsed / total, 0), 1);
}

export function isNewSynergy(
  detectada_en: Date,
  thresholdHours: number = 24
): boolean {
  const now = new Date();
  const diff = now.getTime() - detectada_en.getTime();
  return diff < thresholdHours * 60 * 60 * 1000;
}

// ============================================================================
// FORMATTING
// ============================================================================

export function formatCurrency(amount: number | undefined): string {
  if (!amount) return "$0";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-CO").format(num);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}

// ============================================================================
// UTILITIES
// ============================================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createHexagonPath(radius: number): string {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${radius * Math.cos(angle)},${radius * Math.sin(angle)}`;
  });
  return `M ${points.join(" L ")} Z`;
}

export function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#ffffff";
}
