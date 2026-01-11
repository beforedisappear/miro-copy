import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import type { KeyboardEvent, MouseEvent } from 'react';
import { goToIdle } from './idle';
import { goToDrawArrow } from './draw-arrow';
import { pointOnScreenToCanvas } from '../../domain/screen';

export type AddArrowViewState = {
  type: 'add-arrow';
};

export function useAddArrowViewModel(params: ViewModelParams) {
  const { nodesModel, setViewState, canvasRect, windowPositionModel } = params;

  return (): ViewModel => ({
    nodes: nodesModel.nodes.map(node => {
      if (node.type === 'sticker') {
        return {
          ...node,
          onMouseDown: (e: MouseEvent) => {
            const currentPoint = pointOnScreenToCanvas(
              { x: e.clientX, y: e.clientY },
              windowPositionModel.position,
              canvasRect,
            );

            setViewState(goToDrawArrow(currentPoint, node.id));
          },
        };
      }

      return node;
    }),
    layout: {
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Escape') return;

        setViewState(goToIdle());
      },
    },
    overlay: {
      onMouseDown: (e: MouseEvent) => {
        const currentPoint = pointOnScreenToCanvas(
          { x: e.clientX, y: e.clientY },
          windowPositionModel.position,
          canvasRect,
        );

        setViewState(goToDrawArrow(currentPoint));
      },
    },
    actions: {
      addArrow: {
        isActive: true,
        onClick: () => setViewState(goToIdle()),
      },
    },
  });
}

export function goToAddArrow(): AddArrowViewState {
  return { type: 'add-arrow' };
}
