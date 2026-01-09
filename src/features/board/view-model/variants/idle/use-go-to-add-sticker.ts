import type { KeyboardEvent } from 'react';
import type { ViewModelParams } from '../../view-model-params.types';
import { goToAddSticker } from '../add-sticker';

export function useGotoAddSticker(params: ViewModelParams) {
  const { setViewState } = params;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 's') {
      setViewState(goToAddSticker());
    }
  };

  const handleActionClick = () => {
    setViewState(goToAddSticker());
  };

  return { handleKeyDown, handleActionClick };
}
