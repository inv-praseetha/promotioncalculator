import { useState } from 'react';
import Header from './components/Header';
import CustomerDetails from './components/CustomerDetails';
import AddProducts from './components/AddProducts';
import CouponSection from './components/CouponSection';
import BillSummary from './components/BillSummary';
import AdditionalInfo from './components/AdditionalInfo';
import { apiClient } from './api/client';

function App() {
  const [customer, setCustomer] = useState({});
  const [availableProducts, setAvailableProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [appliedPromotions, setAppliedPromotions] = useState([]);
  const [notAppliedPromotions, setNotAppliedPromotions] = useState([]);

  const [subtotal, setSubtotal] = useState(0);
  const [promotionDiscount, setPromotionDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const handleCalculate = async () => {
    setErrorMsg('');
    if (!customer.id || products.length === 0) return;
    try {
      const payload = {
        customer_id: customer.id,
        items: products.map(p => ({ product_id: p.id, quantity: p.quantity })),
        coupon_code: couponCode || null
      };
      const result = await apiClient.calculateInvoice(payload);
      setSubtotal(result.subtotal);
      setPromotionDiscount(result.promotion_discount);
      setCouponDiscount(result.coupon_discount);
      setTotalDiscount(result.total_discount);
      setFinalAmount(result.final_amount);
      
      // Update cart with the calculated item-level discounts
      setProducts(result.items.map(item => {
        const prod = products.find(p => p.id === item.product_id);
        return {
          ...prod,
          subtotal: item.subtotal,
          promotionDiscount: item.promotion_discount,
          couponDiscount: item.coupon_discount,
          get_quantity: item.get_quantity,
          promotionType: item.promotion_type,
          couponName: item.coupon_name
        };
      }));
      setAppliedPromotions(result.applied_promotions || []);
      setNotAppliedPromotions(result.not_applied_promotions || []);
      setIsCalculated(true);
    } catch (error) {
      console.error("Failed to calculate", error);
      setErrorMsg(error.message);
    }
  };

  const handleCreateInvoice = async () => {
    setErrorMsg('');
    if (!customer.id || products.length === 0 || !isCalculated) return;
    try {
      const payload = {
        customer_id: customer.id,
        items: products.map(p => ({ product_id: p.id, quantity: p.quantity })),
      };
      const result = await apiClient.createInvoice(payload);
      setInvoiceNumber(result.invoice_number);
    } catch (error) {
      console.error("Failed to create invoice", error);
      setErrorMsg(error.message);
    }
  };

  const handleClearCart = () => {
    setProducts([]);
    setSubtotal(0);
    setPromotionDiscount(0);
    setCouponDiscount(0);
    setTotalDiscount(0);
    setFinalAmount(0);
    setAppliedPromotions([]);
    setNotAppliedPromotions([]);
    setIsCalculated(false);
    setInvoiceNumber(null);
  };

  const handleProductsChange = (newProducts) => {
    setProducts(newProducts);
    setIsCalculated(false);
  };

  const handleCouponChange = (code) => {
    setCouponCode(code);
    setIsCalculated(false);
  };

  const handleCustomerChange = (cust) => {
    setCustomer(cust);
    setIsCalculated(false);
    
    // Clear cart and calculation data when customer changes
    setProducts([]);
    setSubtotal(0);
    setPromotionDiscount(0);
    setCouponDiscount(0);
    setTotalDiscount(0);
    setFinalAmount(0);
    setAppliedPromotions([]);
    setNotAppliedPromotions([]);
    setInvoiceNumber(null);
    setErrorMsg('');
  };

  return (
    <div className="app-shell">
      <Header />

      <div className="app-grid grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <CustomerDetails customer={customer} setCustomer={handleCustomerChange} setAvailableProducts={setAvailableProducts} />
          <AddProducts products={products} setProducts={handleProductsChange} availableProducts={availableProducts} />
          <CouponSection couponCode={couponCode} setCouponCode={handleCouponChange} handleCalculate={handleCalculate} />
        </div>

        <div className="flex flex-col gap-6">
          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-3 rounded text-sm font-medium border border-red-200">
              {errorMsg}
            </div>
          )}
          <BillSummary
            customer={customer}
            products={products}
            subtotal={subtotal}
            promotionDiscount={promotionDiscount}
            couponDiscount={couponDiscount}
            totalDiscount={totalDiscount}
            finalAmount={finalAmount}
            handleCalculate={handleCalculate}
            handleCreateInvoice={handleCreateInvoice}
            isCalculated={isCalculated}
            invoiceNumber={invoiceNumber}
            handleClearCart={handleClearCart}
          />
          <AdditionalInfo 
            appliedPromotions={appliedPromotions} 
            notAppliedPromotions={notAppliedPromotions} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
