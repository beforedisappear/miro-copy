import { useNodes } from './model/nodes';
import { StickerIcon } from 'lucide-react';
import { useCanvasRect } from './lib/use-canvas-rect';
import { useLayoutFocus } from './lib/use-layout-focus';
import { useViewModel } from './view-model/use-view-model';
import type { Rect } from './domain/rect';
import { useWindowEvents } from './lib/use-window-events';
import { Layout } from './ui/layout';
import { Dots } from './ui/dots';
import { Canvas } from './ui/canvas';
import { Overlay } from './ui/overlay';
import { Sticker } from './ui/sticker';
import { Actions } from './ui/actions';
import { ActionButton } from './ui/action-button';
import { useNodesDimensions } from './lib/use-nodes-dimensions';
import { useWindowPosition } from './model/window-position';

function BoardPage() {
  const nodesModel = useNodes();
  const windowPositionModel = useWindowPosition();
  const { canvasRef, canvasRect } = useCanvasRect();
  const { layoutRef } = useLayoutFocus();
  const { nodesRects, nodesRef } = useNodesDimensions();

  const viewModel = useViewModel({
    nodesModel,
    canvasRect,
    nodesRects,
    windowPositionModel,
  });

  useWindowEvents(viewModel);

  return (
    <Layout ref={layoutRef} onKeyDown={viewModel.layout?.onKeyDown}>
      <Dots />

      <Canvas
        ref={canvasRef}
        onClick={viewModel.canvas?.onClick}
        windowPosition={
          viewModel.windowPosition ?? windowPositionModel.position
        }
        overlay={
          <Overlay
            onClick={viewModel.overlay?.onClick}
            onMouseDown={viewModel.overlay?.onMouseDown}
            onMouseUp={viewModel.overlay?.onMouseUp}
          />
        }
      >
        {viewModel.nodes?.map(node => (
          <Sticker key={node.id} ref={nodesRef} {...node} />
        ))}

        {viewModel.selectionWindow && (
          <SelectionWindow rect={viewModel.selectionWindow} />
        )}
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

function SelectionWindow(props: { rect: Rect }) {
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
