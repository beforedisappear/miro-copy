import type { CanvasRect } from '../lib/use-canvas-rect';
import type { WindowPosition } from '../model/window-position';

export function pointOnScreenToCanvas(
  point: { x: number; y: number },
  windowPosition: WindowPosition,
  canvasRect?: CanvasRect | null,
) {
  if (!canvasRect) return point;

  return {
    x: (point.x - canvasRect.x) / windowPosition.zoom + windowPosition.x,
    y: (point.y - canvasRect.y) / windowPosition.zoom +  windowPosition.y,
  };
}
