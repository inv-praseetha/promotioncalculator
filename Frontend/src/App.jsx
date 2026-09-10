import { useState } from 'react';
import Header from './components/Header';
import CustomerDetails from './components/CustomerDetails';
import AddProducts from './components/AddProducts';
import CouponSection from './components/CouponSection';
import BillSummary from './components/BillSummary';
import AdditionalInfo from './components/AdditionalInfo';

function App() {
  const [customer, setCustomer] = useState({});
  const [availableProducts, setAvailableProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [couponCode, setCouponCode] = useState('');

  const subtotal = 0;
  const promotionDiscount = 0;
  const couponDiscount = 0;
  const totalDiscount = 0;
  const finalAmount = 0;

  return (
    <div className="max-w-[1200px] mx-auto">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <CustomerDetails customer={customer} setCustomer={setCustomer} setAvailableProducts={setAvailableProducts} />
          <AddProducts products={products} setProducts={setProducts} availableProducts={availableProducts} />
          <CouponSection couponCode={couponCode} setCouponCode={setCouponCode} />
        </div>
        
        <div className="flex flex-col gap-6">
          <BillSummary 
            customer={customer} 
            products={products}
            subtotal={subtotal}
            promotionDiscount={promotionDiscount}
            couponDiscount={couponDiscount}
            totalDiscount={totalDiscount}
            finalAmount={finalAmount}
          />
          <AdditionalInfo />
        </div>
      </div>
    </div>
  );
}

export default App;
