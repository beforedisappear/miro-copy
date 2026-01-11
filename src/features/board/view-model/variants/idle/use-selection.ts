import type { IdleViewState } from '.';
import { selectItems, type SelectionModifier } from '../../../domain/selection';
import type { ViewModelParams } from '../../view-model-params.types';
import type { MouseEvent } from 'react';

export function useSelection(params: ViewModelParams) {
  const { setViewState } = params;

  const select = (
    lastState: IdleViewState,
    ids: string[],
    modifier: SelectionModifier,
  ) => {
    setViewState({
      ...lastState,
      selectedIds: selectItems(lastState.selectedIds, ids, modifier),
    });
  };

  const handleNodeClick = (
    e: MouseEvent,
    idleState: IdleViewState,
    nodeId: string,
  ) => {
    if (e.ctrlKey || e.shiftKey || e.metaKey) {
      select(idleState, [nodeId], 'toggle');
    } else {
      select(idleState, [nodeId], 'replace');
    }
  };

  const handleOverlayMouseUp = (idleState: IdleViewState) => {
    if (idleState.mouseDown) {
      select(idleState, [], 'replace');
    }
  };

  const isSelected = (idleState: IdleViewState, nodeId: string) => {
    return idleState.selectedIds.has(nodeId);
  };

  return { handleNodeClick, handleOverlayMouseUp, isSelected };
}
