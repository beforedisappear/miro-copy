import type { KeyboardEvent, MouseEvent } from 'react';
import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import type { IdleViewState } from '../../model/view-state';

export function useIdleViewModel(params: ViewModelParams) {
  const { nodesModel, viewStateModel } = params;

  return (idleState: IdleViewState): ViewModel => ({
    nodes: nodesModel.nodes.map(node => ({
      ...node,
      isSelected: idleState.selectedIds.has(node.id),
      onClick: (e: MouseEvent<HTMLButtonElement>) => {
        if (e.ctrlKey || e.shiftKey || e.metaKey) {
          viewStateModel.selection([node.id], 'toggle');
        } else {
          viewStateModel.selection([node.id], 'replace');
        }
      },
    })),
    layout: {
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 's') return;

        viewStateModel.goToAddSticker();
      },
    },
    overlay: {
      onClick: () => {
        viewStateModel.selection([], 'replace');
      },
    },
    actions: {
      addSticker: {
        onClick: () => viewStateModel.goToAddSticker(),
        isActive: false,
      },
    },
  });
}
