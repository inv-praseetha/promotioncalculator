export default function Header() {
  return (
    <header className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Promotion & Discount Calculator</h1>
        <p className="text-sm text-gray-500">Create a bill, apply promotions and coupons, and see the final amount.</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Tue, 17 Jun 2025 10:24 AM</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Welcome, Admin</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </header>
  );
}
