import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import { goToIdle } from './idle';
import { diffPoints, type Point } from '../../domain/point';
import { type Selection } from '../../domain/selection';
import { pointOnScreenToCanvas } from '../../domain/screen';

export type WindowDraggingViewState = {
  type: 'window-dragging';
  startPoint: Point;
  endPoint: Point;
};

export function useWindowDraggingViewModel(params: ViewModelParams) {
  const { nodesModel, setViewState, canvasRect, windowPositionModel } = params;

  return (state: WindowDraggingViewState): ViewModel => {
    const diff = diffPoints(state.startPoint, state.endPoint);

    return {
      nodes: nodesModel.nodes,
      windowPosition: {
        x: windowPositionModel.position.x - diff.x,
        y: windowPositionModel.position.y - diff.y,
        zoom: windowPositionModel.position.zoom,
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
          windowPositionModel.setPosition({
            x: windowPositionModel.position.x - diff.x,
            y: windowPositionModel.position.y - diff.y,
            zoom: windowPositionModel.position.zoom,
          });

          setViewState(goToIdle());
        },
      },
    };
  };
}

export function goToWindowDragging(args: {
  startPoint: Point;
  endPoint: Point;
  nodesToMove?: Selection;
}): WindowDraggingViewState {
  const { startPoint, endPoint } = args;

  return { type: 'window-dragging', startPoint, endPoint };
}
