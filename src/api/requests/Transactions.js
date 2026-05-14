import Api from '../Api';

/**
 * @returns {Promise<{ totalNFTs: number, walletConnected: boolean }>}
 */
export const getNftStats = async () =>
  Api.http({
    method: 'get',
    url: '/transactions/nft-stats',
  });
