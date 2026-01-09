import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import { goToIdle } from './idle';
import type { Point } from '../../domain/point';
import {
  createRectFromDimensions,
  createRectFromPoints,
  isRectsIntersecting,
  type Rect,
} from '../../domain/rect';
import { pointOnScreenToCanvas } from '../../domain/screen';
import { selectItems, type Selection } from '../../domain/selection';

export type SelectionWindowViewState = {
  type: 'selection-window';
  startPoint: Point;
  endPoint: Point;
  initialSelectedIds: Selection;
};

export function useSelectionWindowViewModel(params: ViewModelParams) {
  const {
    nodesModel,
    setViewState,
    canvasRect,
    nodesRects,
    windowPositionModel,
  } = params;

  const getNodes = (state: SelectionWindowViewState, selectionRect: Rect) => {
    return nodesModel.nodes.map(node => {
      const nodeDimensions = nodesRects[node.id];

      const nodeRect = createRectFromDimensions(node, nodeDimensions);

      return {
        ...node,
        isSelected:
          isRectsIntersecting(nodeRect, selectionRect) ||
          state.initialSelectedIds.has(node.id),
      };
    });
  };

  return (state: SelectionWindowViewState): ViewModel => {
    const rect = createRectFromPoints(state.startPoint, state.endPoint);

    const nodes = getNodes(state, rect);

    return {
      nodes,
      selectionWindow: rect,
      window: {
        onMouseUp: () => {
          const nodesIdsInRect = nodes
            .filter(node => node.isSelected)
            .map(node => node.id);

          setViewState(
            goToIdle({
              selectedIds: selectItems(
                state.initialSelectedIds,
                nodesIdsInRect,
                'add',
              ),
            }),
          );
        },
        onMouseMove: (e: globalThis.MouseEvent) => {
          const currentPoint = pointOnScreenToCanvas(
            { x: e.clientX, y: e.clientY },
            windowPositionModel.position,
            canvasRect,
          );

          setViewState({ ...state, endPoint: currentPoint });
        },
      },
    };
  };
}

export function goToSelectionWindow(args: {
  startPoint: Point;
  endPoint: Point;
  initialSelectedIds?: Selection;
}): SelectionWindowViewState {
  const { startPoint, endPoint, initialSelectedIds } = args;

  return {
    type: 'selection-window',
    startPoint,
    endPoint,
    initialSelectedIds: initialSelectedIds ?? new Set(),
  };
}
