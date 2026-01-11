import type { ViewModelParams } from '../view-model-params.types';
import type { ViewModel } from '../view-model.types';
import type { KeyboardEvent } from 'react';
import { goToIdle } from './idle';

export type EditStickerViewState = {
  type: 'edit-sticker';
  stickerId: string;
  newText?: string;
};

export function useEditStickerViewModel(params: ViewModelParams) {
  const { nodesModel, setViewState } = params;

  const confirmTextChange = (viewState: EditStickerViewState) => {
    if (viewState.newText) {
      nodesModel.updateStickerText({
        id: viewState.stickerId,
        text: viewState.newText,
      });
    }
  };

  const getNodes = (viewState: EditStickerViewState) => {
    return nodesModel.nodes.map(node => {
      if (node.id === viewState.stickerId && node.type === 'sticker') {
        return {
          ...node,
          isSelected: true,
          isEditing: true,
          text: viewState.newText ?? node.text,
          onTextChange: (text: string) => {
            setViewState({ ...viewState, newText: text });
          },
        };
      }

      return node;
    });
  };

  return (viewState: EditStickerViewState): ViewModel => ({
    nodes: getNodes(viewState),
    layout: {
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
          confirmTextChange(viewState);
          setViewState(goToIdle());
        }
      },
    },
    overlay: {
      onClick: () => {
        confirmTextChange(viewState);
        setViewState(goToIdle());
      },
    },
  });
}

export function goToEditSticker(stickerId: string): EditStickerViewState {
  return { type: 'edit-sticker', stickerId };
}
