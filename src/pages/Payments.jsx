import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/common/ThemeToggle'
import Button from '../components/common/Button'

const PAYMENT_METHODS = [
  {
    id: 1,
    type: 'card',
    name: 'HDFC Bank',
    last4: '4242',
    isDefault: true
  },
  {
    id: 2,
    type: 'upi',
    name: 'UPI',
    upiId: 'user@paytm',
    isDefault: false
  }
]

function Payments() {
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
              Payments
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Wallet Balance */}
        <div className="card bg-gradient-to-r from-primary to-primary-dark text-white mb-6">
          <p className="text-sm text-white/80 mb-1">Wallet Balance</p>
          <p className="text-3xl font-bold mb-4">₹1,250</p>
          <Button variant="secondary" size="sm">
            Add Money
          </Button>
        </div>
        
        {/* Payment Methods */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Methods</h2>
          <button className="text-sm text-primary font-medium">Add New</button>
        </div>
        
        <div className="space-y-3 mb-6">
          {PAYMENT_METHODS.map(method => (
            <div key={method.id} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                method.type === 'card' 
                  ? 'bg-primary/10 dark:bg-primary/20' 
                  : 'bg-success/10 dark:bg-success/20'
              }`}>
                {method.type === 'card' ? (
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {method.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {method.type === 'card' ? `•••• ${method.last4}` : method.upiId}
                </p>
              </div>
              
              {method.isDefault && (
                <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Recent Transactions */}
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Recent Transactions</h2>
        <div className="card">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[
              { name: 'Green Energy Hub', amount: -390, date: 'Dec 18' },
              { name: 'Wallet Top-up', amount: 500, date: 'Dec 15' },
              { name: 'EcoCharge Station', amount: -362, date: 'Dec 15' }
            ].map((txn, idx) => (
              <div key={idx} className={`flex items-center justify-between py-3 ${idx === 0 ? '' : ''}`}>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{txn.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{txn.date}</p>
                </div>
                <span className={`font-medium ${txn.amount > 0 ? 'text-success' : 'text-gray-900 dark:text-white'}`}>
                  {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Payments

