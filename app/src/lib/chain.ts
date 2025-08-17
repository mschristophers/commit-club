// Flow EVM Testnet configuration
export const FLOW_EVM_TESTNET = {
  id: 545,
  name: "Flow EVM Testnet",
  rpcUrl: "https://testnet.evm.nodes.onflow.org",
  explorer: "https://evm-testnet.flowscan.io"
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
