import * as React from 'react';
import getMatchingDataItems from './helpers/getMatchingDataItems';
import getMatchingFiles from './helpers/getMatchingFiles';
import isFunction from './helpers/isFunction';

interface Props extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  onEnter?: (canDrop: boolean) => void;
  onLeave?: () => void;
  onFileDrop: (files: File[]) => void;
}

const FileDrop = ({
  children,
  accept = '',
  multiple = false,
  onEnter,
  onLeave,
  onFileDrop,
  ...props
}: Props) => {
  const dragEnterCount = React.useRef(0);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const onDragEnter = ({ dataTransfer }: React.DragEvent) => {
    dragEnterCount.current += 1;

    if (dragEnterCount.current > 1 || !isFunction(onEnter)) {
      return;
    }

    if (dataTransfer === null) {
      onEnter(false);
      return;
    }

    const files = getMatchingDataItems(dataTransfer.items, accept, multiple);

    /**
     * Safari doesn't give file information on drag enter, so the best
     * we can do is return valid (true).
     */
    const validDrop: boolean =
      dataTransfer && dataTransfer.items.length ? files[0] !== undefined : true;

    onEnter(validDrop);
  };

  const onDragLeave = () => {
    dragEnterCount.current -= 1;

    if (isFunction(onLeave)) {
      onLeave();
    }
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    if (event.dataTransfer === null) {
      return;
    }

    dragEnterCount.current = 0;
    const files = getMatchingFiles(event.dataTransfer, accept, multiple);

    if (files.length > 0) {
      onFileDrop(files);
    }
  };

  const onDragEnd = () => {
    dragEnterCount.current = 0;
  };

  return (
    <div
      // Spread props before binding handlers to ensure consumers can't override them
      {...props}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onDragLeave={onDragLeave}
    >
      {children}
    </div>
  );
};

export default FileDrop;
