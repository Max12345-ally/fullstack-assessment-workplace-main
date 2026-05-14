import React, { useEffect, useState } from 'react';

import { getNftStats } from '../api/requests/Transactions';
import useEthereumWallet from '../hooks/useEthereumWallet';
import { truncateEthereumAddress } from '../utils/truncateEthereumAddress';

const NFTStats = () => {
  const { account, isConnected, isConnecting, error, hasInjectedProvider, handleConnect } =
    useEthereumWallet();
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const data = await getNftStats();
        if (cancelled) return;
        setTotalNFTs(typeof data?.totalNFTs === 'number' ? data.totalNFTs : 0);
      } catch (e) {
        if (!cancelled) {
          let message = 'Failed to load NFT stats';
          if (typeof e === 'string') {
            message = e;
          } else if (e && typeof e === 'object' && 'message' in e && e.message != null) {
            message = String(e.message);
          }
          setApiError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const truncatedAddress = truncateEthereumAddress(account || '');

  if (loading) {
    return (
      <div
        className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-6"
        role="status"
        aria-live="polite"
      >
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500"
          aria-hidden="true"
        />
        <span className="sr-only">Loading NFT stats</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-slate-800">NFT stats</h1>

      {apiError ? (
        <p className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800" role="alert">
          {apiError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500">Total NFTs (API)</h2>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalNFTs}</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500">Wallet</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}
              aria-label={isConnected ? 'Wallet connected' : 'Wallet not connected'}
            >
              {isConnected ? 'Connected' : 'Not connected'}
            </span>
            {isConnected && truncatedAddress ? (
              <span
                className="font-mono text-sm text-slate-700"
                title={account || ''}
                aria-label={`Wallet address ${account}`}
              >
                {truncatedAddress}
              </span>
            ) : null}
          </div>
          {hasInjectedProvider && !isConnected ? (
            <>
              <button
                type="button"
                onClick={handleConnect}
                disabled={isConnecting}
                className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-60"
                aria-busy={isConnecting}
              >
                {isConnecting ? 'Connecting…' : 'Connect wallet'}
              </button>
              <p className="mt-2 max-w-sm text-xs text-slate-500">
                If the MetaMask window closes too fast, open the extension from the browser toolbar (fox icon) — the
                connection request may still be waiting there.
              </p>
            </>
          ) : null}
          {!hasInjectedProvider ? (
            <p className="mt-3 text-sm text-slate-600">Install MetaMask or another Web3 wallet to connect.</p>
          ) : null}
          {error ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error.message}
            </p>
          ) : null}
        </article>
      </div>
    </div>
  );
};

export default NFTStats;
