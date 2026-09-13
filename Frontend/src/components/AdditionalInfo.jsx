export default function AdditionalInfo({ appliedPromotions = [], notAppliedPromotions = [] }) {
  if (appliedPromotions.length === 0 && notAppliedPromotions.length === 0) {
    return null;
  }

  return (
    <div className="card border-l-4 border-l-brand-primary bg-gray-50 flex gap-3">
      <div className="text-brand-primary mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="w-full">
        <h3 className="font-semibold text-sm mb-2">Promotion Details</h3>
        <ul className="list-disc ml-5 text-sm flex flex-col gap-1.5">
          {appliedPromotions.map((promo, idx) => (
            <li key={`applied-${idx}`} className="text-green-700">
              <span className="font-medium">{promo.name}</span> applied successfully (Discount: ₹{promo.discount_amount.toLocaleString()})
            </li>
          ))}
          {notAppliedPromotions.map((promo, idx) => (
            <li key={`not-applied-${idx}`} className="text-gray-500">
              <span className="font-medium">{promo.name}</span> was not applicable for this order.
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
