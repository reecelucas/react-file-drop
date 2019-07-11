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
    // Prevent default to allow drop
    event.preventDefault();
  };

  const onDragEnter = ({ dataTransfer }: React.DragEvent) => {
    dragEnterCount.current += 1;

    if (!isFunction(onEnter) || dragEnterCount.current > 1) {
      return;
    }

    if (dataTransfer === null) {
      onEnter(false);
      return;
    }

    /**
     * The `dragenter` event doesn't give us information about item `type`, so we can't
     * use `getMatchingFiles` here. We can only check to see whether the dragged items
     * are of the correct `mime-type`. This means `canDrop` will be true for directories
     * if the `accept` prop is not specified (or is set to '*').
     */
    const items = getMatchingDataItems(dataTransfer.items, accept, multiple);

    /**
     * Safari doesn't give us any information on `dragenter`, so the best
     * we can do is return valid (true).
     */
    const validDrop: boolean =
      dataTransfer && dataTransfer.items.length ? items[0] !== undefined : true;

    onEnter(validDrop);
  };

  const onDragLeave = () => {
    dragEnterCount.current -= 1;

    if (isFunction(onLeave)) {
      onLeave();
    }
  };

  const onDrop = (event: React.DragEvent) => {
    // Prevent default action (open as link for some elements)
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

  // Spread props before binding handlers to ensure consumers can't override them
  return (
    <div
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
