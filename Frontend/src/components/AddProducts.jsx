export default function AddProducts({ products, setProducts, availableProducts }) {
  const handleAdd = (e) => {
    const productId = parseInt(e.target.value);
    if (!productId) return;
    
    // Reset dropdown
    e.target.value = "";
    
    // Check if already in cart
    if (products.find(p => p.id === productId)) return;
    
    const prod = availableProducts.find(p => p.id === productId);
    if (prod) {
      setProducts([...products, { 
        id: prod.id, 
        name: prod.name, 
        category: prod.category.name, 
        unitPrice: parseFloat(prod.price), 
        quantity: 1 
      }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newQuantity = Math.max(1, p.quantity + change);
        return { ...p, quantity: newQuantity };
      }
      return p;
    }));
  };

  const removeProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold m-0">Add Products</h2>
        {availableProducts && availableProducts.length > 0 ? (
          <select 
            onChange={handleAdd} 
            className="input-field py-1.5 px-3 text-sm w-48 border-brand-primary"
            defaultValue=""
          >
            <option value="" disabled>+ Add Product</option>
            {availableProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
            ))}
          </select>
        ) : (
          <button className="btn-primary py-1.5 px-3 text-sm opacity-50 cursor-not-allowed">
            Select Customer First
          </button>
        )}
      </div>
      
      <table className="w-full">
        <thead>
          <tr>
            <th className="table-header py-2 px-3">#</th>
            <th className="table-header py-2 px-3">Product</th>
            <th className="table-header py-2 px-3">Category</th>
            <th className="table-header py-2 px-3 text-right">Unit Price</th>
            <th className="table-header py-2 px-3 text-center">Quantity</th>
            <th className="table-header py-2 px-3 text-right">Subtotal</th>
            <th className="table-header py-2 px-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className="border-b border-gray-100 last:border-0">
              <td className="table-cell py-3 px-3">{index + 1}</td>
              <td className="table-cell py-3 px-3 font-medium">{product.name}</td>
              <td className="table-cell py-3 px-3 text-gray-500">{product.category}</td>
              <td className="table-cell py-3 px-3 text-right">₹ {product.unitPrice.toLocaleString()}</td>
              <td className="table-cell py-3 px-3">
                <div className="flex items-center justify-center">
                  <div className="border border-gray-300 rounded flex overflow-hidden w-16">
                    <input type="text" className="w-10 text-center outline-none text-sm py-1" value={product.quantity} readOnly />
                    <div className="flex flex-col border-l border-gray-300">
                      <button onClick={() => updateQuantity(product.id, 1)} className="bg-gray-50 hover:bg-gray-100 px-1 border-b border-gray-300 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                      </button>
                      <button onClick={() => updateQuantity(product.id, -1)} className="bg-gray-50 hover:bg-gray-100 px-1 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td className="table-cell py-3 px-3 text-right font-medium">₹ {(product.unitPrice * product.quantity).toLocaleString()}</td>
              <td className="table-cell py-3 px-3 text-center">
                <button onClick={() => removeProduct(product.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
