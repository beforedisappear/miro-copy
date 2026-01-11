import { useNodes } from './model/nodes';
import { ArrowUpRight, StickerIcon } from 'lucide-react';
import { useCanvasRect } from './lib/use-canvas-rect';
import { useLayoutFocus } from './lib/use-layout-focus';
import { useViewModel } from './view-model/use-view-model';
import { useWindowEvents } from './lib/use-window-events';
import { Layout } from './ui/layout';
import { Dots } from './ui/dots';
import { Canvas } from './ui/canvas';
import { Overlay } from './ui/overlay';
import { Sticker } from './ui/nodes/sticker';
import { Actions } from './ui/actions';
import { ActionButton } from './ui/action-button';
import { useNodesDimensions } from './lib/use-nodes-dimensions';
import { useWindowPosition } from './model/window-position';
import { SelectionWindow } from './ui/selection-window';
import { Arrow } from './ui/nodes/arrow';

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
      <Dots
        windowPosition={
          viewModel.windowPosition ?? windowPositionModel.position
        }
      />

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
        {viewModel.nodes?.map(node => {
          if (node.type === 'sticker') {
            return <Sticker key={node.id} ref={nodesRef} {...node} />;
          }

          if (node.type === 'arrow') {
            return <Arrow key={node.id} ref={nodesRef} {...node} />;
          }

          return null;
        })}

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
        <ActionButton
          isActive={viewModel.actions?.addArrow?.isActive ?? false}
          onClick={viewModel.actions?.addArrow?.onClick}
        >
          <ArrowUpRight />
        </ActionButton>
      </Actions>
    </Layout>
  );
}

export const Component = BoardPage;
