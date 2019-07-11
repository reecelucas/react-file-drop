import * as React from 'react';
import { storiesOf } from '@storybook/react';
import FileDrop from '../index';

const RenderFileDrop = props => {
  const [isOver, setIsOver] = React.useState(false);
  const [validFile, setValidFile] = React.useState(false);

  const onDragEnter = ({ canDrop }) => {
    console.log('onEnter', canDrop);
    setIsOver(true);
    setValidFile(canDrop);
  };

  const onDragLeave = () => {
    console.log('onLeave');
    setIsOver(false);
  };

  const onFileDrop = files => {
    setIsOver(false);
    setValidFile(false);
    console.log('onFileDrop', { files });
  };

  const getStyles = () => ({
    background: `${!isOver ? 'transparent' : validFile ? 'green' : 'red'}`,
    border: '2px dashed #444',
    height: '200px',
    width: '200px'
  });

  return (
    <FileDrop
      onEnter={onDragEnter}
      onLeave={onDragLeave}
      onFileDrop={onFileDrop}
      style={getStyles()}
      {...props}
    />
  );
};

storiesOf('DatePicker', module)
  .add('Basic', () => <RenderFileDrop />)
  .add('Accepts', () => <RenderFileDrop accept={'image/*'} />)
  .add('Multiple', () => <RenderFileDrop multiple={true} />);
