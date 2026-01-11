import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import type { KeyboardEvent } from 'react';
import { goToIdle } from './idle';
import { diffPoints, type Point } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen';
import { createRelativeBase } from '../decorator/resolve-relative';

export type DrawArrowViewState = {
  type: 'draw-arrow';
  startPoint: Point;
  endPoint: Point;
  startRelativeTo?: string;
};

export function useDrawArrowViewModel(params: ViewModelParams) {
  const { nodesModel, setViewState, canvasRect, windowPositionModel } = params;

  const addArrow = (state: DrawArrowViewState, endRelativeTo?: string) => {
    const relativeBase = createRelativeBase(nodesModel.nodes);

    const newArrow = {
      start: state.startRelativeTo
        ? {
            ...diffPoints(
              relativeBase[state.startRelativeTo],
              state.startPoint,
            ),
            relativeTo: state.startRelativeTo,
          }
        : state.startPoint,
      end: endRelativeTo
        ? {
            ...diffPoints(relativeBase[endRelativeTo], state.endPoint),
            relativeTo: endRelativeTo,
          }
        : state.endPoint,
    };
    nodesModel.addArrow(newArrow);
  };

  return (state: DrawArrowViewState): ViewModel => {
    const { startPoint, endPoint } = state;

    const newArrow = {
      id: 'drawing-arrow',
      type: 'arrow' as const,
      start: startPoint,
      end: endPoint,
      noPointerEvents: true,
    };

    const newNodes = [...nodesModel.nodes, newArrow];

    return {
      nodes: newNodes.map(node => {
        if (node.type === 'sticker') {
          return { ...node, onMouseUp: () => addArrow(state, node.id) };
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
        onMouseUp: () => {
          addArrow(state);
        },
      },
      window: {
        onMouseMove: (e: globalThis.MouseEvent) => {
          const currentPoint = pointOnScreenToCanvas(
            { x: e.clientX, y: e.clientY },
            windowPositionModel.position,
            canvasRect,
          );

          setViewState({ ...state, endPoint: currentPoint });
        },
        onMouseUp: () => {
          setViewState(goToIdle());
        },
      },
      actions: { addArrow: { isActive: true } },
    };
  };
}

export function goToDrawArrow(
  startPoint: Point,
  startRelativeTo?: string,
): DrawArrowViewState {
  return {
    type: 'draw-arrow',
    startPoint,
    endPoint: startPoint,
    startRelativeTo,
  };
}
