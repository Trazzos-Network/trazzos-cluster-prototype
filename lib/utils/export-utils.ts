/**
 * Export utilities for capturing and downloading visualizations
 */

/**
 * Capture SVG element as PNG
 */
export async function exportSVGAsPNG(
  svgElement: SVGElement,
  filename: string = "synergies-graph.png",
  options: {
    width?: number;
    height?: number;
    scale?: number;
  } = {}
): Promise<void> {
  const { width, height, scale = 2 } = options;

  // Clone the SVG to avoid modifying the original
  const clonedSVG = svgElement.cloneNode(true) as SVGElement;

  // Get bounding box if dimensions not provided
  const bbox = svgElement.getBBox();
  const svgWidth = width || bbox.width;
  const svgHeight = height || bbox.height;

  // Set explicit dimensions on cloned SVG
  clonedSVG.setAttribute("width", String(svgWidth * scale));
  clonedSVG.setAttribute("height", String(svgHeight * scale));
  clonedSVG.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

  // Serialize SVG to string
  const svgData = new XMLSerializer().serializeToString(clonedSVG);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = svgWidth * scale;
  canvas.height = svgHeight * scale;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Load SVG as image
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      ctx.fillStyle = "white"; // Background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);
      resolve();
    };
    img.onerror = reject;
    img.src = svgUrl;
  });

  // Convert canvas to blob and download
  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error("Failed to create blob");
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, "image/png");
}

/**
 * Export current graph state as JSON
 */
export function exportGraphAsJSON(
  data: unknown,
  filename: string = "synergies-data.json"
): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
