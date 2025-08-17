import Link from 'next/link';
import TopBar from '../components/TopBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar />
      
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to Commit Club
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              N-of-M check-in pot for NYC meetups. Create commitments, stake FLOW, and earn rewards for showing up.
            </p>
          </div>
          
                      <div className="max-w-3xl mx-auto">
              <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  How it works
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-lg">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Create Commitment</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">Set up a commitment with stake amount and check-in requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-lg">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Join with Stake</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">Participants join by staking the required FLOW amount</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Check-in with Code</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">Attendees check in using the secret code at the event</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-700 font-bold text-lg">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Settle the Pot</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">Split pot among attendees or refund if threshold not met</p>
                    </div>
                  </div>
                </div>
              </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/new"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                Create Commitment
              </Link>
              <Link
                href="/c/1"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-lg font-semibold rounded-xl shadow-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                View Example
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
