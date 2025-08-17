'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';
import TopBar from '../../components/TopBar';
import { useToast } from '../../components/ToastContext';
import { COMMIT_CLUB_ABI, COMMIT_CLUB_ADDRESS, hashCode, dateToTimestamp, flowToWei } from '../../utils/contract';

export default function NewCommitment() {
  const { authenticated, ready, sendTransaction } = usePrivy();
  const { wallets } = useWallets();
  const { showToast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    stakeAmount: '',
    minCheckIns: '',
    deadline: '',
    code: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallets[0]) {
      showToast('No wallet connected', 'error');
      return;
    }

    setIsSubmitting(true);
    showToast('Creating commitment...', 'pending');

    try {
      // Hash the secret code
      const codeHash = hashCode(formData.code);
      
      // Convert values
      const stakeAmountWei = flowToWei(formData.stakeAmount);
      const deadlineTimestamp = dateToTimestamp(formData.deadline);
      const minCheckIns = BigInt(formData.minCheckIns);

      // Create the transaction using Privy's sendTransaction
      const { hash } = await sendTransaction({
        to: COMMIT_CLUB_ADDRESS,
        data: encodeFunctionData({
          abi: COMMIT_CLUB_ABI,
          functionName: 'createCommit',
          args: [
            formData.name,
            stakeAmountWei,
            minCheckIns,
            deadlineTimestamp,
            codeHash
          ],
        }),
      });
      
      showToast('Commitment created successfully!', 'success');
      
      // For now, we'll use a simple approach - in a real app you'd parse events
      const commitmentId = '1'; // This should be extracted from the transaction receipt
      
      // Navigate to the commitment page
      router.push(`/c/${commitmentId}`);
      
    } catch (error) {
      console.error('Error creating commitment:', error);
      showToast('Failed to create commitment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Please login to create a commitment
            </h2>
            <p className="text-gray-600">
              You need to be authenticated to create new commitments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar />
      
      <main className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Commitment
            </h1>
            <p className="text-gray-600">
              Set up a commitment that will bring people together
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Commitment Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="e.g., Central Park Morning Run"
              />
            </div>
            
            <div>
              <label htmlFor="stakeAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Stake Amount (FLOW)
              </label>
              <input
                type="number"
                id="stakeAmount"
                name="stakeAmount"
                value={formData.stakeAmount}
                onChange={handleInputChange}
                required
                min="0.001"
                step="0.001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="0.1"
              />
            </div>
            
            <div>
              <label htmlFor="minCheckIns" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Check-ins Required
              </label>
              <input
                type="number"
                id="minCheckIns"
                name="minCheckIns"
                value={formData.minCheckIns}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="3"
              />
            </div>
            
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Secret Check-in Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="e.g., morningrun2024"
              />
              <p className="mt-1 text-sm text-gray-500">
                This code will be used by participants to check in
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isSubmitting ? 'Creating...' : 'Create Commitment'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
