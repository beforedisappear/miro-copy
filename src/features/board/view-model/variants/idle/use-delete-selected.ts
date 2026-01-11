import type { ViewModelParams } from '../../view-model-params.types';
import type { IdleViewState } from '.';
import type { KeyboardEvent } from 'react';
import { goToIdle } from '.';

export function useDeleteSelected(params: ViewModelParams) {
  const { nodesModel, setViewState } = params;

  const handleKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    viewState: IdleViewState,
  ) => {
    if (e.key === 'delete' || e.key === 'Backspace') {
      if (viewState.selectedIds.size > 0) {
        const ids = Array.from(viewState.selectedIds);

        nodesModel.deleteNodes(ids);

        setViewState(goToIdle({ selectedIds: new Set() }));
      }
    }
  };

  return { handleKeyDown };
}
