import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import { goToIdle } from './idle';
import type { Point } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen';
import { type Selection } from '../../domain/selection';
import { addPoints, vectorFromPoints } from '../../domain/point';

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

        if (node.type === 'sticker') {
          const newPoint = addPoints(node, diff);

          return { ...node, ...newPoint, isSelected: true };
        }

        if (node.type === 'arrow') {
          const newStart = addPoints(node.start, diff);
          const newEnd = addPoints(node.end, diff);

          return { ...node, start: newStart, end: newEnd, isSelected: true };
        }
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
          const nodesToMove = nodes
            .filter(node => state.nodesToMove.has(node.id))
            .flatMap(node => {
              if (node.type === 'arrow')
                return [
                  { id: node.id, type: 'start' as const, ...node.start },
                  { id: node.id, type: 'end' as const, ...node.end },
                ];

              return [{ id: node.id, x: node.x, y: node.y }];
            });

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
