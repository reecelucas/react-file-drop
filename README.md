# react-file-drop

## Example Usage

```jsx
import FileDrop from './index';

// Basic
<FileDrop
  onEnter={(canDrop) => console.log(`file can be dropped: "${canDrop}"`)}
  onLeave={() => console.log('user has dragged away from drop target')}
  onFileDrop={({ files, action }) => console.log({ files, actions })}
/>

// Accept file of specified mime-type
<FileDrop accept="image/*" />

// Accept multiple files
<FileDrop multiple={true} />
```
