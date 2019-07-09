import isMatchingFile from './isMatchingFile';

export default (
  list: DataTransferItemList,
  acceptVal: string,
  multiple: boolean
): DataTransferItem[] => {
  const dataItems = Array.from(list);

  if (acceptVal === '') {
    // Return the first item (or `undefined`) when our filter is for all files
    const files = dataItems.filter(item => item.kind === 'file');
    return multiple ? files : [files[0]];
  }

  // Split `accepts` values by ',' then by '/'. Trim everything & lowercase.
  const accepts = acceptVal
    .toLowerCase()
    .split(',')
    .map(accept => accept.split('/').map(part => part.trim()))
    .filter(acceptParts => acceptParts.length === 2); // Filter invalid values

  const matchingFiles = dataItems.filter(item => isMatchingFile(item, accepts));

  if (!matchingFiles.length) {
    return [];
  }

  return multiple ? matchingFiles : [matchingFiles[0]];
};
