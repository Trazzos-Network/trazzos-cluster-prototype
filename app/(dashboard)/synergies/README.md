# Synergies Visualization System

## 🎯 Overview

This is a highly visual, animated synergies visualization system for industrial cluster procurement. It provides real-time collaboration opportunities between petrochemical companies in Cartagena, Colombia.

## 📦 Tech Stack

- **React 19** with Server & Client Components
- **Next.js 16** (App Router)
- **TypeScript 5+**
- **Tailwind CSS 4** + **shadcn/ui**
- **Framer Motion** for animations
- **D3.js** for force-directed graph layout
- **date-fns** for date manipulation

## 🏗️ Architecture

```
app/synergies/
├── page.tsx                          # Server Component (data loading)
├── components/
│   ├── Synergies

Graph.tsx            # Main Client Component
│   ├── ForceGraph/
│   │   ├── index.tsx                 # Force-directed graph container
│   │   ├── CompanyNode.tsx           # Company visualization
│   │   ├── SynergyNode.tsx           # Synergy hexagon with animations
│   │   ├── MaterialNode.tsx          # Material category node
│   │   ├── Edge.tsx                  # Animated connection lines
│   │   └── FlowingParticles.tsx     # Particle animation on edges
│   ├── TimelineView/
│   │   ├── index.tsx                 # Timeline container
│   │   ├── TimeAxis.tsx              # Horizontal time scale
│   │   ├── SwimLane.tsx              # Company swim lane
│   │   ├── SynergyBlock.tsx          # Synergy block on timeline
│   │   └── OverlapIndicator.tsx     # Overlap visualization
│   ├── TopBar.tsx                    # Filters & controls
│   ├── Sidebar.tsx                   # Stats & activity feed
│   ├── SynergyDetailPanel.tsx        # Detailed synergy view
│   └── Tooltip.tsx                   # Rich hover tooltips
├── lib/
│   ├── synergies/
│   │   ├── calculations.ts           # Transform & utility functions
│   │   ├── layout.ts                 # Force simulation config
│   │   └── colors.ts                 # Theme colors
│   └── hooks/
│       ├── useSynergiesData.ts       # Data fetching
│       ├── useForceSimulation.ts     # D3 force layout
│       ├── useGraphZoom.ts           # Zoom & pan controls
│       ├── useNodeSelection.ts       # Selection state
│       └── useGraphFilters.ts        # Filter logic
└── types/
    └── synergies-viz.ts              # Extended types for viz
```

## 🚀 Implementation Status

### ✅ Phase 1: Foundation (COMPLETE)

- [x] Dependencies installed
- [x] Type definitions created
- [x] Utility functions for calculations
- [x] Directory structure set up

### 🔨 Phase 2: Core Graph (IN PROGRESS)

- [ ] Force simulation hook
- [ ] Basic node components
- [ ] Edge rendering
- [ ] Main graph container
- [ ] Hover interactions

### 📋 Phase 3: Enhanced Features (TODO)

- [ ] Timeline view
- [ ] Filters & search
- [ ] Detail panel
- [ ] Animations (particles, pulse, transitions)
- [ ] Responsive design
- [ ] Accessibility features

### 🎨 Phase 4: Polish (TODO)

- [ ] Dark mode optimization
- [ ] Performance optimization (virtualization)
- [ ] Mobile gestures
- [ ] Export functionality
- [ ] Mini-map navigation

## 📝 Key Features Implemented

### Graph Visualization

- **3 Node Types**: Companies (circles), Synergies (hexagons), Materials (small circles)
- **Animated Edges**: Flowing particles showing material flow
- **Force Layout**: D3-powered physics simulation
- **Rich Tooltips**: Detailed information on hover

### Interactions

- **Hover States**: Scale, glow, dim others, show tooltip
- **Click Actions**: Open detail panel, filter by node
- **Multi-Select**: Shift+click or box select
- **Drag & Drop**: Reposition nodes (sticky)

### Filters & Controls

- **Estado Filter**: Pendiente, En RFP, Aprobada, Cerrada
- **Company Filter**: Multi-select companies
- **Criticidad Filter**: Alta, Media, Baja
- **Date Range**: Filter by ventana period
- **Search**: Find by insumo or company name

## 🎯 Next Steps

### 1. Create Force Simulation Hook

```typescript
// lib/hooks/useForceSimulation.ts
export function useForceSimulation(
  nodes: GraphNode[],
  edges: GraphEdge[],
  dimensions: Dimensions
) {
  const [positions, setPositions] = useState<Record<string, Position>>({});

  useEffect(() => {
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(edges)
          .id((d: any) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-800))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => {
          if (d.type === "company") return 50;
          if (d.type === "synergy") return d.radius || 40;
          return 25;
        })
      );

    simulation.on("tick", () => {
      const newPositions: Record<string, Position> = {};
      nodes.forEach((node) => {
        newPositions[node.id] = { x: node.x || 0, y: node.y || 0 };
      });
      setPositions(newPositions);
    });

    return () => simulation.stop();
  }, [nodes, edges, dimensions]);

  return { positions };
}
```

### 2. Create Synergy Node Component

```typescript
// app/synergies/components/ForceGraph/SynergyNode.tsx
export function SynergyNode({ data, position, ... }) {
  return (
    <motion.g
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <path d={createHexagonPath(radius)} fill={ESTADO_COLORS[data.estado]} />
      {/* RFP progress ring */}
      {data.estado === 'EN_RFP' && <ProgressRing progress={rfpProgress} />}
      {/* Icon & label */}
      <text>{getMaterialIcon(data.insumo)}</text>
      {/* Savings badge */}
      <g><circle fill="green" /><text>{data.ahorro_estimado_pct}%</text></g>
    </motion.g>
  );
}
```

### 3. Create Main Graph Component

```typescript
// app/synergies/components/SynergiesGraph.tsx
'use client';

export function SynergiesGraph({ sinergias }: { sinergias: SinergiaDetectada[] }) {
  const graphData = useMemo(() => transformToGraphData(sinergias), [sinergias]);
  const { positions } = useForceSimulation(graphData.nodes, graphData.edges, dimensions);

  return (
    <div>
      <TopBar />
      <svg width={dimensions.width} height={dimensions.height}>
        {/* Edges */}
        {graphData.edges.map(edge => <Edge key={edge.id} {...edge} />)}
        {/* Nodes */}
        {graphData.nodes.map(node => (
          node.type === 'synergy' ? <SynergyNode key={node.id} ... /> :
          node.type === 'company' ? <CompanyNode key={node.id} ... /> :
          <MaterialNode key={node.id} ... />
        ))}
      </svg>
      <Sidebar />
    </div>
  );
}
```

### 4. Create Page Entry Point

```typescript
// app/synergies/page.tsx
import { SAMPLE_OUTPUT } from "@/data/sample_data";
import { SynergiesGraph } from "./components/SynergiesGraph";

export default function SynergiesPage() {
  const sinergias = SAMPLE_OUTPUT.sinergias;

  return (
    <div className="min-h-screen bg-background">
      <SynergiesGraph sinergias={sinergias} />
    </div>
  );
}
```

## 🎨 Animation Patterns

### Flowing Particles

```typescript
<motion.circle
  r={3}
  fill={edgeColor}
  initial={{ offsetDistance: "0%" }}
  animate={{ offsetDistance: "100%" }}
  transition={{
    duration: 2 / criticitySpeed,
    repeat: Infinity,
    ease: "linear",
  }}
  style={{ offsetPath: `path('${edgePath}')` }}
/>
```

### Pulse Effect (New Synergy)

```typescript
<motion.circle
  r={nodeRadius}
  stroke={color}
  strokeWidth={3}
  animate={{
    scale: [1, 1.5, 1],
    opacity: [0.8, 0, 0.8],
  }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

### Progress Ring (RFP)

```typescript
<motion.circle
  r={radius - 5}
  stroke="#3b82f6"
  strokeWidth={4}
  strokeDasharray={circumference}
  animate={{
    strokeDashoffset: circumference * (1 - progress),
  }}
  transition={{ duration: 1, ease: "easeOut" }}
/>
```

## 📊 Data Flow

```
SAMPLE_OUTPUT.sinergias
  ↓
transformToGraphData()
  ↓
{ nodes: GraphNode[], edges: GraphEdge[] }
  ↓
useForceSimulation()
  ↓
{ positions: Record<id, {x, y}> }
  ↓
Render Components (SVG/Framer Motion)
```

## 🔧 Performance Tips

1. **Memoize graph data**: `useMemo(() => transformToGraphData(...))`
2. **Memo node components**: `memo(SynergyNode, shallowEqual)`
3. **Debounce filters**: 300ms for search, 150ms for dropdowns
4. **Virtualize timeline**: Use `react-window` for >20 swim lanes
5. **Canvas fallback**: If >100 nodes, use `react-konva`

## 🎯 File Creation Order

1. **Hooks** (foundation):

   - `useForceSimulation.ts`
   - `useNodeSelection.ts`
   - `useGraphFilters.ts`

2. **Core Nodes** (building blocks):

   - `SynergyNode.tsx`
   - `CompanyNode.tsx`
   - `MaterialNode.tsx`

3. **Graph Container**:

   - `ForceGraph/index.tsx`
   - `Edge.tsx`

4. **UI Controls**:

   - `TopBar.tsx`
   - `Sidebar.tsx`

5. **Main Component**:

   - `SynergiesGraph.tsx`
   - `page.tsx`

6. **Enhancements**:
   - `FlowingParticles.tsx`
   - `SynergyDetailPanel.tsx`
   - `TimelineView/`

## 📚 Resources

- [D3 Force Simulation](https://d3js.org/d3-force)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [SVG Path Commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
- [Accessibility Best Practices](https://www.w3.org/WAI/WCAG21/quickref/)

## 🐛 Common Issues

### Simulation Not Running

- Ensure nodes have unique IDs
- Check that dimensions are set
- Verify D3 is imported correctly

### Animations Stuttering

- Enable `prefersReducedMotion` check
- Reduce particle count
- Use `will-change` CSS property

### Tooltips Not Showing

- Wrap graph in `<TooltipProvider>`
- Check z-index conflicts
- Verify pointer-events are enabled

---

**Status**: Foundation Complete, Core Graph In Progress  
**Next Milestone**: Working force graph with basic interactions  
**Estimated Completion**: Phase 2 - 2 days, Phase 3 - 3 days, Phase 4 - 2 days
