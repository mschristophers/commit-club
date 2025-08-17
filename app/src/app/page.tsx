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
              Welcome to Commit Club 🗽
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Turn your goals into reality with social stakes. Create challenges, put money on the line, and reward those who show up while penalizing those who don&apos;t!
            </p>
          </div>
          
                      <div className="max-w-3xl mx-auto">
              <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  How Commit Club Works
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-lg">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Create Your Challenge</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">Set up a plan with a stake amount and how many need to show up</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-lg">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Put Money on the Line</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">You and friends stake money to make the challenge real and motivating</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Show Up & Check In</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">Use the secret code to prove you actually attended the event</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-700 font-bold text-lg">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Reward Winners, Penalize No-Shows</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">Those who show up split the pot! Those who don&apos;t show up lose their stake</p>
                    </div>
                  </div>
                </div>
              </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/new"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                Start Your Challenge
              </Link>
              <Link
                href="/c/1"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-lg font-semibold rounded-xl shadow-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                See a Challenge in Action
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
