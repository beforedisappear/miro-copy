import { type Ref } from 'react';
import type { WindowPosition } from '../model/window-position';

export function Canvas(
  props: {
    children: React.ReactNode;
    ref: Ref<HTMLDivElement>;
    overlay?: React.ReactNode;
    windowPosition: WindowPosition;
  } & React.HTMLAttributes<HTMLDivElement>,
) {
  const { ref, children, overlay, windowPosition, ...rest } = props;

  return (
    <div
      {...rest}
      className='absolute inset-0 select-none overflow-hidden'
      ref={ref}
      onContextMenu={e => e.preventDefault()}
    >
      {overlay}

      <div
        style={{
          transformOrigin: 'top left',
          transform: `scale(${windowPosition.zoom}) translate(${-windowPosition.x}px, ${-windowPosition.y}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
