import { useMemo } from 'react';
import {
  isRelativePoint,
  resolveRelativePoint,
  type RelativeBase,
} from '../../domain/point';
import type { Node } from '../../model/nodes';
import type { ViewModel } from '../view-model.types';

export function createRelativeBase(nodes: Node[]): RelativeBase {
  const base = Object.fromEntries(
    nodes.filter(node => node.type === 'sticker').map(node => [node.id, node]),
  );

  return base;
}

function resolveRelativePoints(nodes: Node[], base: RelativeBase): Node[] {
  return nodes.map(node => {
    if (node.type === 'arrow') {
      let newNode = node;

      if (isRelativePoint(newNode.start)) {
        const newStart = resolveRelativePoint(base, newNode.start);

        newNode = { ...newNode, start: newStart };
      }

      if (isRelativePoint(newNode.end)) {
        const newEnd = resolveRelativePoint(base, newNode.end);
        newNode = { ...newNode, end: newEnd };
      }

      return newNode;
    }

    return node;
  });
}

export function useResolveRelativeStaticDecorator(
  viewModel: ViewModel,
): ViewModel {
  const nodes = useMemo(() => {
    const relativeBase = createRelativeBase(viewModel.nodes ?? []);
    return resolveRelativePoints(viewModel.nodes ?? [], relativeBase);
  }, [viewModel.nodes]);

  return { ...viewModel, nodes };
}
