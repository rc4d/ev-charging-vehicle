import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import ThemeToggle from '../components/common/ThemeToggle'
import { validateName, getValidationError } from '../utils/validation'

const CAR_TYPES = [
  { value: '', label: 'Select your car brand' },
  { value: 'tata', label: 'Tata' },
  { value: 'mg', label: 'MG' },
  { value: 'citroen', label: 'Citroën' },
  { value: 'mahindra', label: 'Mahindra' },
  { value: 'maruti-suzuki', label: 'Maruti Suzuki' }
]

function ProfileSetup() {
  const navigate = useNavigate()
  const { completeProfile, user } = useAuth()
  
  const [fullName, setFullName] = useState('')
  const [carType, setCarType] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  const handleNameChange = (e) => {
    setFullName(e.target.value)
    if (errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: '' }))
    }
  }
  
  const handleCarTypeChange = (e) => {
    setCarType(e.target.value)
    if (errors.carType) {
      setErrors(prev => ({ ...prev, carType: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    const nameError = getValidationError('name', fullName)
    if (nameError) {
      newErrors.fullName = nameError
    }
    
    if (!carType) {
      newErrors.carType = 'Please select your car brand'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const selectedCar = CAR_TYPES.find(car => car.value === carType)
    
    completeProfile({
      fullName: fullName.trim(),
      carType: carType,
      carBrand: selectedCar?.label || carType
    })
    
    setLoading(false)
    navigate('/home')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-gray-50 to-primary/5 dark:from-gray-900 dark:via-gray-900 dark:to-primary/10 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-end">
        <ThemeToggle />
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 dark:bg-success/30 rounded-2xl mb-4">
              <svg 
                className="w-8 h-8 text-success" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tell us a bit about yourself and your EV
            </p>
          </div>
          
          {/* Profile Form Card */}
          <div className="card">
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={handleNameChange}
                error={errors.fullName}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              
              {/* Car Type */}
              <div className="mt-6">
                <label 
                  htmlFor="carType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Car Brand
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <select
                    id="carType"
                    value={carType}
                    onChange={handleCarTypeChange}
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800 
                      text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 
                      focus:border-transparent transition-all duration-200
                      appearance-none cursor-pointer
                      ${errors.carType 
                        ? 'border-error focus:ring-error' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
                      }
                    `}
                    aria-invalid={errors.carType ? 'true' : 'false'}
                  >
                    {CAR_TYPES.map(car => (
                      <option key={car.value} value={car.value}>
                        {car.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.carType && (
                  <p className="mt-2 text-sm text-error" role="alert">
                    {errors.carType}
                  </p>
                )}
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                loading={loading}
                className="mt-8"
              >
                Complete Setup
              </Button>
            </form>
          </div>
          
          {/* Info Note */}
          <div className="flex items-start gap-3 mt-6 p-4 bg-primary/10 dark:bg-primary/20 rounded-xl">
            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your profile information helps us provide personalized charging recommendations for your EV.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfileSetup

