import type { MouseEvent } from 'react';
import type { IdleViewState } from '.';
import type { ViewModelParams } from '../../view-model-params.types';
import { goToEditSticker } from '../edit-sticker';

export function useGoToEditSticker(params: ViewModelParams) {
  const { setViewState } = params;

  const handleNodeClick = (
    e: MouseEvent<HTMLButtonElement>,
    idleState: IdleViewState,
    nodeId: string,
  ) => {
    if (
      idleState.selectedIds.has(nodeId) &&
      idleState.selectedIds.size === 1 &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.metaKey
    ) {
      const [id] = idleState.selectedIds.values();
      setViewState(goToEditSticker(id));
      return { preventNext: true };
    }

    return { preventNext: false };
  };

  return { handleNodeClick };
}
