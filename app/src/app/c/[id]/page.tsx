'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import TopBar from '../../../components/TopBar';
import { usePrivyWallet } from '../../../hooks/usePrivyWallet';
import { useCommitClub } from '../../../hooks/useCommitClub';
import { useUIStore, useChainStore } from '../../../store/uiStore';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CommitmentPage({ params }: PageProps) {
  const { connected, ready } = usePrivyWallet();
  const { joinCommit, checkIn, settleCommit } = useCommitClub();
  const { addToast } = useUIStore();
  const { selectedChain } = useChainStore();
  const [commitmentId, setCommitmentId] = useState<string>('');
  const [commitment, setCommitment] = useState<{
    id: string;
    name: string;
    organizer: string;
    stakeAmount: string;
    minCheckIns: number;
    deadline: string;
    totalStaked: string;
    joiners: readonly string[];
    attendees: readonly string[];
    settled: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [settling, setSettling] = useState(false);
  const [checkInCode, setCheckInCode] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Handle async params
  useEffect(() => {
    params.then(({ id }) => setCommitmentId(id));
  }, [params]);

  // Fetch commitment data
  useEffect(() => {
    if (commitmentId) {
      fetchCommitment();
    }
  }, [commitmentId]);

  const fetchCommitment = async () => {
    try {
      // Mock data for example commitment
      const mockCommitment = {
        id: commitmentId,
        name: 'Central Park Morning Run',
        organizer: '0x1234567890123456789012345678901234567890',
        stakeAmount: '0.1',
        minCheckIns: 3,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        totalStaked: '0.3',
        joiners: ['0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901'],
        attendees: ['0x1234567890123456789012345678901234567890'],
        settled: false,
      };

      setCommitment(mockCommitment);
    } catch (error) {
      console.error('Error fetching commitment:', error);
      addToast('Failed to fetch commitment data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Action handlers
  const handleJoin = async () => {
    if (!connected) {
      addToast('Please connect your wallet first', 'error');
      return;
    }

    setJoining(true);
    addToast('Joining commitment...', 'pending');

    try {
      await joinCommit({
        commitId: commitmentId,
        stakeAmount: commitment!.stakeAmount,
      });

      addToast('Successfully joined commitment!', 'success');
      await fetchCommitment(); // Refresh data
    } catch (error) {
      console.error('Error joining commitment:', error);
      addToast('Failed to join commitment', 'error');
    } finally {
      setJoining(false);
    }
  };

    const handleCheckIn = async () => {
    if (!checkInCode.trim()) {
      addToast('Please enter the check-in code', 'error');
      return;
    }

    setCheckingIn(true);
    addToast('Checking in...', 'pending');

    try {
      await checkIn({
        commitId: commitmentId,
        code: checkInCode,
      });

      addToast('Successfully checked in!', 'success');
      setCheckInCode('');
      await fetchCommitment(); // Refresh data
    } catch (error) {
      console.error('Error checking in:', error);
      addToast('Failed to check in', 'error');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleSettle = async () => {
    setSettling(true);
    addToast('Settling commitment...', 'pending');

    try {
      await settleCommit({
        commitId: commitmentId,
      });

      addToast('Commitment settled successfully!', 'success');

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      await fetchCommitment(); // Refresh data
    } catch (error) {
      console.error('Error settling commitment:', error);
      addToast('Failed to settle commitment', 'error');
    } finally {
      setSettling(false);
    }
  };

  if (!ready || !commitmentId || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!commitment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Commitment not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar />
      
      <main className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {commitment.name}
              </h1>
              <p className="text-gray-600">
                Commitment #{commitmentId}
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                commitment.settled 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {commitment.settled ? 'Settled' : 'Active'}
              </div>
              <p className="text-sm text-gray-500">
                Organized by {commitment.organizer.slice(0, 6)}...{commitment.organizer.slice(-4)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-700 mb-2">Stake Amount</h3>
                                <p className="text-3xl font-bold text-blue-900">{commitment.stakeAmount} {selectedChain.symbol}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <h3 className="text-sm font-semibold text-green-700 mb-2">Min Check-ins</h3>
              <p className="text-3xl font-bold text-green-900">{commitment.minCheckIns}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <h3 className="text-sm font-semibold text-purple-700 mb-2">Total Staked</h3>
              <p className="text-3xl font-bold text-purple-900">{commitment.totalStaked} FLOW</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(commitment.deadline).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Participants</dt>
                <dd className="text-sm text-gray-900">{commitment.joiners.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Check-ins</dt>
                <dd className="text-sm text-gray-900">{commitment.attendees.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-sm text-gray-900">
                  {commitment.settled ? 'Settled' : 'Pending'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {connected && !commitment.settled && (
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Actions</h2>
            
            {/* Join Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Join Commitment</h3>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleJoin}
                  disabled={joining}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {joining ? 'Joining...' : `Join (${commitment.stakeAmount} ${selectedChain.symbol})`}
                </button>
                <button 
                  onClick={() => setShowQR(!showQR)}
                  className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-base font-semibold rounded-xl shadow-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {showQR ? 'Hide QR' : 'Show QR'}
                </button>
              </div>
              
              {showQR && (
                <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800 mb-4 text-center">Scan to join this commitment:</p>
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <QRCodeSVG 
                        value={`${window.location.origin}/c/${commitmentId}`}
                        size={200}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Check-in Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Check In</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={checkInCode}
                  onChange={(e) => setCheckInCode(e.target.value)}
                  placeholder="Enter secret code"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-gray-900 placeholder-gray-500"
                />
                <button 
                  onClick={handleCheckIn}
                  disabled={checkingIn || !checkInCode.trim()}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {checkingIn ? 'Checking In...' : 'Check In'}
                </button>
              </div>
            </div>

            {/* Settle Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Settle Commitment</h3>
              <button 
                onClick={handleSettle}
                disabled={settling}
                className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-base font-semibold rounded-xl shadow-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {settling ? 'Settling...' : 'Settle Commitment'}
              </button>
              <p className="mt-3 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg">
                💡 Anyone can settle the commitment after the deadline has passed
              </p>
            </div>
          </div>
        )}
        
        {!connected && (
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
    </div>
  );
}
