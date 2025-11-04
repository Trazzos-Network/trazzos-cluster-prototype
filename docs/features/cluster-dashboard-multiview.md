# Cluster Dashboard - Sistema Multiview

## Overview

El Dashboard Multiview del Clúster Petroquímico Cartagena es una interfaz completa para la visualización y gestión de sinergias de procurement entre empresas del sector petroquímico. Este sistema permite visualizar en tiempo real las oportunidades de compras conjuntas, track de RFPs, desempeño de proveedores y KPIs operativos.

## Business Value

El dashboard proporciona:

- **Visualización consolidada** de datos de 4 empresas participantes
- **Detección de sinergias** que generan ahorros promedio del 11.2%
- **Tracking end-to-end** desde paradas programadas hasta PO cerradas
- **Transparencia total** en procesos de RFP y selección de proveedores
- **KPIs en tiempo real** para toma de decisiones informada

## User Stories

- Como **Plant Manager**, quiero ver las paradas programadas del clúster para coordinar mi mantenimiento
- Como **Sourcing Manager**, quiero visualizar sinergias detectadas para evaluar oportunidades de ahorro
- Como **Procurement Director**, quiero monitorear RFPs activas y su progreso
- Como **Supply Chain Lead**, quiero evaluar el desempeño histórico de proveedores
- Como **CFO**, quiero ver los ahorros consolidados y KPIs financieros del clúster

## Technical Implementation

### Architecture

El dashboard utiliza:

1. **Datos estáticos** de sample_data.ts (fase prototipo)
2. **Client Component** para interactividad
3. **Tabs Component** de shadcn/ui para multiview
4. **Type Safety** completo con tipos del modelo de datos

#### File Structure

```
app/(dashboard)/home/
└── page.tsx              # Dashboard principal multiview

data/
└── sample_data.ts        # Datos de ejemplo del clúster

types/
└── models.ts             # Tipos TypeScript del dominio
```

### Data Model

El dashboard consume los siguientes tipos de datos:

```typescript
// Paradas programadas
interface ParadaProgramada {
  parada_id: ParadaId;
  empresa: string;
  planta: string;
  unidad: string;
  inicio: Date;
  fin: Date;
  criticidad: Criticidad;
  ventana_firme: boolean;
}

// Sinergias detectadas
interface SinergiaDetectada {
  id: SinergiaId;
  insumo: string;
  empresas: string[];
  volumen_total: number;
  ahorro_estimado_pct: number;
  estado: EstadoSinergia;
  rfp?: RFPData;
  decision?: DecisionData;
}

// KPIs del clúster
interface KPIsCluster {
  periodo: string;
  ahorro_real_total: number;
  sinergias_detectadas: number;
  fill_rate_pct: number;
  cobertura_calendario_pct: number;
  // ... más métricas
}
```

## Views del Dashboard

### 1. Overview (KPI Cards)

**Purpose**: Vista rápida de métricas clave del clúster

**Métricas Mostradas**:

- **Ahorro Consolidado**: Total de ahorros reales vs. baseline
- **Sinergias Detectadas**: Contador con desglose activas/cerradas
- **Empresas Participantes**: Cobertura del clúster
- **Fill Rate**: Tasa de cumplimiento de entregas

**Features**:

- Iconografía descriptiva (lucide-react)
- Formato de moneda abreviado ($298K)
- Indicadores de tendencia
- Colores semánticos (verde para ahorros)

**Implementation**:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Ahorro Consolidado</CardTitle>
    <DollarSign className="h-4 w-4" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">
      ${(kpis.ahorro_real_total / 1000).toFixed(0)}K
    </div>
    <p className="text-xs text-muted-foreground">
      {kpis.ahorro_promedio_por_sinergia_pct}% promedio
    </p>
  </CardContent>
</Card>
```

---

### 2. Sinergias Tab

**Purpose**: Visualizar oportunidades de compra conjunta detectadas

**Sections**:

#### Sinergias Activas

- Lista de RFPs en proceso de evaluación
- Estado: `EN_RFP`
- Información: empresas involucradas, volumen, ahorro estimado
- Badge con estado de proceso

#### Sinergias Cerradas

- Adjudicaciones completadas
- Estado: `CERRADA`
- Información: proveedor seleccionado, PO number, ahorro real
- Indicador visual de cierre exitoso

#### Detalle por Empresa

- Participación individual en sinergias
- Cantidades por empresa y unidad
- Badge de criticidad (Alta/Media)
- Vista de responsabilidades

**Features**:

- Grid responsivo 2 columnas
- Color coding por criticidad
- Formato de ahorros con badge verde
- Información estructurada por empresa

**Data Sources**:

```typescript
const sinergiasCerradas = sinergias.filter(
  (s) => s.estado === EstadoSinergia.CERRADA
);
const sinergiasActivas = sinergias.filter(
  (s) => s.estado === EstadoSinergia.EN_RFP
);
```

---

### 3. Calendario Tab

**Purpose**: Vista temporal de paradas programadas del clúster

**Features**:

- Lista cronológica de paradas Q1 2026
- Información por parada:
  - Empresa, planta y unidad
  - Fechas de inicio y fin
  - Alcance del mantenimiento
  - Criticidad (badge)
  - Ventana firme (badge outline)
- Iconos de calendario en fechas
- Formato de fechas localizado (es-ES)

**Data Structure**:

```typescript
{
  parada_id: "PAR-ECOP-2026-001",
  empresa: "Ecopetrol Refinería",
  planta: "Refinería de Cartagena",
  unidad: "FCC (Cracking Catalítico)",
  inicio: new Date("2026-02-15"),
  fin: new Date("2026-03-10"),
  alcance: "Mantenimiento mayor - cambio de catalizador",
  criticidad: Criticidad.ALTA,
  ventana_firme: true
}
```

**Visual Elements**:

- Color coding por criticidad
- Grid 2 columnas para fechas
- Border para separación visual
- Hover effects

---

### 4. RFPs Tab

**Purpose**: Tracking completo de procesos de RFP conjuntas

**Sections**:

#### Timeline del RFP

- Fecha de emisión
- Fecha de cierre
- Fecha de decisión
- Grid 3 columnas

#### Ofertas Recibidas

- Ranking visual con emojis (🏆 🥈 🥉)
- Información por oferta:
  - Proveedor
  - Score total
  - Precio unitario
  - Lead time
  - SLA propuesto
  - Comentarios adicionales
- **Winner highlight**: Border verde + background para rank #1

**Scoring Display**:

```typescript
<Badge>Score: {oferta.scoring?.score_total}</Badge>
```

**Features**:

- Visual hierarchy clara
- Información estructurada
- Fácil comparación entre ofertas
- Destaque del ganador

**Data Structure**:

```typescript
{
  oferta_id: "OFR-RFP-001-TC",
  proveedor: "Thermal Ceramics Colombia",
  precio_unitario: 4850.0,
  lead_time_dias: 50,
  sla_propuesto: 0.97,
  scoring: {
    score_total: 97.4,
    rank: 1
  }
}
```

---

### 5. Proveedores Tab

**Purpose**: Leaderboard y evaluación de desempeño de proveedores

**Metrics per Supplier**:

- Rank general (#1, #2, #3...)
- Score de proveedor
- Tasa de éxito (% RFPs ganadas)
- Monto total adjudicado
- Ofertas ganadoras / Total participadas
- Cumplimiento promedio
- Lead time promedio
- Número de incidentes

**Visual Elements**:

- Rank number destacado
- Monto en verde (ahorros generados)
- Grid 3 columnas para métricas detalladas
- Información jerárquica clara

**Data Structure**:

```typescript
{
  proveedor: "Thermal Ceramics Colombia",
  rank_general: 1,
  score_proveedor: 97.4,
  tasa_exito_pct: 66.7,
  monto_total_adjudicado: 1187250,
  ofertas_ganadoras: 2,
  rfps_participadas: 3,
  cumplimiento_promedio: 0.96,
  lead_time_promedio_dias: 48,
  incidentes: 0
}
```

---

### 6. KPIs Tab

**Purpose**: Métricas detalladas del desempeño del clúster

**Sections**:

#### Métricas Económicas

- Ahorro estimado total
- Ahorro real total
- Descuento promedio por volumen
- Ahorro promedio por sinergia

#### Métricas Operativas

- Cobertura de calendario
- Tasa de aceptación
- Tiempo promedio de decisión
- Tiempo promedio de ciclo

#### Top Insumos por Ahorro

- Lista de top 5 insumos
- Volumen total y número de sinergias
- Ahorro total generado
- Porcentaje de ahorro

**Features**:

- Grid responsivo 2 columnas para métricas
- Formato consistente (key-value pairs)
- Color verde para ahorros positivos
- Información consolidada y fácil de leer

**Período de Análisis**:

```typescript
periodo: "2025-12"; // Diciembre 2025
```

---

## Component Structure

### Main Component

```typescript
"use client";

export default function HomePage() {
  // Data loading
  const kpis = SAMPLE_OUTPUT.kpis;
  const sinergias = SAMPLE_OUTPUT.sinergias;
  const leaderboard = SAMPLE_OUTPUT.leaderboard;

  // Computed values
  const sinergiasCerradas = sinergias.filter(...);
  const sinergiasActivas = sinergias.filter(...);

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* KPI Cards */}
      {/* Tabs with 5 views */}
    </div>
  );
}
```

### Icons Used

```typescript
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  Package,
  CheckCircle,
  Clock,
} from "lucide-react";
```

---

## Usage Examples

### Navigating Between Views

```typescript
// Default view: Sinergias
<Tabs defaultValue="sinergias">
  <TabsList>
    <TabsTrigger value="sinergias">Sinergias</TabsTrigger>
    <TabsTrigger value="calendario">Calendario</TabsTrigger>
    {/* ... */}
  </TabsList>
</Tabs>
```

### Filtering by Estado

```typescript
// Get only active synergies
const sinergiasActivas = sinergias.filter(
  (s) => s.estado === EstadoSinergia.EN_RFP
);

// Get only closed synergies
const sinergiasCerradas = sinergias.filter(
  (s) => s.estado === EstadoSinergia.CERRADA
);
```

### Date Formatting

```typescript
// Spanish locale for dates
{
  new Date(parada.inicio).toLocaleDateString("es-ES");
}
// Output: "15/2/2026"
```

---

## Dependencies

### External Dependencies

- **lucide-react**: Iconografía
- **shadcn/ui**: Tabs, Cards, Badges
- **React**: Client component functionality

### Internal Dependencies

- `@/data/sample_data`: Datos de ejemplo del clúster
- `@/types/models`: Tipos TypeScript del dominio
- `@/components/ui/*`: Componentes UI base

---

## Data Flow

```
sample_data.ts (SAMPLE_OUTPUT)
    ↓
HomePage Component (client)
    ↓
Tabs Component (5 views)
    ↓
Cards, Badges, etc. (presentation)
```

---

## Responsive Design

- **Desktop**: 5 tabs horizontales, grids 2-4 columnas
- **Tablet**: Tabs scrollables, grids 2 columnas
- **Mobile**: Tabs stack, single column layout

**Breakpoints**:

```typescript
// 2 columns on md screens
className = "grid gap-4 md:grid-cols-2";

// 4 columns on lg screens
className = "grid gap-4 md:grid-cols-2 lg:grid-cols-4";
```

---

## Color Coding

### Semantic Colors

- **Verde**: Ahorros, éxito, ofertas ganadoras
- **Rojo/Destructive**: Criticidad alta, alertas
- **Amarillo/Secondary**: Criticidad media, en proceso
- **Gris/Muted**: Información secundaria

### Examples

```typescript
// Ahorro en verde
<span className="font-bold text-green-600">
  ${ahorro}K
</span>

// Criticidad alta en rojo
<Badge variant="destructive">ALTA</Badge>

// Estado secundario
<Badge variant="secondary">EN RFP</Badge>
```

---

## Performance Considerations

### Current Implementation

- **Client Component**: Requerido para tabs interactivos
- **Static Data**: Datos pre-cargados desde sample_data.ts
- **No API Calls**: Sin latencia de red
- **Minimal Re-renders**: Estado local solo en tabs

### Future Optimizations

- Implementar React Query para data fetching
- Pagination para listas largas (ofertas, proveedores)
- Virtualization para tablas extensas
- Memoización de cálculos complejos

---

## Accessibility

### Keyboard Navigation

- Tab key para navegar entre tabs
- Arrow keys dentro de cada tab
- Enter/Space para activar elementos

### Screen Readers

- Semantic HTML structure
- ARIA labels en tabs
- Descriptive text en métricas
- Alt text implícito en iconos

### Color Contrast

- Cumple WCAG 2.1 AA
- High contrast mode compatible
- Dark mode totalmente soportado

---

## Future Enhancements

### Phase 1 (Próximos 3 meses)

- [ ] Conectar con API real (Make.com webhooks)
- [ ] Filtros por empresa, período, insumo
- [ ] Exportar vistas a PDF/Excel
- [ ] Gráficas (charts) con Recharts

### Phase 2 (6 meses)

- [ ] Alertas en tiempo real (Teams/Slack)
- [ ] Dashboard personalizable por usuario
- [ ] Drill-down en métricas
- [ ] Historical data comparison

### Phase 3 (12 meses)

- [ ] Predictive analytics (ML)
- [ ] What-if scenarios
- [ ] Mobile app
- [ ] Real-time collaboration

---

## Data Sources

### Current (Prototipo)

```typescript
import { SAMPLE_OUTPUT } from "@/data/sample_data";
```

### Future (Producción)

```typescript
// API endpoints planeados
const { data: kpis } = useQuery("/api/cluster/kpis");
const { data: sinergias } = useQuery("/api/cluster/sinergias");
const { data: rfps } = useQuery("/api/cluster/rfps");
```

---

## Testing Strategy

### Manual Testing

- [ ] Navegar entre los 5 tabs
- [ ] Verificar datos mostrados vs. sample_data
- [ ] Comprobar responsive en mobile/tablet/desktop
- [ ] Validar dark mode en todas las vistas
- [ ] Verificar formato de fechas y números

### Automated Testing (Future)

```typescript
describe("Cluster Dashboard", () => {
  it("should render all 5 tabs", () => {
    render(<HomePage />);
    expect(screen.getByText("Sinergias")).toBeInTheDocument();
    expect(screen.getByText("Calendario")).toBeInTheDocument();
    // ...
  });

  it("should display correct KPI metrics", () => {
    render(<HomePage />);
    expect(screen.getByText("$298K")).toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### Data Not Loading

- Verificar que sample_data.ts existe
- Confirmar tipos en types/models.ts
- Revisar imports en page.tsx

### Tabs Not Switching

- Confirmar que es client component ("use client")
- Verificar TabsList y TabsTrigger están correctos
- Check defaultValue en Tabs

### Dark Mode Issues

- Usar clases semánticas (text-foreground, bg-background)
- Evitar colores hard-coded
- Probar en theme switcher

---

## Related Documentation

- [Dashboard System](./dashboard-system.md)
- [Types Models](../api/schemas.md)
- [Sample Data](../../data/sample_data.ts)
- [UI Components](../components/ui-components.md)

---

## Changelog

### Version 1.0.0 (2025-10-31)

- Initial implementation
- 5 views: Sinergias, Calendario, RFPs, Proveedores, KPIs
- Integration with sample_data.ts
- Full responsive design
- Dark mode support
- Type-safe implementation

---

**Status**: ✅ Complete (Prototype Phase)  
**Last Updated**: October 31, 2025  
**Maintained By**: Frontend Team  
**Data Source**: Static (sample_data.ts)  
**Next Phase**: API Integration
