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

  return { nodes, addSticker };
}
