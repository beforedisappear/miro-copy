import { distanceFromPoints } from '@/features/board/domain/point';
import { pointOnScreenToCanvas } from '@/features/board/domain/screen';
import type { IdleViewState } from '.';
import type { ViewModelParams } from '../../view-model-params.types';
import { goToWindowDragging } from '../window-dragging';

export function useGoToWindowDragging(params: ViewModelParams) {
  const { setViewState, canvasRect, windowPositionModel } = params;

  const handleWindowMouseMove = (
    e: globalThis.MouseEvent,
    idleState: IdleViewState,
  ) => {
    if (idleState.mouseDown && idleState.mouseDown.isRightClick) {
      const currentPoint = pointOnScreenToCanvas(
        { x: e.clientX, y: e.clientY },
        windowPositionModel.position,
        canvasRect,
      );

      if (distanceFromPoints(idleState.mouseDown, currentPoint) > 5) {
        setViewState(
          goToWindowDragging({
            startPoint: idleState.mouseDown,
            endPoint: currentPoint,
          }),
        );
      }
    }
  };

  return { handleWindowMouseMove };
}
