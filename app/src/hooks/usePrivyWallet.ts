import { usePrivy, useWallets, useSendTransaction } from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';

/**
 * Custom hook that provides a simplified interface for Privy wallet operations
 * @returns Object containing wallet state and transaction methods
 */
export function usePrivyWallet() {
  const { authenticated, ready, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { sendTransaction } = useSendTransaction();

  // Get the first connected wallet
  const wallet = wallets[0];
  const address = wallet?.address;
  const connected = authenticated && !!wallet;

  /**
   * Send a transaction using the connected wallet
   * @param params - Transaction parameters
   * @param params.to - Recipient address
   * @param params.data - Transaction data (optional)
   * @param params.value - Transaction value in wei (optional)
   * @returns Promise resolving to transaction hash
   */
  const sendTx = async ({ to, data, value }: {
    to: `0x${string}`;
    data?: `0x${string}`;
    value?: bigint;
  }) => {
    if (!connected) {
      throw new Error('Wallet not connected');
    }

    const txParams: any = { 
      to,
      // Set a reasonable gas limit to prevent "intrinsic gas too low" errors
      gas: BigInt(500000)
    };
    
    if (data) txParams.data = data;
    if (value) txParams.value = value;

    const { hash } = await sendTransaction(txParams, {
      address: wallet.address
    });

    return hash;
  };

  /**
   * Send a contract transaction with encoded function data
   * @param params - Contract transaction parameters
   * @param params.to - Contract address
   * @param params.abi - Contract ABI
   * @param params.functionName - Function name to call
   * @param params.args - Function arguments
   * @param params.value - Transaction value in wei (optional)
   * @returns Promise resolving to transaction hash
   */
  const sendContractTx = async ({ to, abi, functionName, args, value }: {
    to: `0x${string}`;
    abi: any;
    functionName: string;
    args: any[];
    value?: bigint;
  }) => {
    const data = encodeFunctionData({
      abi,
      functionName,
      args,
    });

    return sendTx({ to, data, value });
  };

  return {
    address,
    connected,
    ready,
    login,
    logout,
    sendTx,
    sendContractTx,
  };
}
