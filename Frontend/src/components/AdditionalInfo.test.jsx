import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdditionalInfo from './AdditionalInfo';

describe('AdditionalInfo Component', () => {
  it('renders applied and not applied promotions', () => {
    const applied = [{ id: 1, name: 'Promo 1', discount_amount: 10 }];
    const notApplied = [{ id: 2, name: 'Promo 2' }];
    
    render(<AdditionalInfo appliedPromotions={applied} notAppliedPromotions={notApplied} />);
    
    expect(screen.getByText('Promo 1')).toBeInTheDocument();
    expect(screen.getByText('Promo 2')).toBeInTheDocument();
  });
});
