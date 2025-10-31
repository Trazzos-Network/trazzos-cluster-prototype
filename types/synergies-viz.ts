import { SinergiaDetectada, EstadoSinergia, Criticidad } from "./models";

// ============================================================================
// GRAPH VISUALIZATION TYPES
// ============================================================================

export type NodeType = "company" | "synergy" | "material";

export interface BaseNode {
  id: string;
  type: NodeType;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface CompanyNode extends BaseNode {
  type: "company";
  name: string;
  sinergias_count: number;
  total_ahorro: number;
  total_volumen: number;
  color: string;
}

export interface SynergyNode extends BaseNode {
  type: "synergy";
  data: SinergiaDetectada;
  radius: number;
}

export interface MaterialNode extends BaseNode {
  type: "material";
  category: string;
  icon: string;
  color: string;
}

export type GraphNode = CompanyNode | SynergyNode | MaterialNode;

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: "company-synergy" | "synergy-material";
  value: number; // Volume or weight
  label?: string;
  criticidad?: Criticidad;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ============================================================================
// TIMELINE VIEW TYPES
// ============================================================================

export interface TimelineBlock {
  id: string;
  sinergiaId: string;
  empresa: string;
  insumo: string;
  start: Date;
  end: Date;
  volumen: number;
  unidad: string;
  estado: EstadoSinergia;
  criticidad: Criticidad;
  ahorro?: number;
}

export interface OverlapIndicator {
  id: string;
  date: Date;
  empresas: string[];
  sinergias: string[];
  totalVolumen: number;
  totalAhorro: number;
}

export interface SwimLane {
  empresa: string;
  blocks: TimelineBlock[];
  color: string;
}

// ============================================================================
// INTERACTION STATE
// ============================================================================

export interface SelectionState {
  selectedNodes: Set<string>;
  hoveredNode: string | null;
  focusedNode: string | null;
}

export interface FilterState {
  estados: EstadoSinergia[];
  empresas: string[];
  criticidades: Criticidad[];
  dateRange: [Date | null, Date | null];
  searchQuery: string;
}

export interface ViewState {
  mode: "graph" | "timeline" | "matrix";
  sidebarOpen: boolean;
  detailPanelOpen: boolean;
  selectedSynergy: string | null;
}

// ============================================================================
// ANIMATION CONFIG
// ============================================================================

export interface AnimationConfig {
  enableParticles: boolean;
  enablePulse: boolean;
  enableTransitions: boolean;
  particleSpeed: number;
  reducedMotion: boolean;
}

// ============================================================================
// LAYOUT CONFIG
// ============================================================================

export interface ForceSimulationConfig {
  linkDistance: number;
  linkStrength: number;
  chargeStrength: number;
  collisionRadius: number;
  centerStrength: number;
  alphaDecay: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface Dimensions {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// ============================================================================
// COLORS & THEMES
// ============================================================================

// CSS variable references for SVG (use Tailwind's color variable format)
export const ESTADO_COLORS: Record<EstadoSinergia, string> = {
  pendiente: "var(--color-primary)",
  en_rfp: "var(--color-primary)",
  recomendada: "var(--color-primary)",
  aprobada: "var(--color-primary)",
  contraoferta: "var(--color-primary)",
  cerrada: "var(--color-primary)",
  rechazada: "var(--color-destructive)",
};

export const CRITICIDAD_COLORS: Record<Criticidad, string> = {
  Alta: "var(--color-destructive)",
  Media: "var(--color-chart-2)",
  Baja: "var(--color-chart-3)",
};

// CSS variable references for companies (for SVG fill/stroke)
export const COMPANY_COLORS: Record<string, string> = {
  "Ecopetrol Refinería": "var(--color-primary)",
  "Monómeros Colombo Venezolanos": "var(--color-primary)",
  "Argos - Cementos": "var(--color-primary)",
  "Yara Colombia": "var(--color-primary)",
};

export const MATERIAL_COLORS: Record<string, string> = {
  refractario: "var(--color-destructive)",
  catalizador: "var(--color-chart-5)",
  tubo: "var(--color-chart-1)",
  platino: "var(--color-chart-2)",
  ladrillo: "var(--color-chart-4)",
  default: "var(--color-muted-foreground)",
};
