import type { CanvasRect } from '../lib/use-canvas-rect';
import type { NodesModel } from '../model/nodes';
import type { ViewStateModel } from '../model/view-state';

export type ViewModelParams = {
  nodesModel: NodesModel;
  viewStateModel: ViewStateModel;
  canvasRect: CanvasRect | null;
};
