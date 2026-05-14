/**
 * @param {string | null | undefined} address
 * @returns {string}
 */
export const truncateEthereumAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return '';
  }
  const trimmed = address.trim();
  if (trimmed.length < 12) {
    return trimmed;
  }
  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
};
