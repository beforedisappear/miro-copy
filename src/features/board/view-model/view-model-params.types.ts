import type { CanvasRect } from '../lib/use-canvas-rect';
import type { NodesModel } from '../model/nodes';
import type { ViewState } from '../view-model/use-view-model';
import type { NodesRectsMap } from '../lib/use-nodes-dimensions';
import type { WindowPositionModel } from '../model/window-position';

export type ViewModelParams = {
  nodesModel: NodesModel;
  setViewState: (viewState: ViewState) => void;
  canvasRect: CanvasRect | null;
  nodesRects: NodesRectsMap;
  windowPositionModel: WindowPositionModel;
};
