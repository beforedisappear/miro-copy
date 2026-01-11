import type { KeyboardEvent, MouseEvent } from 'react';
import type { Rect } from '../domain/rect';
import type { WindowPosition } from '../model/window-position';
import type { Point } from '../domain/point';

type ViewModelStickerNode = {
  id: string;
  type: 'sticker';
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

type ViewModelArrowNode = {
  id: string;
  type: 'arrow';
  start: Point;
  end: Point;
  isSelected?: boolean;
  onClick?: (e: MouseEvent<SVGPathElement>) => void;
  onMouseDown?: (e: MouseEvent<SVGPathElement>) => void;
  onMouseUp?: (e: MouseEvent<SVGPathElement>) => void;
};

type ViewModelNode = ViewModelStickerNode | ViewModelArrowNode;

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
