import type { KeyboardEvent, MouseEvent } from 'react';

type ViewModelNode = {
  id: string;
  text: string;
  x: number;
  y: number;
  isSelected?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export type ViewModel = {
  layout?: {
    onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  };
  canvas?: {
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  };
  overlay?: {
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseUp?: (e: MouseEvent<HTMLDivElement>) => void;
  };
  actions?: {
    addSticker: {
      onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
      isActive?: boolean;
    };
  };
  nodes?: ViewModelNode[];
};
