import { useEffect } from 'react';
import type { ViewModel } from '../view-model/view-model.types';

export function useWindowEvents(viewModel: ViewModel) {
  useEffect(() => {
    const onMouseMove = (e: globalThis.MouseEvent) => {
      viewModel.window?.onMouseMove?.(e);
    };

    const onMouseUp = (e: globalThis.MouseEvent) => {
      viewModel.window?.onMouseUp?.(e);
    };

    const abortController = new AbortController();
    const signal = abortController.signal;

    window.addEventListener('mousemove', onMouseMove, { signal });
    window.addEventListener('mouseup', onMouseUp, { signal });

    return () => {
      abortController.abort();
    };
  }, [viewModel]);
}
