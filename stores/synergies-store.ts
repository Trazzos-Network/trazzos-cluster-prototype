import { create } from "zustand";
import { COMPREHENSIVE_SAMPLE_2026_H1 } from "@/data/sample_data_extended";
import {
  SinergiaDetectada,
  EstadoSinergia,
  RFPConjunta,
  DecisionComite,
  PONumber,
  EvaluacionRFP,
} from "@/types/models";

interface PO {
  po_numero: PONumber;
  sinergia_id: string;
  insumo: string;
  proveedor: string;
  monto_total: number;
  moneda: string;
  fecha_emision: Date;
  empresas: string[];
  transaction_hash?: string;
  block_number?: number;
  status: "pending" | "confirmed" | "failed";
}

interface SynergiesStore {
  // State
  sinergias: SinergiaDetectada[];
  rfps: RFPConjunta[];
  decisiones: DecisionComite[];
  pos: PO[];

  // Actions
  initialize: () => void;
  updateSynergyState: (
    synergyId: string,
    newState: EstadoSinergia,
    updates?: Partial<SinergiaDetectada>
  ) => void;
  updateRFP: (rfpId: string, updates: Partial<RFPConjunta>) => void;
  addDecision: (decision: DecisionComite) => void;
  addPO: (po: PO) => void;
  updateRFPEvaluation: (
    rfpId: string,
    evaluation: EvaluacionRFP
  ) => void;
  approveRFP: (
    rfpId: string,
    po: PO,
    decision: DecisionComite
  ) => void;
  rejectRFP: (
    rfpId: string,
    decision: DecisionComite
  ) => void;

  // Selectors
  getSynergyById: (id: string) => SinergiaDetectada | undefined;
  getRFPBySynergyId: (synergyId: string) => RFPConjunta | undefined;
  getRFPById: (rfpId: string) => RFPConjunta | undefined;
  getPendingRFPs: () => RFPConjunta[];
  getSynergiesByState: (state: EstadoSinergia) => SinergiaDetectada[];
}

export const useSynergiesStore = create<SynergiesStore>((set, get) => ({
  // Initial state
  sinergias: [],
  rfps: [],
  decisiones: [],
  pos: [],

  // Initialize from sample data
  initialize: () => {
    const allRFPs = ("rfps" in COMPREHENSIVE_SAMPLE_2026_H1 ? COMPREHENSIVE_SAMPLE_2026_H1.rfps : []) as RFPConjunta[];
    const allSynergies = COMPREHENSIVE_SAMPLE_2026_H1.sinergias || [];
    const allDecisions = ("decisiones" in COMPREHENSIVE_SAMPLE_2026_H1 ? COMPREHENSIVE_SAMPLE_2026_H1.decisiones : []) as DecisionComite[];

    // Link RFPs to synergies
    const synergiesWithRFP = allSynergies.map((synergy) => {
      const rfp = allRFPs.find((r: RFPConjunta) => r.sinergia_id === synergy.id);
      return rfp ? { ...synergy, rfp } : synergy;
    });

    // Load existing POs from decisions
    const existingPOs: PO[] = [];
    allDecisions.forEach((decision: DecisionComite) => {
      if (
        (decision.accion === "aprobar" || decision.accion === "cerrar") &&
        decision.po_numero
      ) {
        const synergy = synergiesWithRFP.find(
          (s) => s.id === decision.sinergia_id
        );
        if (synergy) {
          existingPOs.push({
            po_numero: decision.po_numero,
            sinergia_id: decision.sinergia_id,
            insumo: synergy.insumo,
            proveedor: decision.proveedor_seleccionado || "N/A",
            monto_total: decision.po_monto_total || 0,
            moneda: "USD",
            fecha_emision: decision.po_fecha_emision || decision.decidido_en,
            empresas: synergy.empresas,
            transaction_hash: generateHash(decision.po_numero),
            block_number: generateBlockNumber(),
            status: "confirmed",
          });
        }
      }
    });

    set({
      sinergias: synergiesWithRFP,
      rfps: allRFPs,
      decisiones: allDecisions,
      pos: existingPOs,
    });
  },

  // Update synergy state
  updateSynergyState: (synergyId, newState, updates = {}) => {
    set((state) => ({
      sinergias: state.sinergias.map((s) =>
        s.id === synergyId
          ? {
              ...s,
              estado: newState,
              actualizada_en: new Date(),
              ...updates,
            }
          : s
      ),
    }));
  },

  // Update RFP
  updateRFP: (rfpId, updates) => {
    set((state) => ({
      rfps: state.rfps.map((rfp) =>
        rfp.rfp_id === rfpId
          ? { ...rfp, ...updates, actualizada_en: new Date() }
          : rfp
      ),
      // Also update RFP in synergies
      sinergias: state.sinergias.map((synergy) =>
        synergy.rfp?.rfp_id === rfpId
          ? {
              ...synergy,
              rfp: { ...synergy.rfp, ...updates, actualizada_en: new Date() },
            }
          : synergy
      ),
    }));
  },

  // Add decision
  addDecision: (decision) => {
    set((state) => ({
      decisiones: [...state.decisiones, decision],
    }));
  },

  // Add PO
  addPO: (po) => {
    set((state) => ({
      pos: [...state.pos, po],
    }));
  },

  // Update RFP evaluation
  updateRFPEvaluation: (rfpId, evaluation) => {
    const { updateRFP } = get();
    updateRFP(rfpId, { evaluacion: evaluation });
  },

  // Approve RFP and create PO
  approveRFP: (rfpId, po, decision) => {
    const state = get();
    const rfp = state.getRFPById(rfpId);
    if (!rfp) return;

    // Add PO
    state.addPO(po);

    // Add decision
    state.addDecision(decision);

    // Update RFP state
    state.updateRFP(rfpId, {
      evaluacion: rfp.evaluacion
        ? {
            ...rfp.evaluacion,
            aprobado: true,
            aprobado_por: decision.decidido_por,
            aprobado_en: decision.decidido_en,
          }
        : undefined,
      estado: "completada",
      fecha_decision: decision.decidido_en,
    });

    // Update synergy state to CERRADA
    state.updateSynergyState(rfp.sinergia_id, EstadoSinergia.CERRADA, {
      decision,
    });
  },

  // Reject RFP
  rejectRFP: (rfpId, decision) => {
    const state = get();
    const rfp = state.getRFPById(rfpId);
    if (!rfp) return;

    // Add decision
    state.addDecision(decision);

    // Update RFP state
    state.updateRFP(rfpId, {
      evaluacion: rfp.evaluacion
        ? {
            ...rfp.evaluacion,
            aprobado: false,
          }
        : undefined,
      estado: "cancelada",
    });

    // Update synergy state to RECHAZADA
    state.updateSynergyState(rfp.sinergia_id, EstadoSinergia.RECHAZADA, {
      decision,
    });
  },

  // Selectors
  getSynergyById: (id) => {
    return get().sinergias.find((s) => s.id === id);
  },

  getRFPBySynergyId: (synergyId) => {
    return get().rfps.find((r) => r.sinergia_id === synergyId);
  },

  getRFPById: (rfpId) => {
    return get().rfps.find((r) => r.rfp_id === rfpId);
  },

  getPendingRFPs: () => {
    return get().rfps.filter(
      (rfp) =>
        rfp.evaluacion &&
        rfp.evaluacion.requiere_aprobacion_comite &&
        rfp.evaluacion.aprobado === undefined
    );
  },

  getSynergiesByState: (state) => {
    return get().sinergias.filter((s) => s.estado === state);
  },
}));

// Helper functions
function generateHash(poNum: string): string {
  return `0x${poNum
    .replace(/[^0-9A-Z]/g, "")
    .padEnd(64, "0")
    .slice(0, 64)}`;
}

function generateBlockNumber(): number {
  return Math.floor(Math.random() * 10000000) + 18000000;
}
