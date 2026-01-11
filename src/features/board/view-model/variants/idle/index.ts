import type { KeyboardEvent, MouseEvent } from 'react';
import type { ViewModelParams } from '../../view-model-params.types';
import type { ViewModel } from '../../view-model.types';
import { useSelection } from './use-selection';
import { useDeleteSelected } from './use-delete-selected';
import { useGoToEditSticker } from './use-go-to-edit-sticker';
import { useMouseDown } from './use-mouse-down';
import { useGoToSelectionWindow } from './use-go-to-selection-window';
import { useGoToNodesDragging } from './use-go-to-nodes-dragging';
import { useGoToWindowDragging } from './use-go-to-window-dragging';

export type IdleViewState = {
  type: 'idle';
  selectedIds: Set<string>;
  mouseDown?:
    | {
        type: 'overlay';
        x: number;
        y: number;
        isRightClick: boolean;
      }
    | {
        type: 'node';
        nodeId: string;
        x: number;
        y: number;
        isRightClick: boolean;
      };
};

export function useIdleViewModel(params: ViewModelParams) {
  const { nodesModel } = params;

  const selection = useSelection(params);
  const deleteSelected = useDeleteSelected(params);
  const goToEditSticker = useGoToEditSticker(params);
  const goToSelectionWindow = useGoToSelectionWindow(params);
  const goToNodesDragging = useGoToNodesDragging(params);
  const goToWindowDragging = useGoToWindowDragging(params);
  const mouseDown = useMouseDown(params);

  const getNodes = (idleState: IdleViewState) => {
    return nodesModel.nodes.map(node => ({
      ...node,
      isSelected: selection.isSelected(idleState, node.id),
      onMouseDown: (e: MouseEvent) => {
        mouseDown.handleNodeMouseDown(e, idleState, node.id);
      },
      onMouseUp: (e: MouseEvent) => {
        // если mouseDown не на этом же стикере, то не нужно ничего делать
        if (!mouseDown.getIsStickerMouseDown(idleState, node.id)) {
          return;
        }

        const result = goToEditSticker.handleNodeClick(e, idleState, node.id);

        if (result.preventNext) return;

        selection.handleNodeClick(e, idleState, node.id);
      },
    }));
  };

  return (idleState: IdleViewState): ViewModel => ({
    nodes: getNodes(idleState),
    layout: {
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        deleteSelected.handleKeyDown(e, idleState);
      },
    },
    overlay: {
      onMouseDown: (e: MouseEvent<HTMLDivElement>) => {
        mouseDown.handleOverlayMouseDown(e, idleState);
      },
      onMouseUp: () => {
        selection.handleOverlayMouseUp(idleState);
      },
    },
    window: {
      onMouseMove: (e: globalThis.MouseEvent) => {
        goToNodesDragging.handleWindowMouseMove(e, idleState);
        goToSelectionWindow.handleWindowMouseMove(e, idleState);
        goToWindowDragging.handleWindowMouseMove(e, idleState);
      },
      onMouseUp: () => {
        mouseDown.handleWindowMouseUp(idleState);
      },
    },
  });
}

export function goToIdle(
  args: { selectedIds?: Set<string> } = {},
): IdleViewState {
  const { selectedIds } = args;

  return { type: 'idle', selectedIds: selectedIds ?? new Set() };
}
