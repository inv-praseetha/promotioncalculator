import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomerDetails from './CustomerDetails';
import { apiClient } from '../api/client';

// Mock the apiClient
vi.mock('../api/client', () => ({
  apiClient: {
    getCustomer: vi.fn(),
    getProducts: vi.fn(),
  }
}));

describe('CustomerDetails Component', () => {
  const mockSetCustomer = vi.fn();
  const mockSetAvailableProducts = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CustomerDetails component properly', () => {
    render(<CustomerDetails customer={{}} setCustomer={mockSetCustomer} setAvailableProducts={mockSetAvailableProducts} />);
    expect(screen.getByText('Customer Details')).toBeInTheDocument();
    expect(screen.getByText('Customer ID')).toBeInTheDocument();
  });

  it('calls API and updates state on valid customer ID search', async () => {
    const mockCustomer = { id: 'CUS-001', name: 'John Doe', type: 'VIP', status: 'Active' };
    const mockProducts = [{ id: 1, name: 'Product A' }];

    apiClient.getCustomer.mockResolvedValue(mockCustomer);
    apiClient.getProducts.mockResolvedValue(mockProducts);

    render(<CustomerDetails customer={{}} setCustomer={mockSetCustomer} setAvailableProducts={mockSetAvailableProducts} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'CUS-001' } });

    // Find the search button (the one with the svg)
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(apiClient.getCustomer).toHaveBeenCalledWith('CUS-001');
      expect(apiClient.getProducts).toHaveBeenCalledWith('CUS-001');
      expect(mockSetCustomer).toHaveBeenCalledWith(mockCustomer);
      expect(mockSetAvailableProducts).toHaveBeenCalledWith(mockProducts);
    });
  });

  it('shows error when customer is not found', async () => {
    apiClient.getCustomer.mockRejectedValue(new Error('Not found'));

    render(<CustomerDetails customer={{}} setCustomer={mockSetCustomer} setAvailableProducts={mockSetAvailableProducts} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'INVALID' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Customer not found')).toBeInTheDocument();
      expect(mockSetAvailableProducts).toHaveBeenCalledWith([]);
    });
  });

  it('handles search with empty input', async () => {
    render(<CustomerDetails customer={{}} setCustomer={mockSetCustomer} setAvailableProducts={mockSetAvailableProducts} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button); // input is empty initially
    
    expect(mockSetCustomer).toHaveBeenCalledWith({});
    expect(mockSetAvailableProducts).toHaveBeenCalledWith([]);
  });

  it('clears state when input becomes empty', () => {
    render(<CustomerDetails customer={{ id: 'CUS-001' }} setCustomer={mockSetCustomer} setAvailableProducts={mockSetAvailableProducts} />);
    
    const input = screen.getByRole('textbox');
    // Type and then clear
    fireEvent.change(input, { target: { value: '  ' } }); // empty/spaces
    
    expect(mockSetCustomer).toHaveBeenCalledWith({});
    expect(mockSetAvailableProducts).toHaveBeenCalledWith([]);
  });
});
