import type { Rect } from '../domain/rect';

export function SelectionWindow(props: { rect: Rect }) {
  const {
    rect: { x, y, width, height },
  } = props;

  return (
    <div
      className='absolute inset-0 bg-blue-500/20 border-2 border-blue-500'
      style={{
        transform: `translate(${x}px, ${y}px)`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}
