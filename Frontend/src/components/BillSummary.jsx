export default function BillSummary({
  customer,
  products,
  subtotal,
  promotionDiscount,
  couponDiscount,
  totalDiscount,
  finalAmount,
  handleCalculate,
}) {
  return (
    <div className="card h-fit lg:sticky lg:top-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h2 className="text-xl font-bold m-0">Bill Summary</h2>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
        <div className="flex-1">
          <div className="text-gray-500 mb-1">Customer</div>
          <div className="font-medium">
            {customer.id} - {customer.name}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-gray-500 mb-1">Customer Type</div>
          <div>
            <span className="badge bg-brand-vip-bg text-brand-vip-text">
              {customer.type}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-gray-500 mb-1">Bill Date</div>
          <div className="font-medium">17 Jun 2025, 10:24 AM</div>
        </div>
      </div>

      <div className="table-scroll mb-4">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr>
              <th className="py-2 text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
                #
              </th>
              <th className="py-2 text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
                Product
              </th>
              <th className="py-2 text-center text-xs font-semibold text-gray-500 border-b border-gray-200">
                Qty
              </th>
              <th className="py-2 text-center text-xs font-semibold text-gray-500 border-b border-gray-200">
                Get_Qty
              </th>
              <th className="py-2 text-right text-xs font-semibold text-gray-500 border-b border-gray-200">
                Coupon Disc
              </th>
              <th className="py-2 text-right text-xs font-semibold text-gray-500 border-b border-gray-200">
                Unit Price
              </th>
              <th className="py-2 text-right text-xs font-semibold text-gray-500 border-b border-gray-200">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id}>
                <td className="py-3 text-sm border-b border-gray-100">{i + 1}</td>
                <td className="py-3 text-sm border-b border-gray-100">
                  <div className="font-medium">{p.name}</div>
                  {p.promotionType && (
                    <div className="text-[10px] text-green-700 mt-1 border border-green-200 bg-green-50 inline-block px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
                      {p.promotionType}
                    </div>
                  )}
                  {p.couponName && (
                    <div className="text-[10px] text-blue-700 mt-1 border border-blue-200 bg-blue-50 inline-block px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold ml-1">
                      {p.couponName}
                    </div>
                  )}
                </td>
                <td className="py-3 text-sm border-b border-gray-100 text-center">
                  {p.quantity}
                </td>
                <td className="py-3 text-sm border-b border-gray-100 text-center">
                  {p.get_quantity}
                </td>
                <td className="py-3 text-sm border-b border-gray-100 text-right text-brand-coupon-text">
                  ₹ {p.couponDiscount ? p.couponDiscount.toLocaleString() : 0}
                </td>

                <td className="py-3 text-sm border-b border-gray-100 text-right">
                  ₹ {p.unitPrice.toLocaleString()}
                </td>
                <td className="py-3 text-sm border-b border-gray-100 text-right font-medium">
                  ₹ {(p.unitPrice * p.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center py-3 border-b border-gray-200 mb-6">
        <span className="font-semibold">Subtotal</span>
        <span className="font-bold text-lg">₹ {subtotal.toLocaleString()}</span>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-3">Discounts Applied</h3>

        <div className="bg-brand-success-bg border border-green-200 rounded p-3 flex justify-between items-center mb-2">
          <div className="flex gap-3">
            <div className="mt-0.5 text-brand-success-text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-900">
                Promotion Discount
              </div>
              <div className="text-xs text-gray-600 mt-1">
                VIP - Electronics - 15%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-success-text">
              - ₹ {promotionDiscount.toLocaleString()}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-brand-success-text"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="bg-brand-coupon-bg border border-blue-200 rounded p-3 flex justify-between items-center">
          <div className="flex gap-3">
            <div className="mt-0.5 text-brand-coupon-text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-900">
                Coupon Discount
              </div>
              <div className="text-xs text-gray-600 mt-1">SAVE500</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">- ₹ {couponDiscount ? couponDiscount.toLocaleString() : 0}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-brand-coupon-text"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center py-3 border-b border-gray-200 mb-4">
        <span className="font-semibold">Total Discount</span>
        <span className="font-bold"> - ₹ {totalDiscount.toLocaleString()}</span>
      </div>

      <div className="bg-brand-coupon-bg p-4 rounded-lg flex flex-wrap gap-2 justify-between items-center border border-blue-100">
        <span className="font-bold text-lg text-brand-primary">
          Final Amount
        </span>
        <span className="font-bold text-2xl text-gray-900">
          ₹ {finalAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
