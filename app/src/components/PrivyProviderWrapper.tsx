'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { FLOW_EVM_TESTNET, ENV } from '../lib/chain';

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
        // Supported chains - only Flow EVM Testnet for now
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
