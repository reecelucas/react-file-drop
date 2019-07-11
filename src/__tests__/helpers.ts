import { fireEvent } from '@testing-library/react';

export const noop = () => ({});

export const createFile = (name, type) => new File([], name, { type });

export const createDragEventObject = (files: File[] = []) => ({
  dataTransfer: {
    files,
    items: files.map(file => ({
      kind: 'file',
      type: file.type,
      getAsFile: () => file
    })),
    types: ['Files']
  }
});

export const triggerEvent = (node, type, data) => {
  const event = new Event(type, { bubbles: true });

  if (data) {
    Object.assign(event, data);
  }

  fireEvent(node, event);
};
