'use client';

import { usePrivy } from '@privy-io/react-auth';

interface CommitmentDetailsProps {
  commitmentId: string;
}

export default function CommitmentDetails({ commitmentId }: CommitmentDetailsProps) {
  const { authenticated, ready } = usePrivy();

  // Mock data for now - will be replaced with actual contract calls
  const mockCommitment = {
    id: commitmentId,
    name: 'Central Park Morning Run',
    organizer: '0x1234...5678',
    stakeAmount: '0.1',
    minCheckIns: 3,
    deadline: '2024-12-31T23:59:59',
    totalStaked: '0.5',
    joiners: ['0x1234...5678', '0x8765...4321'],
    attendees: ['0x1234...5678'],
    settled: false
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mockCommitment.name}
            </h1>
            <p className="text-gray-600">
              Commitment #{commitmentId}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">
              Active
            </div>
            <p className="text-sm text-gray-500">
              Organized by {mockCommitment.organizer}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Stake Amount</h3>
            <p className="text-2xl font-bold text-gray-900">{mockCommitment.stakeAmount} FLOW</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Min Check-ins</h3>
            <p className="text-2xl font-bold text-gray-900">{mockCommitment.minCheckIns}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Staked</h3>
            <p className="text-2xl font-bold text-gray-900">{mockCommitment.totalStaked} FLOW</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Deadline</dt>
              <dd className="text-sm text-gray-900">
                {new Date(mockCommitment.deadline).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Participants</dt>
              <dd className="text-sm text-gray-900">{mockCommitment.joiners.length}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Check-ins</dt>
              <dd className="text-sm text-gray-900">{mockCommitment.attendees.length}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="text-sm text-gray-900">
                {mockCommitment.settled ? 'Settled' : 'Pending'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {authenticated && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Join Commitment
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Check In
            </button>
            {mockCommitment.organizer === '0x1234...5678' && (
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Settle Commitment
              </button>
            )}
          </div>
        </div>
      )}
      
      {!authenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Login Required
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  You need to login to join this commitment or perform other actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
