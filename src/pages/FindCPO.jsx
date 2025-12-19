import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CPOList from '../components/cpo/CPOList'
import CPOMap from '../components/cpo/CPOMap'
import ThemeToggle from '../components/common/ThemeToggle'
import Button from '../components/common/Button'

function FindCPO() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [selectedCPO, setSelectedCPO] = useState(null)
  
  const handleSelectCPO = (cpo) => {
    setSelectedCPO(cpo)
  }
  
  const handleStartCharging = () => {
    // In a real app, this would navigate to a charging session screen
    alert(`Starting charging session at ${selectedCPO.name}`)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
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
                Find Charging Point
              </h1>
            </div>
            <ThemeToggle />
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Map
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {viewMode === 'list' ? (
          <CPOList onSelect={handleSelectCPO} selectedId={selectedCPO?.id} />
        ) : (
          <div className="h-[calc(100vh-220px)]">
            <CPOMap onSelect={handleSelectCPO} selectedId={selectedCPO?.id} />
          </div>
        )}
      </main>
      
      {/* Selected CPO Details Panel */}
      {selectedCPO && (
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {selectedCPO.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {selectedCPO.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedCPO(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {selectedCPO.power}
              </span>
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {selectedCPO.rating}
              </span>
              <span className="text-primary font-medium">
                ₹{selectedCPO.pricePerUnit}/kWh
              </span>
            </div>
            
            <Button
              fullWidth
              onClick={handleStartCharging}
              disabled={selectedCPO.availability === 'offline'}
            >
              {selectedCPO.availability === 'offline' 
                ? 'Currently Offline' 
                : selectedCPO.availability === 'busy'
                  ? 'Join Waitlist'
                  : 'Start Charging'
              }
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindCPO

