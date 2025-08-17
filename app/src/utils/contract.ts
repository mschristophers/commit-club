import { createPublicClient, http, parseEther, keccak256, stringToHex, defineChain } from 'viem';
import { FLOW_EVM_TESTNET, ENV } from '../lib/chain';

// Contract ABI for CommitClub
export const COMMIT_CLUB_ABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'stakeAmount', type: 'uint256' },
      { name: 'minCheckIns', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'codeHash', type: 'bytes32' }
    ],
    name: 'createCommit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'commitId', type: 'uint256' }
    ],
    name: 'joinCommit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'commitId', type: 'uint256' },
      { name: 'code', type: 'string' }
    ],
    name: 'checkIn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'commitId', type: 'uint256' }
    ],
    name: 'settleCommit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'commitId', type: 'uint256' }
    ],
    name: 'getCommit',
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'organizer', type: 'address' },
      { name: 'stakeAmount', type: 'uint256' },
      { name: 'minCheckIns', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'totalStaked', type: 'uint256' },
      { name: 'joiners', type: 'address[]' },
      { name: 'attendees', type: 'address[]' },
      { name: 'settled', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Define Flow EVM Testnet chain
const flowEVMTestnet = defineChain({
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

// Create public client for Flow EVM Testnet
export const publicClient = createPublicClient({
  chain: flowEVMTestnet,
  transport: http(ENV.RPC_URL)
});

// Contract address
export const COMMIT_CLUB_ADDRESS = ENV.CONTRACT_ADDRESS;

// Hash the secret code using keccak256
export function hashCode(code: string): `0x${string}` {
  return keccak256(stringToHex(code));
}

// Convert datetime to Unix timestamp
export function dateToTimestamp(dateString: string): bigint {
  return BigInt(Math.floor(new Date(dateString).getTime() / 1000));
}

// Convert FLOW amount to wei
export function flowToWei(flowAmount: string): bigint {
  return parseEther(flowAmount);
}

// Convert wei to FLOW
export function weiToFlow(weiAmount: bigint): string {
  return (Number(weiAmount) / 1e18).toFixed(6);
}
