import type { MouseEvent } from 'react';
import type { IdleViewState } from '.';
import type { ViewModelParams } from '../../view-model-params.types';
import { pointOnScreenToCanvas } from '../../../domain/screen';

export function useMouseDown(params: ViewModelParams) {
  const { setViewState, canvasRect, windowPositionModel } = params;

  const handleOverlayMouseDown = (
    e: MouseEvent<HTMLDivElement>,
    idleState: IdleViewState,
  ) => {
    if (!canvasRect) return;

    const point = pointOnScreenToCanvas(
      { x: e.clientX, y: e.clientY },
      windowPositionModel.position,
      canvasRect,
    );

    setViewState({
      ...idleState,
      mouseDown: { type: 'overlay', ...point, isRightClick: e.button === 2 },
    });
  };

  const handleNodeMouseDown = (
    e: MouseEvent,
    idleState: IdleViewState,
    nodeId: string,
  ) => {
    if (!canvasRect) return;

    const point = pointOnScreenToCanvas(
      { x: e.clientX, y: e.clientY },
      windowPositionModel.position,
      canvasRect,
    );

    setViewState({
      ...idleState,
      mouseDown: {
        type: 'node',
        nodeId,
        ...point,
        isRightClick: e.button === 2,
      },
    });
  };

  const getIsStickerMouseDown = (idleState: IdleViewState, nodeId: string) => {
    return (
      idleState.mouseDown?.type === 'node' &&
      idleState.mouseDown.nodeId === nodeId
    );
  };

  const handleWindowMouseUp = (idleState: IdleViewState) => {
    if (idleState.mouseDown) {
      setViewState({
        ...idleState,
        mouseDown: undefined,
      });
    }
  };

  return {
    handleOverlayMouseDown,
    handleNodeMouseDown,
    handleWindowMouseUp,
    getIsStickerMouseDown,
  };
}
