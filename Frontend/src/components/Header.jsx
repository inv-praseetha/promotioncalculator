export default function Header() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Promotion & Discount Calculator</h1>
        <p className="text-sm text-gray-500 max-w-xl">Create a bill, apply promotions and coupons, and see the final amount.</p>
      </div>


      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>

    </header>
  );
}
