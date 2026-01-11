import type { Point } from '../../domain/point';
import { diffPoints } from '../../domain/point';
import type { MouseEvent, Ref } from 'react';
import clsx from 'clsx';

export function Arrow(props: {
  ref: Ref<SVGPathElement>;
  start: Point;
  end: Point;
  isSelected?: boolean;
  noPointerEvents?: boolean;
  onClick?: (e: MouseEvent<SVGPathElement>) => void;
  onMouseDown?: (e: MouseEvent<SVGPathElement>) => void;
  onMouseUp?: (e: MouseEvent<SVGPathElement>) => void;
}) {
  const {
    ref,
    start,
    end,
    isSelected,
    noPointerEvents,
    onClick,
    onMouseDown,
    onMouseUp,
  } = props;

  const vector = diffPoints(start, end);
  const angle = Math.atan2(vector.y, vector.x);
  const delta = Math.PI * (1 - 1 / 6);
  const arrowRigthAngle = angle + delta;
  const arrowLeftAngle = angle - delta;

  const arrowRightDiff = [
    Math.cos(arrowRigthAngle) * 10,
    Math.sin(arrowRigthAngle) * 10,
  ];
  const arrowLeftDiff = [
    Math.cos(arrowLeftAngle) * 10,
    Math.sin(arrowLeftAngle) * 10,
  ];

  return (
    <svg className='absolute top-0 left-0 pointer-events-none overflow-visible'>
      <path
        ref={ref}
        stroke='black'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        className={clsx(
          'pointer-events-auto transition-[stroke,fill] duration-300 hover:stroke-blue-500 hover:fill-blue-500',
          isSelected && 'stroke-blue-500 stroke-2 fill-blue-500',
          noPointerEvents && 'pointer-events-none',
        )}
        d={`
          M ${start.x} ${start.y} L ${end.x} ${end.y} 
          M ${end.x} ${end.y} L ${end.x + arrowRightDiff[0]} ${end.y + arrowRightDiff[1]} 
          L ${end.x + -5 * Math.cos(angle)} ${end.y + -5 * Math.sin(angle)}
          L ${end.x + arrowLeftDiff[0]} ${end.y + arrowLeftDiff[1]}
          L ${end.x} ${end.y}
          `}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
    </svg>
  );
}
