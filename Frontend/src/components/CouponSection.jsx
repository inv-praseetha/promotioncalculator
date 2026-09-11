export default function CouponSection({ couponCode, setCouponCode, handleCalculate }) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Coupon (Optional)</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:w-auto">
          <div className="input-group mb-0">
            <label className="input-label mb-1">Coupon Code</label>
            <input 
              type="text" 
              className="input-field w-full sm:w-32 uppercase" 
              value={couponCode} 
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
          </div>
          <button className="btn-primary self-end h-[38px] w-full sm:w-auto">Apply</button>
        </div>
        
        {couponCode && (
          <div className="bg-brand-success-bg border border-green-200 rounded p-3 flex items-start gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
            <div className="bg-brand-success-text text-white rounded-full p-0.5 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-brand-success-text font-semibold text-sm">Coupon applied!</h3>
              <p className="text-brand-success-text text-xs opacity-90 mt-1">{couponCode} applied to cart.</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
        <button className="btn-secondary" onClick={() => setCouponCode('')}>Clear</button>
        <button className="btn-primary flex items-center gap-2" onClick={handleCalculate}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calculate Discount
        </button>
      </div>
    </div>
  );
}
