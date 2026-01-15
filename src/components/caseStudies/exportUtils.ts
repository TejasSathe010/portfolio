"use client";

export async function exportAsSVG(svgElement: SVGSVGElement, canvasContainer: HTMLElement): Promise<string> {
  const svg = svgElement.cloneNode(true) as SVGSVGElement;

  const rect = canvasContainer.getBoundingClientRect();
  svg.setAttribute("width", rect.width.toString());
  svg.setAttribute("height", rect.height.toString());
  svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  return `<?xml version="1.0" encoding="UTF-8"?>\n${svgString}`;
}

export async function exportAsPNG(
  canvasContainer: HTMLElement,
  width: number,
  height: number
): Promise<string> {
  
  let html2canvas: typeof import("html2canvas").default;
  
  try {
    html2canvas = (await import("html2canvas")).default;
  } catch (error) {
    throw new Error(
      "PNG export requires html2canvas package. Install with: npm install html2canvas\n" +
      "SVG export is available without additional dependencies."
    );
  }
  
  try {
    const canvas = await html2canvas(canvasContainer, {
      width,
      height,
      scale: 2, 
      useCORS: true,
      backgroundColor: null,
    });

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("PNG export failed:", error);
    throw new Error("Failed to generate PNG. Please try SVG export instead.");
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadDataURL(dataURL: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
