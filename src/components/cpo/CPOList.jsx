import chargePoints from '../../data/chargePoints.json'

const AVAILABILITY_CONFIG = {
  available: {
    label: 'Available',
    color: 'bg-success text-white',
    dotColor: 'bg-success'
  },
  busy: {
    label: 'Busy',
    color: 'bg-warning text-white',
    dotColor: 'bg-warning'
  },
  offline: {
    label: 'Offline',
    color: 'bg-gray-400 text-white',
    dotColor: 'bg-gray-400'
  }
}

function CPOList({ onSelect, selectedId }) {
  return (
    <div className="space-y-4">
      {chargePoints.map(cpo => {
        const availability = AVAILABILITY_CONFIG[cpo.availability] || AVAILABILITY_CONFIG.offline
        const isSelected = selectedId === cpo.id
        
        return (
          <button
            key={cpo.id}
            onClick={() => onSelect(cpo)}
            className={`
              w-full card text-left transition-all duration-200 
              ${isSelected 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-lg'
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                ${cpo.availability === 'available' 
                  ? 'bg-success/10 dark:bg-success/20' 
                  : cpo.availability === 'busy'
                    ? 'bg-warning/10 dark:bg-warning/20'
                    : 'bg-gray-100 dark:bg-gray-700'
                }
              `}>
                <svg 
                  className={`w-6 h-6 ${
                    cpo.availability === 'available' 
                      ? 'text-success' 
                      : cpo.availability === 'busy'
                        ? 'text-warning'
                        : 'text-gray-400'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {cpo.name}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${availability.color} flex-shrink-0`}>
                    {availability.label}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
                  {cpo.address}
                </p>
                
                {/* Details */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {/* Power */}
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {cpo.power}
                  </span>
                  
                  {/* Slots */}
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {cpo.availableSlots}/{cpo.totalSlots} slots
                  </span>
                  
                  {/* Rating */}
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-warning" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {cpo.rating}
                  </span>
                  
                  {/* Price */}
                  <span className="flex items-center gap-1 text-primary font-medium">
                    ₹{cpo.pricePerUnit}/kWh
                  </span>
                </div>
                
                {/* Amenities */}
                {cpo.amenities && cpo.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {cpo.amenities.slice(0, 3).map(amenity => (
                      <span 
                        key={amenity}
                        className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {cpo.amenities.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                        +{cpo.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default CPOList

