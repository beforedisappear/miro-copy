import { useAddStickerViewModel } from './variants/add-sticker';
import { useIdleViewModel } from './variants/idle';
import type { ViewModel } from './view-model.types';
import type { ViewModelParams } from './view-model-params.types';

export function useViewModel(params: ViewModelParams) {
  let viewModel: ViewModel;

  const addStickerViewModel = useAddStickerViewModel(params);
  const idleViewModel = useIdleViewModel(params);

  switch (params.viewStateModel.viewState.type) {
    case 'idle': {
      viewModel = idleViewModel(params.viewStateModel.viewState);
      break;
    }
    case 'add-sticker': {
      viewModel = addStickerViewModel();
      break;
    }
    default:
      throw new Error('Invalid view model state');
  }

  return viewModel;
}
