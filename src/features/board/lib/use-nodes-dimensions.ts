import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefCallback,
} from 'react';

type NodeRect = {
  width: number;
  height: number;
};

export type NodesRectsMap = Record<string, NodeRect>;

export function useNodesDimensions() {
  const [nodesRects, setNodesRects] = useState<NodesRectsMap>({});

  const resizeObserverRef = useRef<ResizeObserver | undefined>(undefined);

  const nodesRef: RefCallback<Element> = useCallback(el => {
    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(entries => {
        const nodesToUpdate = Object.fromEntries(
          entries
            .map(entry => [
              (entry.target as HTMLElement).dataset.id as string,
              {
                width: entry.borderBoxSize[0].inlineSize,
                height: entry.borderBoxSize[0].blockSize,
              },
            ])
            .filter(entry => !!entry[0]),
        );

        setNodesRects(prev => ({ ...prev, ...nodesToUpdate }));
      });
    }

    const resizeObserver = resizeObserverRef.current;

    if (!el) return;

    resizeObserver.observe(el);

    return () => {
      setNodesRects(prev => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [(el as HTMLElement).dataset.id as string]: _, ...rest } = prev;

        return rest;
      });
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  return { nodesRects, nodesRef };
}
