import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/common/ThemeToggle'

const MOCK_SESSIONS = [
  {
    id: 1,
    stationName: 'Green Energy Hub',
    date: '2024-12-18',
    time: '14:30',
    duration: '1h 45m',
    energy: '32.5 kWh',
    cost: 390,
    status: 'completed'
  },
  {
    id: 2,
    stationName: 'EcoCharge Station',
    date: '2024-12-15',
    time: '10:15',
    duration: '2h 10m',
    energy: '45.2 kWh',
    cost: 362,
    status: 'completed'
  },
  {
    id: 3,
    stationName: 'PowerUp Central',
    date: '2024-12-10',
    time: '18:45',
    duration: '45m',
    energy: '18.7 kWh',
    cost: 281,
    status: 'completed'
  }
]

function Sessions() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Sessions
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Sessions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Energy</p>
            <p className="text-2xl font-bold text-success">486 kWh</p>
          </div>
        </div>
        
        {/* Sessions List */}
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Recent Sessions</h2>
        <div className="space-y-3">
          {MOCK_SESSIONS.map(session => (
            <div key={session.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {session.stationName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {session.date} at {session.time}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                  {session.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">{session.duration}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Energy</p>
                  <p className="font-medium text-gray-900 dark:text-white">{session.energy}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Cost</p>
                  <p className="font-medium text-primary">₹{session.cost}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Sessions

