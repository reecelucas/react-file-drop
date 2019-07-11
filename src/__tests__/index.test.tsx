import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import FileDrop from '../index';
import {
  noop,
  createFile,
  createDragEventObject,
  triggerEvent
} from './helpers';

import '@testing-library/jest-dom/extend-expect'; // tslint:disable-line:no-submodule-imports

afterEach(cleanup);

const renderDropzone = (props = {}) => {
  const { container } = render(<FileDrop onFileDrop={noop} {...props} />);
  return container.querySelector('div');
};

describe('FileDrop', () => {
  test('renders an empty <div>', () => {
    const dropzone = renderDropzone();
    expect(dropzone.tagName).toBe('DIV');
    expect(dropzone.children.length).toBe(0);
  });

  test('calls `onEnter` in response to `dragenter` event', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onEnter: spy });
    const files = [createFile('test.pdf', 'application/pdf')];
    const eventOpts = createDragEventObject(files);

    triggerEvent(dropzone, 'dragenter', eventOpts);
    expect(spy).toHaveBeenCalledTimes(1);

    triggerEvent(dropzone, 'dragleave', eventOpts);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('calls `onEnter` with `{ canDrop: true }` if `accept` is not provided', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onEnter: spy });
    const files = [createFile('test.pdf', 'application/pdf')];

    triggerEvent(dropzone, 'dragenter', createDragEventObject(files));
    expect(spy).toHaveBeenCalledWith({ canDrop: true });
  });

  test('calls `onEnter` with `{ canDrop: true }` if file `mime-type` matches `accept` value', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onEnter: spy, accept: 'image/*' });
    const files = [createFile('test.jpg', 'image/*')];

    triggerEvent(dropzone, 'dragenter', createDragEventObject(files));
    expect(spy).toHaveBeenCalledWith({ canDrop: true });
  });

  test('calls `onEnter` with `{ canDrop: false }` if file `mime-type` does not match `accept` value', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onEnter: spy, accept: 'image/*' });
    const files = [createFile('test.pdf', 'application/pdf')];

    triggerEvent(dropzone, 'dragenter', createDragEventObject(files));
    expect(spy).toHaveBeenCalledWith({ canDrop: false });
  });

  test('calls `onEnter` with `{ canDrop: false }` if the `event.dataTransfer` property is `null`', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onEnter: spy });

    triggerEvent(dropzone, 'dragenter', { dataTransfer: null });
    expect(spy).toHaveBeenCalledWith({ canDrop: false });
  });

  test('calls `onLeave` in response to `dragleave` event', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onLeave: spy });
    const files = [createFile('test.pdf', 'application/pdf')];
    const eventOpts = createDragEventObject(files);

    triggerEvent(dropzone, 'dragleave', eventOpts);
    expect(spy).toHaveBeenCalledTimes(1);

    triggerEvent(dropzone, 'dragenter', eventOpts);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('calls `onFileDrop` in response to `drop` event', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onFileDrop: spy });
    const files = [createFile('test.pdf', 'application/pdf')];
    const eventOpts = createDragEventObject(files);

    triggerEvent(dropzone, 'drop', eventOpts);
    expect(spy).toHaveBeenCalledTimes(1);

    triggerEvent(dropzone, 'dragend', eventOpts);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('calls `onFileDrop` with array of `File` objects', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onFileDrop: spy });
    const files = [createFile('test.pdf', 'application/pdf')];

    triggerEvent(dropzone, 'drop', createDragEventObject(files));
    expect(Array.isArray(spy.mock.calls[0])).toBe(true);
    expect(spy.mock.calls[0][0][0]).toBeInstanceOf(File);
  });

  test('calls `onFileDrop` with first `File` object when multiple files are dropped', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onFileDrop: spy });
    const files = [
      createFile('test.pdf', 'application/pdf'),
      createFile('test-two.jpg', 'image/*')
    ];

    triggerEvent(dropzone, 'drop', createDragEventObject(files));
    expect(spy.mock.calls[0][0]).toHaveLength(1);
    expect(spy.mock.calls[0][0][0].name).toBe('test.pdf');
  });

  test('calls `onFileDrop` with all `File` objects when multiple files are dropped and `multiple` is provided', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onFileDrop: spy, multiple: true });
    const files = [
      createFile('test.pdf', 'application/pdf'),
      createFile('test-two.jpg', 'image/*')
    ];

    triggerEvent(dropzone, 'drop', createDragEventObject(files));
    expect(spy.mock.calls[0][0]).toHaveLength(2);
    expect(spy.mock.calls[0][0][0].name).toBe('test.pdf');
    expect(spy.mock.calls[0][0][1].name).toBe('test-two.jpg');
  });

  test('calls `onFileDrop` with only matching `File` objects when multiple files are dropped and both `multiple` & `accept` are provided', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({
      onFileDrop: spy,
      multiple: true,
      accept: 'image/*'
    });
    const files = [
      createFile('test.pdf', 'application/pdf'),
      createFile('test-two.jpg', 'image/*'),
      createFile('test-three.jpg', 'image/*')
    ];

    triggerEvent(dropzone, 'drop', createDragEventObject(files));
    expect(spy.mock.calls[0][0]).toHaveLength(2);
    expect(spy.mock.calls[0][0][0].name).toBe('test-two.jpg');
    expect(spy.mock.calls[0][0][1].name).toBe('test-three.jpg');
  });

  test('does not call `onFileDrop` if no `File` object matches the `accept` value provided', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onFileDrop: spy, accept: 'image/*' });
    const files = [createFile('test.pdf', 'application/pdf')];

    triggerEvent(dropzone, 'drop', createDragEventObject(files));
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('does not call `onFileDrop` if the `event.dataTransfer` property is `null`', () => {
    const spy = jest.fn();
    const dropzone = renderDropzone({ onFileDrop: spy });

    triggerEvent(dropzone, 'drop', { dataTransfer: null });
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('spreads extra props over underlying <div>', () => {
    const dropzone = renderDropzone({
      'data-my-id': 'test',
      className: 'test'
    });

    expect(dropzone).toHaveAttribute('data-my-id', 'test');
    expect(dropzone).toHaveAttribute('class', 'test');
  });

  test('does not allow HTML Drag and Drop event handlers to be overridden by prop spreading', () => {
    const onDragOverSpy = jest.fn();
    const onDragEnterSpy = jest.fn();
    const onDropSpy = jest.fn();
    const onDragEndSpy = jest.fn();
    const onDragLeaveSpy = jest.fn();

    const dropzone = renderDropzone({
      onDragOver: onDragOverSpy,
      onDragEnter: onDragEnterSpy,
      onDrop: onDropSpy,
      onDragEnd: onDragEndSpy,
      onDragLeave: onDragLeaveSpy
    });
    const files = [createFile('test.pdf', 'application/pdf')];
    const eventOpts = createDragEventObject(files);

    triggerEvent(dropzone, 'dragover', eventOpts);
    expect(onDragOverSpy).toHaveBeenCalledTimes(0);

    triggerEvent(dropzone, 'dragenter', eventOpts);
    expect(onDragEnterSpy).toHaveBeenCalledTimes(0);

    triggerEvent(dropzone, 'drop', eventOpts);
    expect(onDropSpy).toHaveBeenCalledTimes(0);

    triggerEvent(dropzone, 'dragend', eventOpts);
    expect(onDragEndSpy).toHaveBeenCalledTimes(0);

    triggerEvent(dropzone, 'dragleave', eventOpts);
    expect(onDragLeaveSpy).toHaveBeenCalledTimes(0);
  });
});
