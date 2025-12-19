import chargePoints from '../../data/chargePoints.json'

// Mock map component with CSS-based visualization
function CPOMap({ onSelect, selectedId }) {
  // Calculate relative positions for markers based on coordinates
  const getMarkerPosition = (cpo) => {
    // Normalize coordinates to percentage positions
    // Using Bangalore area bounds approximately
    const minLat = 12.83, maxLat = 13.02
    const minLng = 77.55, maxLng = 77.76
    
    const top = ((maxLat - cpo.coordinates.lat) / (maxLat - minLat)) * 100
    const left = ((cpo.coordinates.lng - minLng) / (maxLng - minLng)) * 100
    
    return { top: `${Math.max(10, Math.min(85, top))}%`, left: `${Math.max(10, Math.min(85, left))}%` }
  }
  
  const getMarkerColor = (availability) => {
    switch (availability) {
      case 'available': return 'bg-success'
      case 'busy': return 'bg-warning'
      default: return 'bg-gray-400'
    }
  }
  
  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-primary/5 to-primary/10 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(0 102 255 / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0 102 255 / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Roads Mock */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Horizontal roads */}
        <path d="M0,30 L100,30" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" />
        <path d="M0,50 L100,50" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" />
        <path d="M0,70 L100,70" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" />
        
        {/* Vertical roads */}
        <path d="M25,0 L25,100" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" />
        <path d="M50,0 L50,100" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" />
        <path d="M75,0 L75,100" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" />
        
        {/* Main highway */}
        <path d="M10,90 Q30,70 50,50 Q70,30 90,10" stroke="currentColor" strokeWidth="1" className="text-gray-400 dark:text-gray-500" fill="none" />
      </svg>
      
      {/* City Label */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-sm">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bangalore Area</span>
      </div>
      
      {/* Markers */}
      {chargePoints.map(cpo => {
        const position = getMarkerPosition(cpo)
        const isSelected = selectedId === cpo.id
        
        return (
          <button
            key={cpo.id}
            onClick={() => onSelect(cpo)}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2 z-10
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${isSelected ? 'z-20' : 'hover:z-20'}
            `}
            style={{ top: position.top, left: position.left }}
            title={cpo.name}
          >
            {/* Marker */}
            <div className={`
              relative flex flex-col items-center
              ${isSelected ? 'scale-125' : 'hover:scale-110'}
              transition-transform duration-200
            `}>
              {/* Pin */}
              <div className={`
                w-8 h-8 rounded-full ${getMarkerColor(cpo.availability)} 
                flex items-center justify-center shadow-lg
                ${isSelected ? 'ring-4 ring-primary/30' : ''}
              `}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              {/* Ping animation for available */}
              {cpo.availability === 'available' && (
                <div className="absolute inset-0 w-8 h-8">
                  <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-30" />
                </div>
              )}
              
              {/* Label */}
              {isSelected && (
                <div className="absolute top-10 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{cpo.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{cpo.power} • {cpo.availableSlots} slots</p>
                </div>
              )}
            </div>
          </button>
        )
      })}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-sm p-3">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Status</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Offline</span>
          </div>
        </div>
      </div>
      
      {/* Zoom controls mock */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CPOMap

