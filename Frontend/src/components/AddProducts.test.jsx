import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AddProducts from './AddProducts';

describe('AddProducts Component', () => {
  const mockSetProducts = vi.fn();
  const availableProducts = [
    { id: 1, name: 'Product A', price: '100.00', category: { name: 'Cat1' } },
    { id: 2, name: 'Product B', price: '50.00', category: { name: 'Cat2' } }
  ];

  it('renders correctly with no available products', () => {
    render(<AddProducts products={[]} setProducts={mockSetProducts} availableProducts={[]} />);
    expect(screen.getByText('Select Customer First')).toBeInTheDocument();
  });

  it('renders correctly with available products', () => {
    render(<AddProducts products={[]} setProducts={mockSetProducts} availableProducts={availableProducts} />);
    expect(screen.getByText('+ Add Product')).toBeInTheDocument();
  });

  it('adds a product when selected from dropdown', () => {
    render(<AddProducts products={[]} setProducts={mockSetProducts} availableProducts={availableProducts} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });
    
    expect(mockSetProducts).toHaveBeenCalledWith([{
      id: 1,
      name: 'Product A',
      category: 'Cat1',
      unitPrice: 100,
      quantity: 1
    }]);
  });

  it('does not add product if already in cart', () => {
    const productsInCart = [{
      id: 1,
      name: 'Product A',
      category: 'Cat1',
      unitPrice: 100,
      quantity: 1
    }];
    render(<AddProducts products={productsInCart} setProducts={mockSetProducts} availableProducts={availableProducts} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });
    
    // Should not be called again with the same product
    expect(mockSetProducts).not.toHaveBeenCalled();
  });

  it('updates product quantity', () => {
    const productsInCart = [{
      id: 1,
      name: 'Product A',
      category: 'Cat1',
      unitPrice: 100,
      quantity: 1
    }];
    render(<AddProducts products={productsInCart} setProducts={mockSetProducts} availableProducts={availableProducts} />);
    
    // Find increment button
    const buttons = screen.getAllByRole('button');
    const incrementBtn = buttons[0]; // first button in the quantity group
    
    fireEvent.click(incrementBtn);
    expect(mockSetProducts).toHaveBeenCalledWith([{
      id: 1,
      name: 'Product A',
      category: 'Cat1',
      unitPrice: 100,
      quantity: 2
    }]);
  });

  it('removes product', () => {
    const productsInCart = [{
      id: 1,
      name: 'Product A',
      category: 'Cat1',
      unitPrice: 100,
      quantity: 1
    }];
    render(<AddProducts products={productsInCart} setProducts={mockSetProducts} availableProducts={availableProducts} />);
    
    // Last button is remove
    const buttons = screen.getAllByRole('button');
    const removeBtn = buttons[buttons.length - 1]; 
    
    fireEvent.click(removeBtn);
    expect(mockSetProducts).toHaveBeenCalledWith([]);
  });
});
