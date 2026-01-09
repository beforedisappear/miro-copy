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
import { zoomHandler } from './decorator/zoom';

export type ViewState =
  | IdleViewState
  | AddStickerViewState
  | SelectionWindowViewState
  | EditStickerViewState
  | NodesDraggingViewState
  | WindowDraggingViewState;

export function useViewModel(params: Omit<ViewModelParams, 'setViewState'>) {
  const [viewState, setViewState] = useState<ViewState>(() => goToIdle());

  let viewModel: ViewModel;

  const newParams = { ...params, setViewState };

  const addStickerViewModel = useAddStickerViewModel(newParams);
  const editStickerViewModel = useEditStickerViewModel(newParams);
  const idleViewModel = useIdleViewModel(newParams);
  const selectionWindowViewModel = useSelectionWindowViewModel(newParams);
  const nodesDraggingViewModel = useNodesDraggingViewModel(newParams);
  const windowDraggingViewModel = useWindowDraggingViewModel(newParams);

  const zoomDecorator = zoomHandler(newParams);

  switch (viewState.type) {
    case 'idle': {
      viewModel = idleViewModel(viewState);
      break;
    }
    case 'add-sticker': {
      viewModel = addStickerViewModel();
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

  return zoomDecorator(viewModel);
}
