'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import { usePrivyWallet } from '../../hooks/usePrivyWallet';
import { useCommitClub } from '../../hooks/useCommitClub';
import { useUIStore, useChainStore } from '../../store/uiStore';

export default function NewCommitment() {
  const { connected, ready, login } = usePrivyWallet();
  const { createCommit } = useCommitClub();
  const { addToast } = useUIStore();
  const { selectedChain } = useChainStore();
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
    
    if (!connected) {
      addToast('Please connect your wallet first', 'error');
      return;
    }

    setIsSubmitting(true);
    addToast('Creating commitment...', 'pending');

    try {
      const hash = await createCommit({
        name: formData.name,
        stakeAmount: formData.stakeAmount,
        minCheckIns: parseInt(formData.minCheckIns),
        deadline: formData.deadline,
        code: formData.code,
      });
      
      addToast('Commitment created successfully!', 'success');
      
      // For now, we'll use a simple approach - in a real app you'd parse events
      const commitmentId = '1'; // This should be extracted from the transaction receipt
      
      // Navigate to the commitment page
      router.push(`/c/${commitmentId}`);
      
    } catch (error) {
      console.error('Error creating commitment:', error);
      addToast('Failed to create commitment', 'error');
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

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Please connect your wallet to create a commitment
            </h2>
            <p className="text-gray-600 mb-4">
              You need to connect your wallet to create new commitments.
            </p>
            <button
              onClick={login}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Connect Wallet
            </button>
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
                Stake Amount ({selectedChain.symbol})
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
