import { useState } from 'react';

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

type Node = StickerNode;

export type NodesModel = ReturnType<typeof useNodes>;

export function useNodes() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'sticker', text: 'Hello', x: 100, y: 100 },
    { id: '2', type: 'sticker', text: 'World', x: 200, y: 200 },
  ]);

  const addSticker = (args: { text: string; x: number; y: number }) => {
    const { text, x, y } = args;

    setNodes(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'sticker', text, x, y },
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
    positions: { id: string; x: number; y: number }[];
  }) => {
    const { positions } = args;

    const record = Object.fromEntries(positions.map(p => [p.id, p]));

    setNodes(prev =>
      prev.map(node => {
        const newPosition = record[node.id];

        if (newPosition) {
          return { ...node, x: newPosition.x, y: newPosition.y };
        }

        return node;
      }),
    );
  };

  return {
    nodes,
    addSticker,
    deleteSticker,
    updateStickerText,
    updateNodesPositions,
  };
}
