import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import { diffPoints } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen';

export function useZoomDecorator(params: ViewModelParams) {
  const { windowPositionModel, canvasRect } = params;

  return (viewModel: ViewModel) => {
    return {
      ...viewModel,
      window: {
        ...viewModel.window,
        onMouseWheel: (e: globalThis.WheelEvent) => {
          viewModel.window?.onMouseWheel?.(e);

          const delta = e.deltaY > 0 ? 0.95 : 1.05;

          const newZoom = windowPositionModel.position.zoom * delta;

          // где была мышка в координатах канваса до масштабирования
          const currentPoint = pointOnScreenToCanvas(
            { x: e.clientX, y: e.clientY },
            windowPositionModel.position,
            canvasRect,
          );

          // новые координаты мышки в координатах канваса после масштабирования
          const newPoint = pointOnScreenToCanvas(
            { x: e.clientX, y: e.clientY },
            { ...windowPositionModel.position, zoom: newZoom },
            canvasRect,
          );

          const diff = diffPoints(currentPoint, newPoint);

          windowPositionModel.setPosition({
            ...windowPositionModel.position,
            zoom: newZoom,
            x: windowPositionModel.position.x - diff.x,
            y: windowPositionModel.position.y - diff.y,
          });
        },
      },
    };
  };
}
