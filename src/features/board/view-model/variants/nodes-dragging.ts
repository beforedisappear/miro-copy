import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import { goToIdle } from './idle';
import type { Point } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen';
import { type Selection } from '../../domain/selection';
import { vectorFromPoints } from '../../domain/point';

export type NodesDraggingViewState = {
  type: 'nodes-dragging';
  startPoint: Point;
  endPoint: Point;
  nodesToMove: Selection;
};

export function useNodesDraggingViewModel(params: ViewModelParams) {
  const { nodesModel, setViewState, canvasRect, windowPositionModel } = params;

  const getNodes = (state: NodesDraggingViewState) => {
    return nodesModel.nodes.map(node => {
      if (state.nodesToMove.has(node.id)) {
        const diff = vectorFromPoints(state.startPoint, state.endPoint);

        return {
          ...node,
          x: node.x + diff.x,
          y: node.y + diff.y,
          isSelected: true,
        };
      }

      return node;
    });
  };

  return (state: NodesDraggingViewState): ViewModel => {
    const nodes = getNodes(state);

    return {
      nodes,
      window: {
        onMouseUp: () => {
          const nodesToMove = nodes.filter(node =>
            state.nodesToMove.has(node.id),
          );

          nodesModel.updateNodesPositions({ positions: nodesToMove });

          setViewState(goToIdle({ selectedIds: state.nodesToMove }));
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

export function goToNodesDragging(args: {
  startPoint: Point;
  endPoint: Point;
  nodesToMove?: Selection;
}): NodesDraggingViewState {
  const { startPoint, endPoint, nodesToMove } = args;

  return {
    type: 'nodes-dragging',
    startPoint,
    endPoint,
    nodesToMove: nodesToMove ?? new Set(),
  };
}
