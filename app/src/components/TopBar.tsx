'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';

export default function TopBar() {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { wallets } = useWallets();

  if (!ready) {
    return (
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Commit Club 🗽
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Loading...</div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Get the first wallet address (all wallets in the array are connected)
  const walletAddress = wallets[0]?.address;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Commit Club 🗽
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Network Badge */}
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Flow EVM Testnet
            </div>
            
            {/* Auth Button */}
            {authenticated ? (
              <div className="flex items-center space-x-3">
                {walletAddress && (
                  <span className="text-sm text-gray-600 font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                )}
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login with Email/SMS
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
