'use client';

import { PrivyProvider } from '@privy-io/react-auth';

interface PrivyProviderWrapperProps {
  children: React.ReactNode;
}

export default function PrivyProviderWrapper({ children }: PrivyProviderWrapperProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        },
        // Configure Flow EVM Testnet as default chain
        defaultChain: {
          id: 545,
          name: 'Flow EVM Testnet',
          rpcUrls: {
            default: {
              http: [process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC || 'https://testnet.evm.nodes.onflow.org']
            }
          },
          blockExplorers: {
            default: {
              name: 'Flowscan',
              url: 'https://evm-testnet.flowscan.io'
            }
          },
          nativeCurrency: {
            name: 'FLOW',
            symbol: 'FLOW',
            decimals: 18
          }
        },
        // Supported chains - only Flow EVM Testnet for now
        supportedChains: [
          {
            id: 545,
            name: 'Flow EVM Testnet',
            rpcUrls: {
              default: {
                http: [process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC || 'https://testnet.evm.nodes.onflow.org']
              }
            },
            blockExplorers: {
              default: {
                name: 'Flowscan',
                url: 'https://evm-testnet.flowscan.io'
              }
            },
            nativeCurrency: {
              name: 'FLOW',
              symbol: 'FLOW',
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
