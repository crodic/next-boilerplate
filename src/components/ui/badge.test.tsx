import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './badge';

describe('Badge Component', () => {
  it('renders correctly with default props', () => {
    render(<Badge>New Feature</Badge>);
    const badge = screen.getByText(/new feature/i);
    
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary');
  });

  it('renders as a different variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText(/secondary/i);
    
    expect(badge).toHaveClass('bg-secondary');
  });

  it('renders as a destructive variant', () => {
    render(<Badge variant="destructive">Error</Badge>);
    const badge = screen.getByText(/error/i);
    
    expect(badge).toHaveClass('text-destructive');
  });

  it('renders as an outline variant', () => {
    render(<Badge variant="outline">Draft</Badge>);
    const badge = screen.getByText(/draft/i);
    
    expect(badge).toHaveClass('text-foreground');
  });

  it('applies custom class names', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText(/custom/i);
    
    expect(badge).toHaveClass('custom-class');
  });
});
