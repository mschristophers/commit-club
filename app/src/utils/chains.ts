import { defineChain } from 'viem';

// Flow EVM Testnet configuration
export const flowEVMTestnet = defineChain({
  id: 545,
  name: 'Flow EVM Testnet',
  nativeCurrency: {
    name: 'FLOW',
    symbol: 'FLOW',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC || 'https://testnet.evm.nodes.onflow.org'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC || 'https://testnet.evm.nodes.onflow.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Flowscan',
      url: 'https://evm-testnet.flowscan.io',
    },
  },
});
