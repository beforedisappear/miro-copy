import { useState } from 'react';
import {
  useAddStickerViewModel,
  type AddStickerViewState,
} from './variants/add-sticker';
import { useIdleViewModel, type IdleViewState } from './variants/idle';
import {
  useSelectionWindowViewModel,
  type SelectionWindowViewState,
} from './variants/selection-window';

import { goToIdle } from './variants/idle';
import {
  useEditStickerViewModel,
  type EditStickerViewState,
} from './variants/edit-sticker';
import {
  useNodesDraggingViewModel,
  type NodesDraggingViewState,
} from './variants/nodes-dragging';
import {
  useWindowDraggingViewModel,
  type WindowDraggingViewState,
} from './variants/window-dragging';
import type { ViewModel } from './view-model.types';
import type { ViewModelParams } from './view-model-params.types';
import { useZoomDecorator } from './decorator/zoom';
import { useAddArrowViewModel } from './variants/add-arrow';
import type { AddArrowViewState } from './variants/add-arrow';
import { useCommonActionsDecorator } from './decorator/common-actions';
import { useDrawArrowViewModel } from './variants/draw-arrow';
import type { DrawArrowViewState } from './variants/draw-arrow';
import { useResolveRelativeStaticDecorator } from './decorator/resolve-relative';

export type ViewState =
  | IdleViewState
  | AddStickerViewState
  | AddArrowViewState
  | DrawArrowViewState
  | SelectionWindowViewState
  | EditStickerViewState
  | NodesDraggingViewState
  | WindowDraggingViewState;

export function useViewModel(params: Omit<ViewModelParams, 'setViewState'>) {
  const [viewState, setViewState] = useState<ViewState>(() => goToIdle());

  let viewModel: ViewModel;

  const newParams = { ...params, setViewState };

  const addStickerViewModel = useAddStickerViewModel(newParams);
  const addArrowViewModel = useAddArrowViewModel(newParams);
  const drawArrowViewModel = useDrawArrowViewModel(newParams);
  const editStickerViewModel = useEditStickerViewModel(newParams);
  const idleViewModel = useIdleViewModel(newParams);
  const selectionWindowViewModel = useSelectionWindowViewModel(newParams);
  const nodesDraggingViewModel = useNodesDraggingViewModel(newParams);
  const windowDraggingViewModel = useWindowDraggingViewModel(newParams);

  const zoomDecorator = useZoomDecorator(newParams);
  const commonActionsDecorator = useCommonActionsDecorator(newParams);

  switch (viewState.type) {
    case 'idle': {
      viewModel = idleViewModel(viewState);
      viewModel = commonActionsDecorator(viewModel);
      break;
    }
    case 'add-sticker': {
      viewModel = addStickerViewModel();
      viewModel = commonActionsDecorator(viewModel);
      break;
    }
    case 'add-arrow': {
      viewModel = addArrowViewModel();
      viewModel = commonActionsDecorator(viewModel);
      break;
    }
    case 'draw-arrow': {
      viewModel = drawArrowViewModel(viewState);
      break;
    }
    case 'selection-window': {
      viewModel = selectionWindowViewModel(viewState);
      break;
    }
    case 'edit-sticker': {
      viewModel = editStickerViewModel(viewState);
      break;
    }
    case 'nodes-dragging': {
      viewModel = nodesDraggingViewModel(viewState);
      break;
    }
    case 'window-dragging': {
      console.log('window-dragging', viewState);
      viewModel = windowDraggingViewModel(viewState);
      break;
    }
    default:
      throw new Error('Invalid view model state');
  }

  viewModel = useResolveRelativeStaticDecorator(viewModel);

  return zoomDecorator(viewModel);
}
