import { useState } from 'react';

export type IdleViewState = {
  type: 'idle';
  selectedIds: Set<string>;
};

export type AddStickerViewState = {
  type: 'add-sticker';
};

type ViewState = IdleViewState | AddStickerViewState;

type SelectionModifier = 'replace' | 'add' | 'toggle';

export type ViewStateModel = ReturnType<typeof useViewState>;

export function useViewState() {
  const [viewState, setViewState] = useState<ViewState>({
    type: 'idle',
    selectedIds: new Set(),
  });

  const goToIdle = () => {
    setViewState({ type: 'idle', selectedIds: new Set() });
  };

  const selection = (
    ids: string[],
    modifier: SelectionModifier = 'replace',
  ) => {
    setViewState(s => {
      if (s.type === 'idle') {
        return selectItems(s, ids, modifier);
      }

      return s;
    });
  };

  const goToAddSticker = () => {
    setViewState({ type: 'add-sticker' });
  };

  return { viewState, goToIdle, goToAddSticker, selection };
}

function selectItems(
  viewState: IdleViewState,
  ids: string[],
  modifier: SelectionModifier = 'replace',
) {
  if (modifier === 'replace') {
    return { ...viewState, selectedIds: new Set(ids) };
  }

  if (modifier === 'add') {
    return {
      ...viewState,
      selectedIds: new Set([...viewState.selectedIds, ...ids]),
    };
  }

  if (modifier === 'toggle') {
    const currentIds = new Set(viewState.selectedIds);

    const newIds = new Set(ids);

    const base = Array.from(viewState.selectedIds).filter(
      id => !newIds.has(id),
    );
    const added = ids.filter(id => !currentIds.has(id));

    return { ...viewState, selectedIds: new Set([...base, ...added]) };
  }

  return viewState;
}
