import SteamGameCard from '../components/SteamGameCard';

export default function Home() {
  // Popular Steam games for demonstration
  const popularGames = [
    { appId: 730, name: 'Counter-Strike 2' },
    { appId: 570, name: 'Dota 2' },
    { appId: 440, name: 'Team Fortress 2' },
    { appId: 252490, name: 'Rust' },
    { appId: 1172470, name: 'Apex Legends' },
    { appId: 1091500, name: 'Cyberpunk 2077' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PriceWave</h1>
              <span className="ml-2 text-sm text-gray-500">Steam Price Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://steamcommunity.com/dev/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Get Steam API Key
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Track Steam Game Prices
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor your favorite games and get notified when prices drop. 
            Built with Next.js and Express.js, powered by the Steam Web API.
          </p>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm text-green-800">Backend Running</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">✓</div>
              <div className="text-sm text-blue-800">Steam API Ready</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">✓</div>
              <div className="text-sm text-purple-800">Frontend Connected</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">!</div>
              <div className="text-sm text-yellow-800">API Key Required</div>
            </div>
          </div>
        </div>

        {/* Popular Games Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Games</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGames.map((game) => (
              <SteamGameCard key={game.appId} appId={game.appId} />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Price Tracking</h4>
              <p className="text-sm text-gray-600">Monitor game prices in real-time</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Discount Alerts</h4>
              <p className="text-sm text-gray-600">Get notified when games go on sale</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">User Profiles</h4>
              <p className="text-sm text-gray-600">View Steam user information</p>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup</h3>
          <div className="space-y-3 text-sm">
            <p className="text-gray-600">
              <strong>1.</strong> Copy <code className="bg-gray-200 px-1 rounded">backend/env.example</code> to <code className="bg-gray-200 px-1 rounded">backend/.env</code>
            </p>
            <p className="text-gray-600">
              <strong>2.</strong> Get your Steam API key from <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Steam Community</a>
            </p>
            <p className="text-gray-600">
              <strong>3.</strong> Add your API key to <code className="bg-gray-200 px-1 rounded">STEAM_API_KEY</code> in the backend .env file
            </p>
            <p className="text-gray-600">
              <strong>4.</strong> Run <code className="bg-gray-200 px-1 rounded">npm run dev</code> to start both servers
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Built with Next.js, Express.js, and Steam Web API</p>
            <p className="mt-2 text-sm">
              <a href="https://github.com" className="text-blue-600 hover:underline">View on GitHub</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
