import getMatchingDataItems from './getMatchingDataItems';

export default (
  data: DataTransfer,
  accept: string,
  multiple: boolean
): File[] => {
  const dragDataItems = getMatchingDataItems(data.items, accept, multiple);
  return dragDataItems.map(item => item.getAsFile() as File).filter(Boolean); // Filter `null` entries
};
