import {
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type Ref,
} from 'react';
import clsx from 'clsx';

export function Sticker(props: {
  ref: Ref<HTMLButtonElement>;
  id: string;
  text: string;
  x: number;
  y: number;
  isSelected?: boolean;
  isEditing?: boolean;
  onTextChange?: (text: string) => void;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const {
    ref,
    id,
    text,
    x,
    y,
    isSelected,
    isEditing,
    onClick,
    onTextChange,
    onMouseDown,
    onMouseUp,
  } = props;

  return (
    <button
      type='button'
      data-id={id}
      ref={ref}
      className={clsx(
        'absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md text-left',
        isSelected && 'outline-2 outline-blue-500',
      )}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <TextAreaAutoSize
        value={text}
        onChange={onTextChange}
        isEditing={isEditing}
      />
    </button>
  );
}

function TextAreaAutoSize(props: {
  value: string;
  onChange?: (value: string) => void;
  isEditing?: boolean;
}) {
  const { value, onChange, isEditing } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const { scrollWidth, clientHeight } = ref.current;

    setHeight(clientHeight);
    setWidth(scrollWidth);
  }, [value]);

  return (
    <div className='relative'>
      <div
        ref={ref}
        className={clsx('whitespace-pre-wrap', isEditing && 'opacity-0')}
      >
        {value}
      </div>
      {isEditing && (
        <textarea
          autoFocus
          className='absolute left-0 top-0 resize-none overflow-hidden'
          value={value}
          onChange={e => onChange?.(e.target.value)}
          style={{ width: width + 2, height: height + 2 }}
        />
      )}
    </div>
  );
}
