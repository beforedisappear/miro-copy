import { type MouseEvent } from 'react';

export function Overlay(props: {
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLDivElement>) => void;
}) {
  const { onClick, onMouseDown, onMouseUp } = props;

  return (
    <div
      className='absolute inset-0'
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    />
  );
}
