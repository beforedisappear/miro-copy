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

export type Node = StickerNode | ArrowNode;

export type NodesModel = ReturnType<typeof useNodes>;

export function useNodes() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'sticker', text: 'Hello', x: 100, y: 100 },
    { id: '2', type: 'sticker', text: 'World', x: 200, y: 200 },
    {
      id: '3',
      type: 'arrow',
      start: { x: 10, y: 10, relativeTo: '1' },
      end: { x: 20, y: 20, relativeTo: '2' },
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

  const deleteNodes = (ids: string[]) => {
    setNodes(lastNodes => {
      const arrowsRelativeIds = lastNodes
        .filter(
          node =>
            (node.type === 'arrow' &&
              node.start.relativeTo &&
              ids.includes(node.start.relativeTo)) ||
            (node.type === 'arrow' &&
              node.end.relativeTo &&
              ids.includes(node.end.relativeTo)),
        )
        .map(node => node.id);

      return lastNodes.filter(
        node => !ids.includes(node.id) && !arrowsRelativeIds.includes(node.id),
      );
    });
  };

  const updateStickerText = (args: { id: string; text: string }) => {
    const { id, text } = args;

    setNodes(prev =>
      prev.map(node => (node.id === id ? { ...node, text } : node)),
    );
  };

  const updateNodesPositions = (args: {
    positions: { id: string; point: Point; type?: 'start' | 'end' }[];
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
            start: newStartPosition?.point ?? node.start,
            end: newEndPosition?.point ?? node.end,
          };
        }

        const newPosition = record[node.id];

        return {
          ...node,
          x: newPosition?.point.x ?? node.x,
          y: newPosition?.point.y ?? node.y,
        };
      }),
    );
  };

  return {
    nodes,
    addSticker,
    addArrow,
    deleteNodes,
    updateStickerText,
    updateNodesPositions,
  };
}
