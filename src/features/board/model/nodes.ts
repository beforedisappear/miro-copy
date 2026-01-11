import { useState } from 'react';
import type { Point } from '../domain/point';

type NodeBase = {
  id: string;
  type: string;
};

type StickerNode = NodeBase & {
  type: 'sticker';
  text: string;
  x: number;
  y: number;
};

type ArrowNode = NodeBase & {
  type: 'arrow';
  start: Point;
  end: Point;
};

type Node = StickerNode | ArrowNode;

export type NodesModel = ReturnType<typeof useNodes>;

export function useNodes() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'sticker', text: 'Hello', x: 100, y: 100 },
    { id: '2', type: 'sticker', text: 'World', x: 200, y: 200 },
    {
      id: '3',
      type: 'arrow',
      start: { x: 110, y: 110 },
      end: { x: 210, y: 210 },
    },
  ]);

  const addSticker = (args: { text: string; x: number; y: number }) => {
    const { text, x, y } = args;

    setNodes(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'sticker', text, x, y },
    ]);
  };

  const addArrow = (args: { start: Point; end: Point }) => {
    const { start, end } = args;

    setNodes(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'arrow', start, end },
    ]);
  };

  const deleteSticker = (args: { ids: string[] }) => {
    const { ids } = args;

    setNodes(prev => prev.filter(node => !ids.includes(node.id)));
  };

  const updateStickerText = (args: { id: string; text: string }) => {
    const { id, text } = args;

    setNodes(prev =>
      prev.map(node => (node.id === id ? { ...node, text } : node)),
    );
  };

  const updateNodesPositions = (args: {
    positions: { id: string; x: number; y: number; type?: 'start' | 'end' }[];
  }) => {
    const { positions } = args;

    const record = Object.fromEntries(
      positions.map(p => [`${p.id}${p.type ?? ''}`, p]),
    );

    setNodes(prev =>
      prev.map(node => {
        if (node.type === 'arrow') {
          const newStartPosition = record[`${node.id}start`];
          const newEndPosition = record[`${node.id}end`];

          return {
            ...node,
            start: newStartPosition ?? node.start,
            end: newEndPosition ?? node.end,
          };
        }

        const newPosition = record[node.id];

        return {
          ...node,
          x: newPosition?.x ?? node.x,
          y: newPosition?.y ?? node.y,
        };
      }),
    );
  };

  return {
    nodes,
    addSticker,
    addArrow,
    deleteSticker,
    updateStickerText,
    updateNodesPositions,
  };
}
