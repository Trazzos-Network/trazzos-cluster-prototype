// ============================================================================
// INPUTS - Datos cargados por las empresas (S1-S2)
// ============================================================================

import {
  ParadaProgramada,
  ParadaId,
  Criticidad,
  NecesidadMaterial,
  ReqId,
  UnidadMedida,
  Proveedor,
  SinergiaDetectada,
  SinergiaId,
  EstadoSinergia,
  AccionSugerida,
  OfertaId,
  UserId,
  PONumber,
  KPIsCluster,
  TiempoCicloSinergia,
  VistaCalendarioCluster,
  LeaderboardProveedor,
  LogCambio,
  NotificacionPayload,
} from "@/types";

const PARADAS_PROGRAMADAS: ParadaProgramada[] = [
  {
    parada_id: "PAR-ECOP-2026-001" as ParadaId,
    empresa: "Ecopetrol Refinería",
    planta: "Refinería de Cartagena",
    unidad: "FCC (Cracking Catalítico)",
    inicio: new Date("2026-02-15"),
    fin: new Date("2026-03-10"),
    alcance: "Mantenimiento mayor - cambio de catalizador y refractarios",
    criticidad: Criticidad.ALTA,
    ventana_firme: true,
    responsable_email: "paradas.fcc@ecopetrol.com.co",
    ingested_at: new Date("2025-11-15T08:30:00Z"),
    source_file: "ecopetrol_calendario_2026_q1.xlsx",
    validated: true,
  },
  {
    parada_id: "PAR-MONO-2026-001" as ParadaId,
    empresa: "Monómeros Colombo Venezolanos",
    planta: "Planta de Amoniaco",
    unidad: "Reformador Primario",
    inicio: new Date("2026-02-20"),
    fin: new Date("2026-03-15"),
    alcance: "Overhaul completo - tubos reformador y refractarios",
    criticidad: Criticidad.ALTA,
    ventana_firme: true,
    responsable_email: "mantenimiento.amoniaco@monomeros.com",
    ingested_at: new Date("2025-11-18T10:15:00Z"),
    source_file: "monomeros_paradas_2026.csv",
    validated: true,
  },
  {
    parada_id: "PAR-ARGOS-2026-001" as ParadaId,
    empresa: "Argos - Cementos",
    planta: "Planta Cartagena",
    unidad: "Horno Rotatorio 2",
    inicio: new Date("2026-03-01"),
    fin: new Date("2026-03-20"),
    alcance: "Reemplazo de refractarios zona de clinkerización",
    criticidad: Criticidad.MEDIA,
    ventana_firme: false,
    responsable_email: "ops.cartagena@argos.co",
    ingested_at: new Date("2025-11-20T14:45:00Z"),
    source_file: "argos_calendario_cartagena_2026.xlsx",
    validated: true,
  },
  {
    parada_id: "PAR-YARA-2026-001" as ParadaId,
    empresa: "Yara Colombia",
    planta: "Planta de Fertilizantes",
    unidad: "Reactor de Ácido Nítrico",
    inicio: new Date("2026-02-25"),
    fin: new Date("2026-03-18"),
    alcance: "Inspección y reemplazo de platinos catalizadores",
    criticidad: Criticidad.ALTA,
    ventana_firme: true,
    responsable_email: "turnarounds@yara.com",
    ingested_at: new Date("2025-11-22T09:00:00Z"),
    source_file: "yara_shutdown_schedule_2026.csv",
    validated: true,
  },
];

const NECESIDADES_MATERIALES: NecesidadMaterial[] = [
  // Ecopetrol - Refractarios
  {
    req_id: "REQ-ECOP-2026-101" as ReqId,
    empresa: "Ecopetrol Refinería",
    unidad: "FCC (Cracking Catalítico)",
    insumo: "Refractario alto alumina (85%)",
    unidad_medida: UnidadMedida.M3,
    qty: 45.0,
    proveedor_preferente: "Thermal Ceramics Colombia",
    alternos: ["Refratechnik", "RHI Magnesita"],
    lead_time_dias: 60,
    ventana_entrega_ini: new Date("2026-01-10"),
    ventana_entrega_fin: new Date("2026-02-10"),
    parada_id: "PAR-ECOP-2026-001" as ParadaId,
    ingested_at: new Date("2025-11-15T08:30:00Z"),
    validated: true,
  },
  {
    req_id: "REQ-ECOP-2026-102" as ReqId,
    empresa: "Ecopetrol Refinería",
    unidad: "FCC (Cracking Catalítico)",
    insumo: "Catalizador FCC zeolita USY",
    unidad_medida: UnidadMedida.TON,
    qty: 120.0,
    proveedor_preferente: "Grace Catalysts",
    alternos: ["BASF", "Albemarle"],
    lead_time_dias: 90,
    ventana_entrega_ini: new Date("2025-12-15"),
    ventana_entrega_fin: new Date("2026-02-01"),
    parada_id: "PAR-ECOP-2026-001" as ParadaId,
    ingested_at: new Date("2025-11-15T08:30:00Z"),
    validated: true,
  },

  // Monómeros - Refractarios
  {
    req_id: "REQ-MONO-2026-201" as ReqId,
    empresa: "Monómeros Colombo Venezolanos",
    unidad: "Reformador Primario",
    insumo: "Refractario alto alumina (85%)",
    unidad_medida: UnidadMedida.M3,
    qty: 65.0,
    proveedor_preferente: "Thermal Ceramics Colombia",
    alternos: ["Refratechnik", "Vesuvius"],
    lead_time_dias: 60,
    ventana_entrega_ini: new Date("2026-01-15"),
    ventana_entrega_fin: new Date("2026-02-15"),
    parada_id: "PAR-MONO-2026-001" as ParadaId,
    ingested_at: new Date("2025-11-18T10:15:00Z"),
    validated: true,
  },
  {
    req_id: "REQ-MONO-2026-202" as ReqId,
    empresa: "Monómeros Colombo Venezolanos",
    unidad: "Reformador Primario",
    insumo: "Tubos reformador Inconel 625",
    unidad_medida: UnidadMedida.UNIDAD,
    qty: 24.0,
    proveedor_preferente: "Tenaris",
    alternos: ["Vallourec", "Sandvik"],
    lead_time_dias: 120,
    ventana_entrega_ini: new Date("2025-12-01"),
    ventana_entrega_fin: new Date("2026-02-10"),
    parada_id: "PAR-MONO-2026-001" as ParadaId,
    ingested_at: new Date("2025-11-18T10:15:00Z"),
    validated: true,
  },

  // Argos - Refractarios
  {
    req_id: "REQ-ARGOS-2026-301" as ReqId,
    empresa: "Argos - Cementos",
    unidad: "Horno Rotatorio 2",
    insumo: "Refractario alto alumina (85%)",
    unidad_medida: UnidadMedida.M3,
    qty: 38.0,
    proveedor_preferente: null,
    alternos: ["Thermal Ceramics", "Refratechnik", "RHI Magnesita"],
    lead_time_dias: 45,
    ventana_entrega_ini: new Date("2026-01-20"),
    ventana_entrega_fin: new Date("2026-02-25"),
    parada_id: "PAR-ARGOS-2026-001" as ParadaId,
    ingested_at: new Date("2025-11-20T14:45:00Z"),
    validated: true,
  },
  {
    req_id: "REQ-ARGOS-2026-302" as ReqId,
    empresa: "Argos - Cementos",
    unidad: "Horno Rotatorio 2",
    insumo: "Ladrillos refractarios básicos magnesia-cromo",
    unidad_medida: UnidadMedida.TON,
    qty: 15.0,
    proveedor_preferente: "RHI Magnesita",
    alternos: ["Vesuvius"],
    lead_time_dias: 60,
    ventana_entrega_ini: new Date("2026-01-15"),
    ventana_entrega_fin: new Date("2026-02-20"),
    parada_id: "PAR-ARGOS-2026-001" as ParadaId,
    ingested_at: new Date("2025-11-20T14:45:00Z"),
    validated: true,
  },

  // Yara - Platinos
  {
    req_id: "REQ-YARA-2026-401" as ReqId,
    empresa: "Yara Colombia",
    unidad: "Reactor de Ácido Nítrico",
    insumo: "Mallas catalizadoras Pt-Rh (90%-10%)",
    unidad_medida: UnidadMedida.KG,
    qty: 85.0,
    proveedor_preferente: "Johnson Matthey",
    alternos: ["Heraeus", "BASF Precious Metals"],
    lead_time_dias: 90,
    ventana_entrega_ini: new Date("2025-12-20"),
    ventana_entrega_fin: new Date("2026-02-15"),
    parada_id: "PAR-YARA-2026-001" as ParadaId,
    ingested_at: new Date("2025-11-22T09:00:00Z"),
    validated: true,
  },
  {
    req_id: "REQ-YARA-2026-402" as ReqId,
    empresa: "Yara Colombia",
    unidad: "Reactor de Ácido Nítrico",
    insumo: "Refractario alto alumina (85%)",
    unidad_medida: UnidadMedida.M3,
    qty: 32.0,
    proveedor_preferente: "Thermal Ceramics Colombia",
    alternos: ["Refratechnik"],
    lead_time_dias: 50,
    ventana_entrega_ini: new Date("2026-01-25"),
    ventana_entrega_fin: new Date("2026-02-20"),
    parada_id: "PAR-YARA-2026-001" as ParadaId,
    ingested_at: new Date("2025-11-22T09:00:00Z"),
    validated: true,
  },
];

const PROVEEDORES: Proveedor[] = [
  {
    insumo: "Refractario alto alumina (85%)",
    proveedor: "Thermal Ceramics Colombia",
    contacto: "Carlos Mendoza",
    email: "carlos.mendoza@thermalceramics.com.co",
    sla_objetivo: 0.97,
    observaciones: "Proveedor local con inventario en Cartagena",
    entregas_historicas: 47,
    cumplimiento_historico: 0.96,
  },
  {
    insumo: "Refractario alto alumina (85%)",
    proveedor: "Refratechnik",
    contacto: "Hans Schmidt",
    email: "h.schmidt@refratechnik.de",
    sla_objetivo: 0.95,
    observaciones: "Importación desde Alemania - mayor lead time",
    entregas_historicas: 23,
    cumplimiento_historico: 0.94,
  },
  {
    insumo: "Refractario alto alumina (85%)",
    proveedor: "RHI Magnesita",
    contacto: "Patricia Silva",
    email: "patricia.silva@rhimagnesita.com",
    sla_objetivo: 0.96,
    observaciones: "Importación desde Brasil",
    entregas_historicas: 31,
    cumplimiento_historico: 0.95,
  },
  {
    insumo: "Catalizador FCC zeolita USY",
    proveedor: "Grace Catalysts",
    contacto: "Michael Johnson",
    email: "michael.johnson@grace.com",
    sla_objetivo: 0.98,
    observaciones: "Líder mundial en catalizadores FCC",
    entregas_historicas: 15,
    cumplimiento_historico: 0.98,
  },
  {
    insumo: "Mallas catalizadoras Pt-Rh (90%-10%)",
    proveedor: "Johnson Matthey",
    contacto: "David Williams",
    email: "david.williams@matthey.com",
    sla_objetivo: 0.99,
    observaciones: "Especialista en metales preciosos - UK",
    entregas_historicas: 8,
    cumplimiento_historico: 1.0,
  },
];

// ============================================================================
// OUTPUT PRINCIPAL - Sinergia Detectada (S3)
// ============================================================================

const SINERGIA_REFRACTARIOS_2026: SinergiaDetectada = {
  // Identificación
  id: "SNG-2026-02-ALUMINA-85" as SinergiaId,
  mes: "2026-02",
  insumo: "Refractario alto alumina (85%)",

  // Participantes
  empresas: [
    "Ecopetrol Refinería",
    "Monómeros Colombo Venezolanos",
    "Argos - Cementos",
    "Yara Colombia",
  ],
  empresas_involucradas: 4,

  // Volumen y economía
  volumen_total: 180.0, // 45 + 65 + 38 + 32
  unidad_medida: UnidadMedida.M3,
  umbral: 120.0, // Umbral configurado en S3
  ahorro_estimado_pct: 14.5,
  ahorro_estimado_monto: 145800, // USD - basado en precio unitario ~$5,600/m³

  // Temporal
  ventana: [new Date("2026-01-10"), new Date("2026-02-25")],
  ventana_dias: 46,

  // Estado y flujo
  estado: EstadoSinergia.CERRADA,
  accion_sugerida: AccionSugerida.RFP_CONJUNTA,

  // Detalles por empresa
  detalle_empresas: [
    {
      empresa: "Ecopetrol Refinería",
      unidad: "FCC (Cracking Catalítico)",
      qty: 45.0,
      ventana_entrega: [new Date("2026-01-10"), new Date("2026-02-10")],
      criticidad: Criticidad.ALTA,
      req_id: "REQ-ECOP-2026-101" as ReqId,
      parada_id: "PAR-ECOP-2026-001" as ParadaId,
    },
    {
      empresa: "Monómeros Colombo Venezolanos",
      unidad: "Reformador Primario",
      qty: 65.0,
      ventana_entrega: [new Date("2026-01-15"), new Date("2026-02-15")],
      criticidad: Criticidad.ALTA,
      req_id: "REQ-MONO-2026-201" as ReqId,
      parada_id: "PAR-MONO-2026-001" as ParadaId,
    },
    {
      empresa: "Argos - Cementos",
      unidad: "Horno Rotatorio 2",
      qty: 38.0,
      ventana_entrega: [new Date("2026-01-20"), new Date("2026-02-25")],
      criticidad: Criticidad.MEDIA,
      req_id: "REQ-ARGOS-2026-301" as ReqId,
      parada_id: "PAR-ARGOS-2026-001" as ParadaId,
    },
    {
      empresa: "Yara Colombia",
      unidad: "Reactor de Ácido Nítrico",
      qty: 32.0,
      ventana_entrega: [new Date("2026-01-25"), new Date("2026-02-20")],
      criticidad: Criticidad.ALTA,
      req_id: "REQ-YARA-2026-402" as ReqId,
      parada_id: "PAR-YARA-2026-001" as ParadaId,
    },
  ],

  // RFP (completada)
  rfp: {
    rfp_id: "RFP-SNG-2026-02-ALUMINA-85",
    sinergia_id: "SNG-2026-02-ALUMINA-85" as SinergiaId,

    fecha_emision: new Date("2025-11-25T10:00:00Z"),
    fecha_cierre: new Date("2025-12-15T23:59:59Z"),
    fecha_decision: new Date("2025-12-20T15:30:00Z"),

    documento_url:
      "https://drive.google.com/file/d/abc123_RFP_Refractarios_2026",
    anexo_a_url: "https://drive.google.com/file/d/abc124_Anexo_A_Cantidades",
    anexo_b_url: "https://drive.google.com/file/d/abc125_Anexo_B_Criterios",

    proveedores_invitados: [
      "Thermal Ceramics Colombia",
      "Refratechnik",
      "RHI Magnesita",
      "Vesuvius Colombia",
    ],

    ofertas: [
      {
        oferta_id: "OFR-RFP-001-TC" as OfertaId,
        rfp_id: "RFP-SNG-2026-02-ALUMINA-85",
        sinergia_id: "SNG-2026-02-ALUMINA-85" as SinergiaId,

        proveedor: "Thermal Ceramics Colombia",
        contacto: "Carlos Mendoza",
        email: "carlos.mendoza@thermalceramics.com.co",

        precio_unitario: 4850.0,
        moneda: "USD",
        descuento_volumen_pct: 15.0,
        monto_total: 873000.0, // 180 m³ × $4,850

        lead_time_dias: 50,
        sla_propuesto: 0.97,
        validez_oferta_dias: 60,
        condiciones_pago: "50% anticipo, 50% contra entrega",

        especificacion_cumple: true,
        certificaciones: ["ISO 9001:2015", "ISO 14001:2015", "ASTM C401"],
        comentarios: "Incluye certificación HSE y supervisión técnica en sitio",

        scoring: {
          punt_precio: 100.0, // Mejor precio
          punt_lead_time: 92.0,
          punt_sla: 97.0,
          punt_certificaciones: 95.0,

          score_total: 97.4, // (100×0.6) + (92×0.25) + (97×0.15)

          rank: 1,

          ponderadores: {
            peso_precio: 0.6,
            peso_lead: 0.25,
            peso_sla: 0.15,
          },

          calculado_en: new Date("2025-12-16T09:00:00Z"),
        },

        recibida_en: new Date("2025-12-14T16:45:00Z"),
        validada: true,
      },
      {
        oferta_id: "OFR-RFP-001-RHI" as OfertaId,
        rfp_id: "RFP-SNG-2026-02-ALUMINA-85",
        sinergia_id: "SNG-2026-02-ALUMINA-85" as SinergiaId,

        proveedor: "RHI Magnesita",
        contacto: "Patricia Silva",
        email: "patricia.silva@rhimagnesita.com",

        precio_unitario: 5100.0,
        moneda: "USD",
        descuento_volumen_pct: 12.0,
        monto_total: 918000.0,

        lead_time_dias: 55,
        sla_propuesto: 0.96,
        validez_oferta_dias: 45,
        condiciones_pago: "40% anticipo, 60% 30 días fecha factura",

        especificacion_cumple: true,
        certificaciones: ["ISO 9001:2015", "ISO 45001:2018"],
        comentarios: "Importación desde Brasil, incluye flete marítimo",

        scoring: {
          punt_precio: 95.1, // 4850/5100 × 100
          punt_lead_time: 89.1,
          punt_sla: 96.0,

          score_total: 93.8,

          rank: 2,

          ponderadores: {
            peso_precio: 0.6,
            peso_lead: 0.25,
            peso_sla: 0.15,
          },

          calculado_en: new Date("2025-12-16T09:00:00Z"),
        },

        recibida_en: new Date("2025-12-15T11:20:00Z"),
        validada: true,
      },
      {
        oferta_id: "OFR-RFP-001-REF" as OfertaId,
        rfp_id: "RFP-SNG-2026-02-ALUMINA-85",
        sinergia_id: "SNG-2026-02-ALUMINA-85" as SinergiaId,

        proveedor: "Refratechnik",
        contacto: "Hans Schmidt",
        email: "h.schmidt@refratechnik.de",

        precio_unitario: 5350.0,
        moneda: "USD",
        descuento_volumen_pct: 10.0,
        monto_total: 963000.0,

        lead_time_dias: 65,
        sla_propuesto: 0.95,
        validez_oferta_dias: 90,
        condiciones_pago: "30% anticipo, 70% contra BL",

        especificacion_cumple: true,
        certificaciones: ["ISO 9001:2015", "DIN 51063", "ASTM C401"],
        comentarios: "Importación desde Alemania, calidad premium",

        scoring: {
          punt_precio: 90.7,
          punt_lead_time: 75.4,
          punt_sla: 95.0,

          score_total: 87.7,

          rank: 3,

          ponderadores: {
            peso_precio: 0.6,
            peso_lead: 0.25,
            peso_sla: 0.15,
          },

          calculado_en: new Date("2025-12-16T09:00:00Z"),
        },

        recibida_en: new Date("2025-12-15T18:05:00Z"),
        validada: true,
      },
    ],

    evaluacion: {
      rfp_id: "RFP-SNG-2026-02-ALUMINA-85",

      top_ofertas: [
        "OFR-RFP-001-TC" as OfertaId,
        "OFR-RFP-001-RHI" as OfertaId,
        "OFR-RFP-001-REF" as OfertaId,
      ],

      proveedor_recomendado: "Thermal Ceramics Colombia",
      oferta_recomendada_id: "OFR-RFP-001-TC" as OfertaId,
      justificacion: `Thermal Ceramics ofrece el mejor balance precio-calidad con:
          - Mejor precio unitario ($4,850 vs $5,100 y $5,350)
          - Descuento por volumen más agresivo (15%)
          - Lead time competitivo (50 días)
          - Proveedor local con inventario en Cartagena
          - Historial comprobado de cumplimiento (96%)
          - Incluye supervisión técnica en sitio sin costo adicional
          
          Ahorro total vs baseline: $145,800 USD (14.5%)`,

      ahorro_vs_baseline_pct: 14.5,
      ahorro_vs_baseline_monto: 145800,

      evaluado_por: [
        "sourcing.cluster@ecopetrol.com.co" as UserId,
        "compras@monomeros.com" as UserId,
        "procurement@argos.co" as UserId,
      ],
      evaluado_en: new Date("2025-12-18T14:30:00Z"),

      requiere_aprobacion_comite: true,
      aprobado: true,
      aprobado_por: "director.operaciones@cluster-cartagena.com" as UserId,
      aprobado_en: new Date("2025-12-20T15:30:00Z"),
    },

    estado: "completada",
    owner_email: "sourcing.cluster@ecopetrol.com.co",

    creada_en: new Date("2025-11-25T10:00:00Z"),
    actualizada_en: new Date("2025-12-20T15:30:00Z"),
  },

  // Decisión del comité
  decision: {
    sinergia_id: "SNG-2026-02-ALUMINA-85" as SinergiaId,

    accion: "cerrar",

    proveedor_seleccionado: "Thermal Ceramics Colombia",
    oferta_seleccionada_id: "OFR-RFP-001-TC" as OfertaId,
    motivo: "Aprobación unánime del comité de compras del clúster",
    comentarios: `Decisión basada en:
        1. Mejor oferta económica con ahorro del 14.5%
        2. Proveedor local con menor riesgo logístico
        3. Historial comprobado de cumplimiento
        4. Certificaciones técnicas completas
        
        Se procede a emisión de PO conjunta con entrega escalonada:
        - Ecopetrol: 45 m³ - Entrega 10-Feb-2026
        - Monómeros: 65 m³ - Entrega 15-Feb-2026
        - Argos: 38 m³ - Entrega 25-Feb-2026
        - Yara: 32 m³ - Entrega 20-Feb-2026`,

    po_numero: "PO-CLUSTER-2026-001" as PONumber,
    po_monto_total: 873000.0,
    po_fecha_emision: new Date("2025-12-22T10:00:00Z"),
    ahorro_real_pct: 14.5,
    ahorro_real_monto: 145800,

    decidido_por: "director.operaciones@cluster-cartagena.com" as UserId,
    decidido_en: new Date("2025-12-20T15:30:00Z"),

    notificado_a: [
      "paradas.fcc@ecopetrol.com.co",
      "mantenimiento.amoniaco@monomeros.com",
      "ops.cartagena@argos.co",
      "turnarounds@yara.com",
      "carlos.mendoza@thermalceramics.com.co",
    ],
    notificado_en: new Date("2025-12-20T16:00:00Z"),
  },

  // Metadata
  detectada_en: new Date("2025-11-23T03:15:00Z"),
  actualizada_en: new Date("2025-12-22T10:00:00Z"),
  version: 5,
};

// ============================================================================
// OTRA SINERGIA - En proceso (estado EN_RFP)
// ============================================================================

const SINERGIA_CATALIZADOR_FCC: SinergiaDetectada = {
  id: "SNG-2026-01-CAT-FCC" as SinergiaId,
  mes: "2026-01",
  insumo: "Catalizador FCC zeolita USY",

  empresas: ["Ecopetrol Refinería"],
  empresas_involucradas: 1,

  volumen_total: 120.0,
  unidad_medida: UnidadMedida.TON,
  umbral: 100.0,
  ahorro_estimado_pct: 8.0,
  ahorro_estimado_monto: 96000,

  ventana: [new Date("2025-12-15"), new Date("2026-02-01")],
  ventana_dias: 48,

  estado: EstadoSinergia.EN_RFP,
  accion_sugerida: AccionSugerida.RFP_CONJUNTA,

  detalle_empresas: [
    {
      empresa: "Ecopetrol Refinería",
      unidad: "FCC (Cracking Catalítico)",
      qty: 120.0,
      ventana_entrega: [new Date("2025-12-15"), new Date("2026-02-01")],
      criticidad: Criticidad.ALTA,
      req_id: "REQ-ECOP-2026-102" as ReqId,
      parada_id: "PAR-ECOP-2026-001" as ParadaId,
    },
  ],

  rfp: {
    rfp_id: "RFP-SNG-2026-01-CAT-FCC",
    sinergia_id: "SNG-2026-01-CAT-FCC" as SinergiaId,

    fecha_emision: new Date("2025-11-28T09:00:00Z"),
    fecha_cierre: new Date("2025-12-18T23:59:59Z"),
    fecha_decision: undefined,

    documento_url: "https://drive.google.com/file/d/abc126_RFP_Catalizador_FCC",
    anexo_a_url: "https://drive.google.com/file/d/abc127_Anexo_A_Cat",
    anexo_b_url: "https://drive.google.com/file/d/abc128_Anexo_B_Cat",

    proveedores_invitados: ["Grace Catalysts", "BASF Catalysts", "Albemarle"],

    ofertas: [], // Aún no hay ofertas recibidas

    evaluacion: undefined,

    estado: "emitida",
    owner_email: "sourcing.cluster@ecopetrol.com.co",

    creada_en: new Date("2025-11-28T09:00:00Z"),
    actualizada_en: new Date("2025-11-28T09:00:00Z"),
  },

  decision: undefined,

  detectada_en: new Date("2025-11-23T03:15:00Z"),
  actualizada_en: new Date("2025-11-28T09:00:00Z"),
  version: 2,
};

// ============================================================================
// KPIs DEL CLUSTER - Período Nov-Dic 2025
// ============================================================================

const KPI_CLUSTER_2025_12: KPIsCluster = {
  periodo: "2025-12",
  fecha_calculo: new Date("2025-12-31T23:59:59Z"),

  // Cobertura
  cobertura_calendario_pct: 85.0,
  empresas_participantes: 4,
  paradas_totales: 12,
  paradas_cubiertas: 10,

  // Sinergias
  sinergias_detectadas: 7,
  sinergias_activas: 2, // EN_RFP
  sinergias_cerradas: 3,
  tasa_aceptacion_pct: 71.4, // 5/7 llegaron a RFP

  // Económico
  ahorro_estimado_total: 487600,
  ahorro_real_total: 298450,
  ahorro_promedio_por_sinergia_pct: 11.2,
  descuento_promedio_volumen_pct: 13.5,

  // Operativo
  fill_rate_pct: 96.5,
  stockouts_criticos: 2,
  tiempo_promedio_decision_dias: 18,
  tiempo_promedio_ciclo_dias: 32,

  // Calidad
  tasa_errores_ingesta_pct: 0.8,
  rfps_completadas: 3,
  rfps_canceladas: 0,

  // Top 5 insumos
  top_insumos_volumen: [
    {
      insumo: "Refractario alto alumina (85%)",
      sinergias: 2,
      volumen_total: 245.0,
      ahorro_total: 198600,
      ahorro_pct: 14.5,
    },
    {
      insumo: "Catalizador FCC zeolita USY",
      sinergias: 1,
      volumen_total: 120.0,
      ahorro_total: 96000,
      ahorro_pct: 8.0,
    },
    {
      insumo: "Mallas catalizadoras Pt-Rh (90%-10%)",
      sinergias: 1,
      volumen_total: 85.0,
      ahorro_total: 127500,
      ahorro_pct: 7.5,
    },
    {
      insumo: "Tubos reformador Inconel 625",
      sinergias: 1,
      volumen_total: 24.0,
      ahorro_total: 48000,
      ahorro_pct: 10.0,
    },
    {
      insumo: "Ladrillos refractarios básicos magnesia-cromo",
      sinergias: 1,
      volumen_total: 15.0,
      ahorro_total: 17500,
      ahorro_pct: 6.5,
    },
  ],

  top_insumos_ahorro: [
    {
      insumo: "Refractario alto alumina (85%)",
      sinergias: 2,
      volumen_total: 245.0,
      ahorro_total: 198600,
      ahorro_pct: 14.5,
    },
    {
      insumo: "Mallas catalizadoras Pt-Rh (90%-10%)",
      sinergias: 1,
      volumen_total: 85.0,
      ahorro_total: 127500,
      ahorro_pct: 7.5,
    },
    {
      insumo: "Catalizador FCC zeolita USY",
      sinergias: 1,
      volumen_total: 120.0,
      ahorro_total: 96000,
      ahorro_pct: 8.0,
    },
    {
      insumo: "Tubos reformador Inconel 625",
      sinergias: 1,
      volumen_total: 24.0,
      ahorro_total: 48000,
      ahorro_pct: 10.0,
    },
    {
      insumo: "Ladrillos refractarios básicos magnesia-cromo",
      sinergias: 1,
      volumen_total: 15.0,
      ahorro_total: 17500,
      ahorro_pct: 6.5,
    },
  ],
};

// ============================================================================
// TIEMPOS DE CICLO - Sinergia de Refractarios
// ============================================================================

const TIEMPO_CICLO_REFRACTARIOS: TiempoCicloSinergia = {
  sinergia_id: "SNG-2026-02-ALUMINA-85" as SinergiaId,
  insumo: "Refractario alto alumina (85%)",

  // Milestones
  detectada_en: new Date("2025-11-23T03:15:00Z"),
  rfp_emitida_en: new Date("2025-11-25T10:00:00Z"),
  evaluacion_completada_en: new Date("2025-12-18T14:30:00Z"),
  decision_tomada_en: new Date("2025-12-20T15:30:00Z"),
  cerrada_en: new Date("2025-12-22T10:00:00Z"),

  // Tiempos calculados
  dias_deteccion_a_rfp: 2,
  dias_rfp_a_evaluacion: 23,
  dias_evaluacion_a_decision: 2,
  dias_decision_a_cierre: 2,
  dias_ciclo_total: 29,

  // Benchmarks (percentiles del cluster)
  es_rapido: true, // < P25 (32 días)
  es_lento: false, // > P75 (45 días)
};

// ============================================================================
// VISTA CALENDARIO CONSOLIDADO - Febrero 2026
// ============================================================================

const VISTA_CALENDARIO_FEB_2026: VistaCalendarioCluster[] = [
  {
    mes: "2026-02",
    empresa: "Ecopetrol Refinería",
    planta: "Refinería de Cartagena",
    unidad: "FCC (Cracking Catalítico)",

    paradas: [
      {
        parada_id: "PAR-ECOP-2026-001" as ParadaId,
        inicio: new Date("2026-02-15"),
        fin: new Date("2026-03-10"),
        duracion_dias: 24,
        criticidad: Criticidad.ALTA,
      },
    ],

    necesidades_totales: 2,
    insumos_criticos: [
      "Refractario alto alumina (85%)",
      "Catalizador FCC zeolita USY",
    ],

    sinergias_participando: [
      "SNG-2026-02-ALUMINA-85" as SinergiaId,
      "SNG-2026-01-CAT-FCC" as SinergiaId,
    ],

    alertas: [
      {
        tipo: "solape",
        mensaje:
          "Ventana de entrega coincide con Monómeros (15-Feb) y Yara (20-Feb)",
        severidad: "media",
      },
    ],
  },
  {
    mes: "2026-02",
    empresa: "Monómeros Colombo Venezolanos",
    planta: "Planta de Amoniaco",
    unidad: "Reformador Primario",

    paradas: [
      {
        parada_id: "PAR-MONO-2026-001" as ParadaId,
        inicio: new Date("2026-02-20"),
        fin: new Date("2026-03-15"),
        duracion_dias: 24,
        criticidad: Criticidad.ALTA,
      },
    ],

    necesidades_totales: 2,
    insumos_criticos: [
      "Refractario alto alumina (85%)",
      "Tubos reformador Inconel 625",
    ],

    sinergias_participando: ["SNG-2026-02-ALUMINA-85" as SinergiaId],

    alertas: [
      {
        tipo: "lead_time_corto",
        mensaje: "Tubos Inconel requieren 120 días - ventana ajustada",
        severidad: "alta",
      },
      {
        tipo: "proveedor_comun",
        mensaje: "Thermal Ceramics también provee a Ecopetrol, Argos y Yara",
        severidad: "baja",
      },
    ],
  },
  {
    mes: "2026-02",
    empresa: "Argos - Cementos",
    planta: "Planta Cartagena",
    unidad: "Horno Rotatorio 2",

    paradas: [
      {
        parada_id: "PAR-ARGOS-2026-001" as ParadaId,
        inicio: new Date("2026-03-01"),
        fin: new Date("2026-03-20"),
        duracion_dias: 20,
        criticidad: Criticidad.MEDIA,
      },
    ],

    necesidades_totales: 2,
    insumos_criticos: [
      "Refractario alto alumina (85%)",
      "Ladrillos refractarios básicos magnesia-cromo",
    ],

    sinergias_participando: ["SNG-2026-02-ALUMINA-85" as SinergiaId],

    alertas: [],
  },
  {
    mes: "2026-02",
    empresa: "Yara Colombia",
    planta: "Planta de Fertilizantes",
    unidad: "Reactor de Ácido Nítrico",

    paradas: [
      {
        parada_id: "PAR-YARA-2026-001" as ParadaId,
        inicio: new Date("2026-02-25"),
        fin: new Date("2026-03-18"),
        duracion_dias: 22,
        criticidad: Criticidad.ALTA,
      },
    ],

    necesidades_totales: 2,
    insumos_criticos: [
      "Mallas catalizadoras Pt-Rh (90%-10%)",
      "Refractario alto alumina (85%)",
    ],

    sinergias_participando: ["SNG-2026-02-ALUMINA-85" as SinergiaId],

    alertas: [
      {
        tipo: "volumen_alto",
        mensaje:
          "Platino-Rodio (85 kg) - valor crítico, requiere seguro especial",
        severidad: "alta",
      },
    ],
  },
];

// ============================================================================
// LEADERBOARD DE PROVEEDORES - Diciembre 2025
// ============================================================================

const LEADERBOARD_DIC_2025: LeaderboardProveedor[] = [
  {
    proveedor: "Thermal Ceramics Colombia",
    periodo: "2025-12",

    rfps_participadas: 3,
    ofertas_ganadoras: 2,
    tasa_exito_pct: 66.7,

    cumplimiento_promedio: 0.96,
    lead_time_promedio_dias: 48,
    precio_competitivo_rank: 1,

    volumen_total_adjudicado: 245.0,
    monto_total_adjudicado: 1187250,

    certificaciones: ["ISO 9001:2015", "ISO 14001:2015", "ASTM C401"],
    incidentes: 0,

    score_proveedor: 97.4,
    rank_general: 1,
  },
  {
    proveedor: "Johnson Matthey",
    periodo: "2025-12",

    rfps_participadas: 1,
    ofertas_ganadoras: 1,
    tasa_exito_pct: 100.0,

    cumplimiento_promedio: 1.0,
    lead_time_promedio_dias: 85,
    precio_competitivo_rank: 1,

    volumen_total_adjudicado: 85.0,
    monto_total_adjudicado: 1700000,

    certificaciones: ["ISO 9001:2015", "ISO 14001:2015", "IATF 16949"],
    incidentes: 0,

    score_proveedor: 98.5,
    rank_general: 2,
  },
  {
    proveedor: "RHI Magnesita",
    periodo: "2025-12",

    rfps_participadas: 2,
    ofertas_ganadoras: 0,
    tasa_exito_pct: 0.0,

    cumplimiento_promedio: 0.95,
    lead_time_promedio_dias: 55,
    precio_competitivo_rank: 2,

    volumen_total_adjudicado: 0.0,
    monto_total_adjudicado: 0.0,

    certificaciones: ["ISO 9001:2015", "ISO 45001:2018"],
    incidentes: 0,

    score_proveedor: 93.8,
    rank_general: 3,
  },
  {
    proveedor: "Refratechnik",
    periodo: "2025-12",

    rfps_participadas: 2,
    ofertas_ganadoras: 0,
    tasa_exito_pct: 0.0,

    cumplimiento_promedio: 0.94,
    lead_time_promedio_dias: 65,
    precio_competitivo_rank: 3,

    volumen_total_adjudicado: 0.0,
    monto_total_adjudicado: 0.0,

    certificaciones: ["ISO 9001:2015", "DIN 51063", "ASTM C401"],
    incidentes: 1,

    score_proveedor: 87.7,
    rank_general: 4,
  },
];

// ============================================================================
// LOG DE AUDITORÍA - Últimas 5 entradas
// ============================================================================

const LOG_AUDITORIA: LogCambio[] = [
  {
    log_id: "LOG-2025-12-22-001",
    timestamp: new Date("2025-12-22T10:00:00Z"),

    escenario: "S7",
    entidad_tipo: "sinergia",
    entidad_id: "SNG-2026-02-ALUMINA-85",

    accion: "state_change",
    campo_modificado: "estado",
    valor_anterior: EstadoSinergia.APROBADA,
    valor_nuevo: EstadoSinergia.CERRADA,

    actor: "director.operaciones@cluster-cartagena.com" as UserId,
    actor_email: "director.operaciones@cluster-cartagena.com",

    comentario:
      "PO-CLUSTER-2026-001 emitida - $873,000 USD - Ahorro real: 14.5%",
    metadata: {
      po_numero: "PO-CLUSTER-2026-001",
      proveedor: "Thermal Ceramics Colombia",
      monto: 873000,
    },
  },
  {
    log_id: "LOG-2025-12-20-002",
    timestamp: new Date("2025-12-20T15:30:00Z"),

    escenario: "S7",
    entidad_tipo: "decision",
    entidad_id: "DEC-SNG-2026-02-ALUMINA-85",

    accion: "create",

    actor: "director.operaciones@cluster-cartagena.com" as UserId,
    actor_email: "director.operaciones@cluster-cartagena.com",

    comentario: "Comité aprueba oferta de Thermal Ceramics - Rank #1",
    metadata: {
      accion: "aprobar",
      proveedor: "Thermal Ceramics Colombia",
      oferta_id: "OFR-RFP-001-TC",
    },
  },
  {
    log_id: "LOG-2025-12-18-003",
    timestamp: new Date("2025-12-18T14:30:00Z"),

    escenario: "S5",
    entidad_tipo: "rfp",
    entidad_id: "RFP-SNG-2026-02-ALUMINA-85",

    accion: "update",
    campo_modificado: "evaluacion",
    valor_anterior: null,
    valor_nuevo: { proveedor_recomendado: "Thermal Ceramics Colombia" },

    actor: "sourcing.cluster@ecopetrol.com.co" as UserId,
    actor_email: "sourcing.cluster@ecopetrol.com.co",

    comentario: "Evaluación completada - 3 ofertas recibidas y rankeadas",
    metadata: {
      ofertas_evaluadas: 3,
      top_proveedor: "Thermal Ceramics Colombia",
      score: 97.4,
    },
  },
  {
    log_id: "LOG-2025-11-25-004",
    timestamp: new Date("2025-11-25T10:00:00Z"),

    escenario: "S5",
    entidad_tipo: "rfp",
    entidad_id: "RFP-SNG-2026-02-ALUMINA-85",

    accion: "create",

    actor: "sourcing.cluster@ecopetrol.com.co" as UserId,
    actor_email: "sourcing.cluster@ecopetrol.com.co",

    comentario: "RFP emitida - 4 proveedores invitados - Cierre: 15-Dic-2025",
    metadata: {
      sinergia_id: "SNG-2026-02-ALUMINA-85",
      proveedores_invitados: 4,
      fecha_cierre: "2025-12-15",
    },
  },
  {
    log_id: "LOG-2025-11-23-005",
    timestamp: new Date("2025-11-23T03:15:00Z"),

    escenario: "S3",
    entidad_tipo: "sinergia",
    entidad_id: "SNG-2026-02-ALUMINA-85",

    accion: "create",

    actor: "system" as UserId,

    comentario:
      "Sinergia detectada - 4 empresas - 180 m³ - Ahorro estimado: 14.5%",
    metadata: {
      empresas: 4,
      volumen: 180,
      ahorro_estimado_pct: 14.5,
      insumo: "Refractario alto alumina (85%)",
    },
  },
];

// ============================================================================
// NOTIFICACIÓN TEAMS/SLACK - Top 3 disponible
// ============================================================================

const NOTIFICACION_TOP3: NotificacionPayload = {
  tipo: "top3_disponible",
  sinergia_id: "SNG-2026-02-ALUMINA-85" as SinergiaId,

  titulo: "🎯 Top-3 RFP Refractarios - Decisión Requerida",
  mensaje: `**Sinergia:** Refractario alto alúmina (85%) - 180 m³
  **Empresas:** Ecopetrol, Monómeros, Argos, Yara
  
  **Top-3 Ofertas:**
  🥇 Thermal Ceramics - $873,000 | Score: 97.4 | Lead: 50d
  🥈 RHI Magnesita - $918,000 | Score: 93.8 | Lead: 55d
  🥉 Refratechnik - $963,000 | Score: 87.7 | Lead: 65d
  
  **Ahorro estimado:** $145,800 USD (14.5%) vs baseline
  
  Se requiere aprobación del comité para proceder con Thermal Ceramics.`,

  prioridad: "alta",

  url_bi_dashboard:
    "https://metabase.cluster.com/dashboard/rfp-refractarios-2026",
  url_detalle_sinergia:
    "https://metabase.cluster.com/sinergia/SNG-2026-02-ALUMINA-85",
  url_rfp_documento:
    "https://drive.google.com/file/d/abc123_RFP_Refractarios_2026",

  acciones: [
    {
      id: "aprobar_recomendado",
      label: "✅ Aprobar Thermal Ceramics",
      webhook_url: "https://make.com/webhook/accion_comite",
      payload: {
        accion: "aprobar",
        sinergia_id: "SNG-2026-02-ALUMINA-85",
        proveedor: "Thermal Ceramics Colombia",
        oferta_id: "OFR-RFP-001-TC",
        motivo: "Aprobación desde notificación Teams",
      },
    },
    {
      id: "solicitar_contraoferta",
      label: "🔄 Solicitar contraoferta",
      webhook_url: "https://make.com/webhook/accion_comite",
      payload: {
        accion: "contraoferta",
        sinergia_id: "SNG-2026-02-ALUMINA-85",
        proveedor: "RHI Magnesita",
        motivo: "Solicitud de mejora en lead time",
      },
    },
    {
      id: "ver_detalle",
      label: "📊 Ver análisis completo",
      webhook_url:
        "https://metabase.cluster.com/sinergia/SNG-2026-02-ALUMINA-85",
      payload: {},
    },
  ],

  canal: "Paradas-Cluster",
  menciones: ["@director.operaciones", "@sourcing.team"],

  timestamp: new Date("2025-12-18T15:00:00Z"),
  enviado: true,
  enviado_en: new Date("2025-12-18T15:00:30Z"),
};

// ============================================================================
// EXPORTAR TODO PARA USO
// ============================================================================

export const SAMPLE_OUTPUT = {
  // Inputs
  paradas: PARADAS_PROGRAMADAS,
  necesidades: NECESIDADES_MATERIALES,
  proveedores: PROVEEDORES,

  // Core Outputs
  sinergias: [SINERGIA_REFRACTARIOS_2026, SINERGIA_CATALIZADOR_FCC],

  // Analytics
  kpis: KPI_CLUSTER_2025_12,
  tiempos_ciclo: [TIEMPO_CICLO_REFRACTARIOS],
  vista_calendario: VISTA_CALENDARIO_FEB_2026,
  leaderboard: LEADERBOARD_DIC_2025,

  // Audit
  log_auditoria: LOG_AUDITORIA,

  // Notifications
  notificaciones: [NOTIFICACION_TOP3],
};

// ============================================================================
// RESUMEN EJECUTIVO
// ============================================================================

console.log(`
  ╔════════════════════════════════════════════════════════════════╗
  ║     CLÚSTER PETROQUÍMICO CARTAGENA - OUTPUT SAMPLE             ║
  ║                  Período: Q1 2026                              ║
  ╚════════════════════════════════════════════════════════════════╝
  
  📊 EMPRESAS PARTICIPANTES
  - Ecopetrol Refinería
  - Monómeros Colombo Venezolanos  
  - Argos - Cementos
  - Yara Colombia
  
  🔧 PARADAS PROGRAMADAS: 4
  ├─ Criticidad Alta: 3
  └─ Criticidad Media: 1
  
  📦 NECESIDADES MATERIALES: 8
  ├─ Refractarios: 4 (180 m³)
  ├─ Catalizadores: 2 (120 ton + 85 kg Pt-Rh)
  └─ Tubería especializada: 1 (24 unidades)
  
  💡 SINERGIAS DETECTADAS: 2
  
  ┌─ SINERGIA #1: Refractario Alto Alúmina
  │  • ID: SNG-2026-02-ALUMINA-85
  │  • Estado: CERRADA ✅
  │  • Empresas: 4
  │  • Volumen: 180 m³
  │  • Ahorro: $145,800 USD (14.5%)
  │  • Proveedor: Thermal Ceramics Colombia
  │  • PO: PO-CLUSTER-2026-001
  │  • Ciclo: 29 días (detección → cierre)
  │
  └─ SINERGIA #2: Catalizador FCC
     • ID: SNG-2026-01-CAT-FCC
     • Estado: EN_RFP 🔄
     • Empresas: 1 (Ecopetrol)
     • Volumen: 120 ton
     • Ahorro estimado: $96,000 USD (8%)
     • RFP cierra: 18-Dic-2025
  
  💰 IMPACTO ECONÓMICO (Dic 2025)
  ├─ Ahorro estimado total: $487,600
  ├─ Ahorro real consolidado: $298,450
  ├─ Descuento promedio por volumen: 13.5%
  └─ Fill rate: 96.5%
  
  📈 KPIs OPERATIVOS
  ├─ Cobertura calendario: 85%
  ├─ Sinergias activas: 2
  ├─ Sinergias cerradas: 3
  ├─ Tasa aceptación: 71.4%
  ├─ Tiempo promedio decisión: 18 días
  └─ Tiempo promedio ciclo: 32 días
  
  🏆 LEADERBOARD PROVEEDORES
  1. Thermal Ceramics (Score: 97.4) - $1,187,250 adjudicado
  2. Johnson Matthey (Score: 98.5) - $1,700,000 adjudicado
  3. RHI Magnesita (Score: 93.8) - Sin adjudicaciones
  4. Refratechnik (Score: 87.7) - Sin adjudicaciones
  
  ✅ PRÓXIMOS HITOS
  - 18-Dic: Cierre RFP Catalizador FCC
  - 10-Feb-2026: Primera entrega refractarios (Ecopetrol)
  - 15-Feb-2026: Entrega Monómeros
  - 25-Feb-2026: Entrega Argos
  - 20-Feb-2026: Entrega Yara
  `);
