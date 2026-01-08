import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import type { KeyboardEvent, MouseEvent } from 'react';

export function useAddStickerViewModel(params: ViewModelParams) {
  const { nodesModel, viewStateModel, canvasRect } = params;

  return (): ViewModel => ({
    nodes: nodesModel.nodes,
    layout: {
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter') return;

        viewStateModel.goToIdle();
      },
    },
    canvas: {
      onClick: (e: MouseEvent<HTMLDivElement>) => {
        if (!canvasRect) return;

        nodesModel.addSticker({
          text: 'Default',
          x: e.clientX - canvasRect.x,
          y: e.clientY - canvasRect.y,
        });

        viewStateModel.goToIdle();
      },
    },
    actions: {
      addSticker: {
        onClick: () => viewStateModel.goToIdle(),
        isActive: true,
      },
    },
  });
}
