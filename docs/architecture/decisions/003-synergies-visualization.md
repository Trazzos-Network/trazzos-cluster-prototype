# ADR 003: Synergies Visualization System

**Date**: 2025-10-31  
**Status**: Accepted  
**Context**: Cluster Dashboard - Interactive Graph Visualization

## Decision

We will implement the synergies visualization as a **force-directed graph** using D3.js for physics simulation and Framer Motion for UI animations, rendered as an interactive SVG with React components.

## Context

The Trazzos Cluster Prototype needs a powerful visualization to show collaboration opportunities between multiple companies in real-time. The visualization must:

1. **Display complex relationships** between companies, synergies, and materials
2. **Provide rich interactions** (hover, click, zoom, drag)
3. **Scale to 100+ nodes** without performance degradation
4. **Support multiple view modes** (graph, timeline, matrix)
5. **Animate state transitions** to highlight important changes
6. **Work on mobile and desktop** with touch and mouse inputs

### Requirements

**Functional**:

- Show 3 node types: companies, synergies, materials
- Display estado with color coding
- Show volume/savings with visual weight
- Provide detailed tooltips on hover
- Support node selection and filtering
- Enable zoom and pan for navigation

**Non-Functional**:

- Initial render < 500ms
- Maintain 60fps during animations
- Bundle size < 300KB gzipped
- Support 100+ nodes simultaneously
- Accessible (WCAG AA)

## Options Considered

### Option 1: React Flow

**Pros**:

- Built specifically for React
- Good TypeScript support
- Built-in mini-map and controls
- Handles node drag automatically

**Cons**:

- Limited physics customization
- Harder to create custom node shapes (hexagons)
- Overkill for our use case (designed for flowcharts)
- Larger bundle size (~150KB)

### Option 2: Cytoscape.js

**Pros**:

- Mature graph visualization library
- Excellent layout algorithms
- Good performance with large graphs
- Extensive plugin ecosystem

**Cons**:

- Not React-native (requires wrapper)
- Canvas-based (harder to integrate with React animations)
- Steeper learning curve
- Less control over animations

### Option 3: D3.js + Framer Motion (CHOSEN)

**Pros**:

- **Maximum flexibility**: Full control over layout, rendering, animations
- **Best-in-class physics**: D3 force simulation is industry standard
- **React-friendly**: Can use with React hooks pattern
- **Small bundle**: Only import what you need
- **Animation power**: Framer Motion for smooth, spring-based animations
- **SVG rendering**: Easy to style, inspect, debug
- **TypeScript support**: Excellent types for both libraries

**Cons**:

- More code to write (no built-in UI controls)
- Need to manage simulation lifecycle manually
- Requires understanding of both D3 and React paradigms

### Option 4: Canvas + Custom Physics

**Pros**:

- Maximum performance for huge graphs (>1000 nodes)
- Full pixel-level control

**Cons**:

- **Much harder to implement**: Physics simulation from scratch
- **Harder to integrate with React**: Imperative API
- **Accessibility issues**: Canvas is a black box to screen readers
- **More bugs**: Reinventing the wheel
- **Overkill**: We don't need >1000 nodes

## Decision Rationale

We chose **Option 3: D3.js + Framer Motion** because:

1. **Flexibility**: We need custom node shapes (hexagons, circles), specific force configurations, and complex animations. D3 gives us full control.

2. **React Integration**: The `useForceSimulation()` hook pattern allows D3 to manage physics while React handles rendering. This is a proven approach.

3. **Animation Quality**: Framer Motion provides best-in-class spring animations for hover states, entrances, and transitions. This creates a polished, professional feel.

4. **Bundle Size**: We only import the D3 modules we need (`d3-force`, `d3-scale`). Combined with Framer Motion tree-shaking, total impact is ~120KB gzipped.

5. **Performance**: D3 force simulation is highly optimized. For our use case (< 100 nodes), SVG rendering at 60fps is easily achievable.

6. **Maintainability**: Both libraries have excellent documentation, large communities, and active maintenance.

7. **Future-Proof**: D3 is the foundation for most data visualization. Skills learned here transfer to other projects.

## Implementation Details

### Architecture Pattern

```typescript
// Hook manages D3 simulation (imperative)
function useForceSimulation(nodes, edges, dimensions) {
  useEffect(() => {
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges))
      .force('charge', d3.forceManyBody())
      // ... more forces

    simulation.on('tick', () => {
      setPositions(...); // Update React state
    });

    return () => simulation.stop(); // Cleanup
  }, [nodes, edges]);

  return { positions };
}

// Component renders with Framer Motion (declarative)
function SynergiesGraph({ sinergias }) {
  const graphData = useMemo(() => transformToGraphData(sinergias), [sinergias]);
  const { positions } = useForceSimulation(graphData.nodes, graphData.edges, dimensions);

  return (
    <svg>
      {graphData.nodes.map(node => (
        <motion.g
          animate={{ x: positions[node.id].x, y: positions[node.id].y }}
          whileHover={{ scale: 1.1 }}
        >
          {/* Node content */}
        </motion.g>
      ))}
    </svg>
  );
}
```

### Force Configuration

```typescript
const simulation = d3
  .forceSimulation(nodes)
  // Keep edges connected
  .force(
    "link",
    d3
      .forceLink(edges)
      .id((d) => d.id)
      .distance((d) => (d.type === "company-synergy" ? 150 : 80))
      .strength(0.5)
  )
  // Repel nodes from each other
  .force("charge", d3.forceManyBody().strength(-1000))
  // Center graph in viewport
  .force("center", d3.forceCenter(width / 2, height / 2))
  // Prevent overlap
  .force(
    "collision",
    d3.forceCollide().radius((node) => getRadius(node))
  )
  // Gentle pull toward center
  .force("x", d3.forceX(width / 2).strength(0.05))
  .force("y", d3.forceY(width / 2).strength(0.05))
  // Slow convergence for smoother animation
  .alphaDecay(0.02);
```

### Animation Strategy

1. **Entrance**: Nodes stagger in with scale from 0 to 1
2. **Hover**: Spring animation to 1.15x scale with glow effect
3. **Selection**: Blue ring fades in, node scales to 1.1x
4. **Edge Draw**: Path length animates from 0 to 1
5. **Particles**: Continuous motion along edge path (future)

## Consequences

### Positive

- ✅ **Full creative control** over visualization design
- ✅ **Smooth, professional animations** with minimal code
- ✅ **React-friendly patterns** (hooks, components)
- ✅ **Excellent performance** for our scale (< 100 nodes)
- ✅ **Small bundle size** (~120KB)
- ✅ **Easy to test**: Separate concerns (data transform, simulation, rendering)
- ✅ **Extensible**: Can add timeline view, mini-map, etc.

### Negative

- ❌ **More initial code**: No built-in UI controls (had to build zoom buttons, legend)
- ❌ **Learning curve**: Team needs to understand D3 force simulation
- ❌ **Simulation tuning**: Requires experimentation to get forces right
- ❌ **Canvas fallback**: If we need >100 nodes, SVG may not scale (would need rewrite)

### Mitigations

- **Documentation**: Comprehensive README and inline comments
- **Examples**: Working prototype demonstrates all patterns
- **Abstraction**: `useForceSimulation()` hook encapsulates D3 complexity
- **Future canvas**: Architecture allows swapping renderer without changing data layer

## Alternatives for Future

If we hit performance limits with SVG (>100 nodes):

1. **Virtualize**: Only render nodes in viewport
2. **Canvas renderer**: Use `react-konva` or `pixi.js`
3. **WebGL**: Use `deck.gl` for 1000+ nodes

## Acceptance Criteria

- [x] Force simulation converges to stable layout
- [x] Hover interactions are smooth (60fps)
- [x] Click selection provides visual feedback
- [x] Zoom controls work within bounds
- [x] Graph is responsive to window resize
- [x] Bundle size is < 300KB gzipped
- [x] Initial render is < 500ms
- [x] Code is well-documented with examples

## References

- [D3 Force Documentation](https://d3js.org/d3-force)
- [Framer Motion API](https://www.framer.com/motion/)
- [React + D3 Patterns](https://2019.wattenberger.com/blog/react-and-d3)
- [Observable D3 Force Examples](https://observablehq.com/@d3/force-directed-graph)

## Related ADRs

- ADR 001: Package Manager (pnpm) - Affects how D3 is installed
- ADR 002: Dashboard Route Groups - Determines where viz is located
- Future ADR: Timeline View Implementation

---

**Approved by**: Trazzos Architecture Team  
**Implemented**: 2025-10-31  
**Review Date**: 2026-01-31 (3 months)
