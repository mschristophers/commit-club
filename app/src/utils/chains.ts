import { defineChain } from 'viem';
import { FLOW_EVM_TESTNET, ENV } from '../lib/chain';

// Flow EVM Testnet configuration
export const flowEVMTestnet = defineChain({
  id: FLOW_EVM_TESTNET.id,
  name: FLOW_EVM_TESTNET.name,
  nativeCurrency: {
    name: 'FLOW',
    symbol: 'FLOW',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [ENV.RPC_URL],
    },
    public: {
      http: [ENV.RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Flowscan',
      url: FLOW_EVM_TESTNET.explorer,
    },
  },
});
