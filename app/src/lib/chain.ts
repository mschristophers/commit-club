// Chain configurations
export const FLOW_EVM_TESTNET = {
  id: 545,
  name: "Flow EVM Testnet",
  rpcUrl: "https://testnet.evm.nodes.onflow.org",
  explorer: "https://evm-testnet.flowscan.io"
} as const;

export const ARBITRUM_SEPOLIA = {
  id: 421614,
  name: "Arbitrum Sepolia",
  rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
  explorer: "https://sepolia.arbiscan.io"
} as const;

export const BASE_SEPOLIA = {
  id: 84532,
  name: "Base Sepolia",
  rpcUrl: "https://sepolia.base.org",
  explorer: "https://sepolia.basescan.org"
} as const;

// Environment variables
export const ENV = {
  RPC_URL: process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC || FLOW_EVM_TESTNET.rpcUrl,
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_COMMIT_CLUB_ADDRESS as `0x${string}`,
  PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
} as const;

// Validate required environment variables
if (!ENV.CONTRACT_ADDRESS) {
  throw new Error('NEXT_PUBLIC_COMMIT_CLUB_ADDRESS is required');
}

if (!ENV.PRIVY_APP_ID) {
  throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is required');
}
