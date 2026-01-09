import type { KeyboardEvent, MouseEvent } from 'react';
import type { Rect } from '../domain/rect';
import type { WindowPosition } from '../model/window-position';

type ViewModelNode = {
  id: string;
  text: string;
  x: number;
  y: number;
  isSelected?: boolean;
  isEditing?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onTextChange?: (text: string) => void;
  onMouseDown?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLButtonElement>) => void;
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
  window?: {
    onMouseUp?: (e: globalThis.MouseEvent) => void;
    onMouseMove?: (e: globalThis.MouseEvent) => void;
    onMouseWheel?: (e: globalThis.WheelEvent) => void;
  };
  actions?: {
    addSticker: {
      onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
      isActive?: boolean;
    };
  };
  selectionWindow?: Rect;
  windowPosition?: WindowPosition;
  nodes?: ViewModelNode[];
};
