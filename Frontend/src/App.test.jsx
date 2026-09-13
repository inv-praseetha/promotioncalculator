import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { apiClient } from './api/client';

// Mock the apiClient
vi.mock('./api/client', () => ({
  apiClient: {
    getCustomer: vi.fn(),
    getProducts: vi.fn(),
    calculateInvoice: vi.fn(),
    createInvoice: vi.fn(),
  }
}));

vi.mock('./components/Header', () => ({
  default: () => <div data-testid="header">Header</div>
}));

describe('App Component Full Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('performs full flow: select customer, add product, calculate, create invoice', async () => {
    // Setup mocks
    apiClient.getCustomer.mockResolvedValue({ id: 'CUS-001', name: 'John Doe', type: 'VIP', status: 'Active' });
    apiClient.getProducts.mockResolvedValue([{ id: 1, name: 'Product A', price: '100', category: { name: 'Cat1' } }]);
    apiClient.calculateInvoice.mockResolvedValue({
      subtotal: 100,
      promotion_discount: 10,
      coupon_discount: 0,
      total_discount: 10,
      final_amount: 90,
      items: [{ product_id: 1, subtotal: 100, promotion_discount: 10, coupon_discount: 0, get_quantity: 0 }],
      applied_promotions: [],
      not_applied_promotions: []
    });
    apiClient.createInvoice.mockResolvedValue({ invoice_number: 'INV-12345' });

    render(<App />);

    // 1. Search Customer
    const custInput = screen.getByRole('textbox');
    fireEvent.change(custInput, { target: { value: 'CUS-001' } });
    
    // The search button is the only button inside the customer details input group
    // We can find it by looking for the button next to the textbox
    const buttons = screen.getAllByRole('button');
    // First button is probably customer search
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(screen.getByText(': John Doe')).toBeInTheDocument();
    });

    // 2. Add Product
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });

    // 3. Enter Coupon
    const couponInputs = screen.getAllByRole('textbox');
    // Second textbox should be coupon
    if(couponInputs[1]) {
      fireEvent.change(couponInputs[1], { target: { value: 'SAVE10' } });
    }

    // 4. Calculate
    const calcButton = screen.getByText('Calculate Discount');
    fireEvent.click(calcButton);

    await waitFor(() => {
      // Subtotal should update to 100
      const subtotalElems = screen.getAllByText('₹ 100');
      expect(subtotalElems.length).toBeGreaterThan(0);
    });

    // 5. Create Invoice
    const billButton = screen.getByText('Bill / Okay');
    fireEvent.click(billButton);

    await waitFor(() => {
      expect(screen.getByText('Invoice: INV-12345')).toBeInTheDocument();
    });

    // 6. Clear Cart
    // Actually when invoice is created, Bill / Okay becomes Print & Clear
    // wait for it
    const printClearBtn = screen.getByText('Print & Clear');
    expect(printClearBtn).toBeInTheDocument();
  });

  it('handles calculate API error', async () => {
    apiClient.getCustomer.mockResolvedValue({ id: 'CUS-001', name: 'John Doe', type: 'VIP', status: 'Active' });
    apiClient.getProducts.mockResolvedValue([{ id: 1, name: 'Product A', price: '100', category: { name: 'Cat1' } }]);
    apiClient.calculateInvoice.mockRejectedValue(new Error('Calculation failed'));

    render(<App />);

    // 1. Search Customer
    const custInput = screen.getByRole('textbox');
    fireEvent.change(custInput, { target: { value: 'CUS-001' } });
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(screen.getByText(': John Doe')).toBeInTheDocument();
    });

    // 2. Add Product
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });

    // 3. Calculate
    const calcButton = screen.getByText('Calculate Discount');
    fireEvent.click(calcButton);

    await waitFor(() => {
      expect(screen.getByText('Calculation failed')).toBeInTheDocument();
    });
  });

  it('handles create invoice API error', async () => {
    apiClient.getCustomer.mockResolvedValue({ id: 'CUS-001', name: 'John Doe', type: 'VIP', status: 'Active' });
    apiClient.getProducts.mockResolvedValue([{ id: 1, name: 'Product A', price: '100', category: { name: 'Cat1' } }]);
    apiClient.calculateInvoice.mockResolvedValue({
      subtotal: 100, promotion_discount: 10, coupon_discount: 0, total_discount: 10, final_amount: 90,
      items: [{ product_id: 1, subtotal: 100, promotion_discount: 10, coupon_discount: 0, get_quantity: 0 }],
      applied_promotions: [], not_applied_promotions: []
    });
    apiClient.createInvoice.mockRejectedValue(new Error('Create failed'));

    render(<App />);

    const custInput = screen.getByRole('textbox');
    fireEvent.change(custInput, { target: { value: 'CUS-001' } });
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(screen.getByText(': John Doe')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });

    const calcButton = screen.getByText('Calculate Discount');
    fireEvent.click(calcButton);

    await waitFor(() => {
      expect(screen.getAllByText('₹ 100').length).toBeGreaterThan(0);
    });

    const billButton = screen.getByText('Bill / Okay');
    fireEvent.click(billButton);

    await waitFor(() => {
      expect(screen.getByText('Create failed')).toBeInTheDocument();
    });
  });
});
