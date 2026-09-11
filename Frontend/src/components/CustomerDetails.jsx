import { useState } from 'react';
import { apiClient } from '../api/client';

export default function CustomerDetails({ customer, setCustomer, setAvailableProducts }) {
  const [custId, setCustId] = useState(customer.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!custId.trim()) {
      setCustomer({});
      setAvailableProducts([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getCustomer(custId);
      setCustomer(data);
      
      const prodData = await apiClient.getProducts(custId);
      setAvailableProducts(prodData);
    } catch (err) {
      setError('Customer not found');
      setAvailableProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        <div className="input-group">
          <label className="input-label">Customer ID <span className="text-red-500">*</span></label>
          <div className="relative">
            <input 
              type="text" 
              className="input-field w-full pr-10" 
              value={custId}
              onChange={(e) => {
                const val = e.target.value;
                setCustId(val);
                if (!val.trim()) {
                  setCustomer({});
                  setAvailableProducts([]);
                }
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-0 top-0 h-full px-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-r border-l border-gray-300 flex items-center justify-center">
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2">
          <div className="flex">
            <span className="w-28 shrink-0 text-sm text-gray-500">Name</span>
            <span className="text-sm font-medium">: {customer.name || '-'}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 shrink-0 text-sm text-gray-500">Customer Type</span>
            <span className="text-sm font-medium flex items-center gap-1">
              : {customer.type ? <span className="badge bg-brand-vip-bg text-brand-vip-text ml-1 px-2 py-0.5">{customer.type}</span> : '-'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-28 shrink-0 text-sm text-gray-500">Status</span>
            <span className="text-sm font-medium flex items-center gap-1">
              : {customer.status ? <span className="badge bg-brand-success-bg text-brand-success-text ml-1 px-2 py-0.5">{customer.status}</span> : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
