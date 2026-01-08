import { useCallback, useState, type RefCallback } from 'react';

export type CanvasRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function useCanvasRect() {
  const [canvasRect, setCanvasRect] = useState<CanvasRect | null>(null);

  const canvasRef: RefCallback<HTMLDivElement> = useCallback(el => {
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const { x, y } = el.getBoundingClientRect();

        setCanvasRect({ x, y, width, height });
      }
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { canvasRef, canvasRect };
};
