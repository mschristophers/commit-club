import { usePrivyWallet } from './usePrivyWallet';
import { COMMIT_CLUB_ABI, hashCode, dateToTimestamp, flowToWei } from '../utils/contract';
import { ENV } from '../lib/chain';

/**
 * Custom hook that provides CommitClub contract interaction methods
 * @returns Object containing contract interaction methods
 */
export function useCommitClub() {
  const { sendContractTx } = usePrivyWallet();

  /**
   * Create a new commitment
   * @param params - Commitment creation parameters
   * @returns Promise resolving to transaction hash
   */
  const createCommit = async ({ name, stakeAmount, minCheckIns, deadline, code }: {
    name: string;
    stakeAmount: string; // FLOW amount
    minCheckIns: number;
    deadline: string; // ISO date string
    code: string; // Secret check-in code
  }) => {
    const codeHash = hashCode(code);
    const stakeAmountWei = flowToWei(stakeAmount);
    const deadlineTimestamp = dateToTimestamp(deadline);
    const minCheckInsBigInt = BigInt(minCheckIns);

    return sendContractTx({
      to: ENV.CONTRACT_ADDRESS,
      abi: COMMIT_CLUB_ABI,
      functionName: 'createCommit',
      args: [name, stakeAmountWei, minCheckInsBigInt, deadlineTimestamp, codeHash],
    });
  };

  /**
   * Join a commitment by sending stake amount
   * @param params - Join parameters
   * @returns Promise resolving to transaction hash
   */
  const joinCommit = async ({ commitId, stakeAmount }: {
    commitId: string | number;
    stakeAmount: string; // FLOW amount
  }) => {
    const stakeAmountWei = flowToWei(stakeAmount);

    return sendContractTx({
      to: ENV.CONTRACT_ADDRESS,
      abi: COMMIT_CLUB_ABI,
      functionName: 'joinCommit',
      args: [BigInt(commitId)],
      value: stakeAmountWei,
    });
  };

  /**
   * Check in to a commitment using secret code
   * @param params - Check-in parameters
   * @returns Promise resolving to transaction hash
   */
  const checkIn = async ({ commitId, code }: {
    commitId: string | number;
    code: string; // Secret check-in code
  }) => {
    return sendContractTx({
      to: ENV.CONTRACT_ADDRESS,
      abi: COMMIT_CLUB_ABI,
      functionName: 'checkIn',
      args: [BigInt(commitId), code],
    });
  };

  /**
   * Settle a commitment (anyone can call)
   * @param params - Settle parameters
   * @returns Promise resolving to transaction hash
   */
  const settleCommit = async ({ commitId }: {
    commitId: string | number;
  }) => {
    return sendContractTx({
      to: ENV.CONTRACT_ADDRESS,
      abi: COMMIT_CLUB_ABI,
      functionName: 'settleCommit',
      args: [BigInt(commitId)],
    });
  };

  return {
    createCommit,
    joinCommit,
    checkIn,
    settleCommit,
  };
}
