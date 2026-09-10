export default function AdditionalInfo() {
  return (
    <div className="card border-l-4 border-l-gray-400 bg-gray-50 flex gap-3">
      <div className="text-gray-500 mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-2">Additional Information</h3>
        <ul className="list-disc ml-5 text-sm text-gray-600 flex flex-col gap-1">
          <li>T-Shirt is not eligible for any promotion.</li>
          <li>Coupon SAVE500 is valid for minimum purchase of ₹ 1,000 (applied).</li>
        </ul>
      </div>
    </div>
  );
}
