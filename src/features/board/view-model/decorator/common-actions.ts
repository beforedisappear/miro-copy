import { goToAddArrow } from '../variants/add-arrow';
import { goToAddSticker } from '../variants/add-sticker';
import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import type { KeyboardEvent } from 'react';

export function useCommonActionsDecorator(params: ViewModelParams) {
  return (viewModel: ViewModel) => {
    return {
      ...viewModel,
      layout: {
        onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
          viewModel.layout?.onKeyDown?.(e);

          if (e.key === 's') {
            params.setViewState(goToAddSticker());
          }
          if (e.key === 'a') {
            params.setViewState(goToAddArrow());
          }
        },
      },
      actions: {
        ...viewModel.actions,
        addArrow: {
          ...viewModel.actions?.addArrow,
          onClick: () => params.setViewState(goToAddArrow()),
        },
        addSticker: {
          ...viewModel.actions?.addSticker,
          onClick: () => params.setViewState(goToAddSticker()),
        },
      },
    };
  };
}
