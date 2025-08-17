'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { FLOW_EVM_TESTNET, ARBITRUM_SEPOLIA, BASE_SEPOLIA, ENV } from '../lib/chain';

interface PrivyProviderWrapperProps {
  children: React.ReactNode;
}

export default function PrivyProviderWrapper({ children }: PrivyProviderWrapperProps) {
  return (
    <PrivyProvider
      appId={ENV.PRIVY_APP_ID!}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        },
        // Configure Flow EVM Testnet as default chain
        defaultChain: {
          id: FLOW_EVM_TESTNET.id,
          name: FLOW_EVM_TESTNET.name,
          rpcUrls: {
            default: {
              http: [ENV.RPC_URL]
            }
          },
          blockExplorers: {
            default: {
              name: 'Flowscan',
              url: FLOW_EVM_TESTNET.explorer
            }
          },
          nativeCurrency: {
            name: 'FLOW',
            symbol: 'FLOW',
            decimals: 18
          }
        },
        // Supported chains - multiple testnets for funding options
        supportedChains: [
          {
            id: FLOW_EVM_TESTNET.id,
            name: FLOW_EVM_TESTNET.name,
            rpcUrls: {
              default: {
                http: [ENV.RPC_URL]
              }
            },
            blockExplorers: {
              default: {
                name: 'Flowscan',
                url: FLOW_EVM_TESTNET.explorer
              }
            },
            nativeCurrency: {
              name: 'FLOW',
              symbol: 'FLOW',
              decimals: 18
            }
          },
          {
            id: ARBITRUM_SEPOLIA.id,
            name: ARBITRUM_SEPOLIA.name,
            rpcUrls: {
              default: {
                http: [ARBITRUM_SEPOLIA.rpcUrl]
              }
            },
            blockExplorers: {
              default: {
                name: 'Arbiscan',
                url: ARBITRUM_SEPOLIA.explorer
              }
            },
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18
            }
          },
          {
            id: BASE_SEPOLIA.id,
            name: BASE_SEPOLIA.name,
            rpcUrls: {
              default: {
                http: [BASE_SEPOLIA.rpcUrl]
              }
            },
            blockExplorers: {
              default: {
                name: 'Basescan',
                url: BASE_SEPOLIA.explorer
              }
            },
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18
            }
          }
        ],
        // Login methods
        loginMethods: ['email', 'sms'],
        // Appearance
        appearance: {
          theme: 'light',
          accentColor: '#2563eb', // blue-600
          showWalletLoginFirst: false
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}
