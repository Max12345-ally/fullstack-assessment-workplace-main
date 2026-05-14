import { useCallback, useEffect, useState } from 'react';

const getEthereum = () => (typeof window !== 'undefined' ? window.ethereum : undefined);

const WALLET_REQUEST_TIMEOUT_MS = 60000;

const useEthereumWallet = () => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const refreshAccounts = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) {
      setAccount(null);
      return;
    }
    try {
      const accounts = await eth.request({ method: 'eth_accounts' });
      setAccount(accounts?.[0] ?? null);
    } catch {
      setAccount(null);
    }
  }, []);

  useEffect(() => {
    refreshAccounts();
    const eth = getEthereum();
    if (!eth) {
      return undefined;
    }
    const handleAccountsChanged = (accounts) => {
      setAccount(accounts?.[0] ?? null);
    };
    const handleChainChanged = () => {
      refreshAccounts();
    };
    eth.on('accountsChanged', handleAccountsChanged);
    eth.on('chainChanged', handleChainChanged);
    return () => {
      eth.removeListener('accountsChanged', handleAccountsChanged);
      eth.removeListener('chainChanged', handleChainChanged);
    };
  }, [refreshAccounts]);

  const handleConnect = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) {
      setError(new Error('Install a wallet such as MetaMask to connect.'));
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const requestPromise = eth.request({ method: 'eth_requestAccounts' });
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              'Wallet request timed out. Unlock MetaMask, allow pop-ups for this site, then try again.'
            )
          );
        }, WALLET_REQUEST_TIMEOUT_MS);
      });
      const accounts = await Promise.race([requestPromise, timeoutPromise]);
      setAccount(accounts?.[0] ?? null);
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError : new Error('Connection rejected.'));
      setAccount(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return {
    account,
    isConnected: Boolean(account),
    isConnecting,
    error,
    hasInjectedProvider: Boolean(getEthereum()),
    handleConnect,
    refreshAccounts,
  };
};

export default useEthereumWallet;
