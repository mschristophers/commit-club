import { createPublicClient, http, parseEther, keccak256, stringToHex } from 'viem';
import { flowEVMTestnet } from './chains';

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

// Create public client for Flow EVM Testnet
export const publicClient = createPublicClient({
  chain: flowEVMTestnet,
  transport: http(process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC || 'https://testnet.evm.nodes.onflow.org')
});

// Contract address
export const COMMIT_CLUB_ADDRESS = process.env.NEXT_PUBLIC_COMMIT_CLUB_ADDRESS as `0x${string}`;

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
