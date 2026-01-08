import { Button } from '@/shared/ui/kit/button';

import { useNodes } from './model/nodes';
import { StickerIcon } from 'lucide-react';
import { useViewState } from './model/view-state';
import { useCanvasRect } from './lib/use-canvas-rect';
import { useLayoutFocus } from './lib/use-layout-focus';
import type { MouseEvent, Ref } from 'react';
import clsx from 'clsx';
import { useViewModel } from './view-model/use-view-model';

function BoardPage() {
  const nodesModel = useNodes();
  const viewStateModel = useViewState();
  const { canvasRef, canvasRect } = useCanvasRect();
  const { layoutRef } = useLayoutFocus();
  const viewModel = useViewModel({ nodesModel, viewStateModel, canvasRect });

  return (
    <Layout ref={layoutRef} onKeyDown={viewModel.layout?.onKeyDown}>
      <Dots />

      <Canvas ref={canvasRef} onClick={viewModel.canvas?.onClick}>
        <Overlay
          onClick={viewModel.overlay?.onClick}
          onMouseDown={viewModel.overlay?.onMouseDown}
          onMouseUp={viewModel.overlay?.onMouseUp}
        />

        {viewModel.nodes?.map(node => (
          <Sticker
            key={node.id}
            selected={node.isSelected ?? false}
            {...node}
          />
        ))}
      </Canvas>
      <Actions>
        <ActionButton
          isActive={viewModel.actions?.addSticker?.isActive ?? false}
          onClick={viewModel.actions?.addSticker?.onClick}
        >
          <StickerIcon />
        </ActionButton>
      </Actions>
    </Layout>
  );
}

export const Component = BoardPage;

function Overlay(props: {
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

function Layout({
  children,
  ref,
  ...props
}: {
  children: React.ReactNode;
  ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='grow relative' tabIndex={0} ref={ref} {...props}>
      {children}
    </div>
  );
}

function Dots() {
  return (
    <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'></div>
  );
}

function Canvas(
  props: {
    children: React.ReactNode;
    ref: Ref<HTMLDivElement>;
  } & React.HTMLAttributes<HTMLDivElement>,
) {
  const { ref, children, ...rest } = props;

  return (
    <div {...rest} className='absolute inset-0' ref={ref}>
      {children}
    </div>
  );
}

function Sticker(props: {
  text: string;
  x: number;
  y: number;
  selected: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const { text, x, y, selected, onClick } = props;

  return (
    <button
      type='button'
      className={clsx(
        'absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md',
        selected && 'outline-2 outline-blue-500',
      )}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div className='absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white p-1 rounded-md shadow'>
      {children}
    </div>
  );
}

function ActionButton({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <Button
      variant='ghost'
      size='icon'
      className={
        isActive
          ? 'bg-blue-500/30 hover:bg-blue-600/30 text-blue-500 hover:text-blue-600'
          : ''
      }
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
