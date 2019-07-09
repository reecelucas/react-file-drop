export default (item: DataTransferItem, accepts: string[][]) => {
  if (item.kind !== 'file') {
    return false;
  }

  // Parse the MIME type
  const [typeMain, typeSub] = item.type
    .toLowerCase()
    .split('/')
    .map(s => s.trim());

  for (const [type, subtype] of accepts) {
    // Look for an exact match, or a partial match if `*` is accepted (E.g. `image/*`).
    if (typeMain === type && (subtype === '*' || typeSub === subtype)) {
      return true;
    }
  }

  return false;
};
