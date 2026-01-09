import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import type { KeyboardEvent, MouseEvent } from 'react';
import { goToIdle } from './idle';
import { pointOnScreenToCanvas } from '../../domain/screen';

export type AddStickerViewState = {
  type: 'add-sticker';
};

export function useAddStickerViewModel(params: ViewModelParams) {
  const { nodesModel, setViewState, canvasRect, windowPositionModel } = params;

  return (): ViewModel => ({
    nodes: nodesModel.nodes,
    layout: {
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter') return;

        setViewState(goToIdle());
      },
    },
    canvas: {
      onClick: (e: MouseEvent<HTMLDivElement>) => {
        if (!canvasRect) return;

        const point = pointOnScreenToCanvas(
          { x: e.clientX, y: e.clientY },
          windowPositionModel.position,
          canvasRect,
        );

        nodesModel.addSticker({ text: 'Default', ...point });

        setViewState(goToIdle());
      },
    },
    actions: {
      addSticker: {
        isActive: true,
        onClick: () => setViewState(goToIdle()),
      },
    },
  });
}

export function goToAddSticker(): AddStickerViewState {
  return { type: 'add-sticker' };
}
