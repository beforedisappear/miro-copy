import type { WindowPosition } from '../model/window-position';

export function Dots(props: { windowPosition: WindowPosition }) {
  const { windowPosition } = props;

  return (
    <div
      style={
        {
          '--zoom': windowPosition.zoom.toString(),
          '--x': -windowPosition.x * windowPosition.zoom + 'px',
          '--y': -windowPosition.y * windowPosition.zoom + 'px',
        } as React.CSSProperties
      }
      className='absolute 
      inset-0 
      bg-[radial-gradient(#e5e7eb_calc(1px*var(--zoom)),transparent_calc(1px*var(--zoom)))] 
      bg-position-[var(--x)_var(--y)]
      bg-size-[calc(16px*var(--zoom))_calc(16px*var(--zoom))]'
    />
  );
}
