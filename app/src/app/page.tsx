import Link from 'next/link';
import TopBar from '../components/TopBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Commit Club 🗽
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            N-of-M check-in pot for NYC meetups
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How it works
              </h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Create Commitment</h3>
                    <p className="text-gray-600">Set up a commitment with stake amount and check-in requirements</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Join with Stake</h3>
                    <p className="text-gray-600">Participants join by staking the required amount</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Check-in with Code</h3>
                    <p className="text-gray-600">Attendees check in using the secret code</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">4</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Settle the Pot</h3>
                    <p className="text-gray-600">Split pot among attendees or refund if threshold not met</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link
                href="/new"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Commitment
              </Link>
              <Link
                href="/c/1"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
