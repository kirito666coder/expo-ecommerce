/**
 * Tests for ProductsPage – focused on the change introduced in this PR:
 *
 * The page now passes `setProducts` (the state setter) to <AddProductSection>
 * instead of the `refetchProducts` callback, so that the child can update the
 * list optimistically without issuing a new network request.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Product } from '@/types';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRequest = jest.fn();

jest.mock('@/hooks/useFetch', () => ({
  useFetch: () => ({
    request: mockRequest,
    loading: false,
    error: null,
  }),
}));

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: jest.fn().mockResolvedValue('mock-token') }),
}));

// Capture props passed to AddProductSection so we can assert on them
let capturedAddSectionProps: Record<string, unknown> = {};

jest.mock('../AddProductSection', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    capturedAddSectionProps = props;
    return <div data-testid="add-product-section" />;
  },
}));

// Capture props passed to DeleteProductSection
let capturedDeleteSectionProps: Record<string, unknown> = {};

jest.mock('../DeleteProductSection', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    capturedDeleteSectionProps = props;
    return <div data-testid="delete-product-section" />;
  },
}));

global.URL.createObjectURL = jest.fn(() => 'blob:mock');
global.URL.revokeObjectURL = jest.fn();

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  _id: 'prod-1',
  name: 'Widget',
  description: 'A widget',
  price: 9.99,
  stock: 25,
  category: 'Electronics',
  images: [{ url: 'https://example.com/img.jpg', public_id: 'products/img' }],
  averageRating: 4,
  totalReviews: 5,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-02',
  ...overrides,
});

// ---------------------------------------------------------------------------
// Import the component under test (after all mocks are registered)
// ---------------------------------------------------------------------------

import ProductsPage from '../page';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProductsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedAddSectionProps = {};
    capturedDeleteSectionProps = {};
    mockRequest.mockResolvedValue([]);
  });

  // -------------------------------------------------------------------------
  // PR change: passes setProducts (not refetchProducts) to AddProductSection
  // -------------------------------------------------------------------------

  it('passes setProducts function prop to AddProductSection', async () => {
    render(<ProductsPage />);

    await waitFor(() => {
      expect(capturedAddSectionProps).toBeDefined();
    });

    expect(typeof capturedAddSectionProps.setProducts).toBe('function');
  });

  it('does NOT pass a refetchProducts prop to AddProductSection', async () => {
    render(<ProductsPage />);

    await waitFor(() => {
      expect(capturedAddSectionProps).toBeDefined();
    });

    expect(capturedAddSectionProps).not.toHaveProperty('refetchProducts');
  });

  it('passes the same setProducts setter used internally so AddProductSection can update the list', async () => {
    const products = [makeProduct({ _id: 'p1' }), makeProduct({ _id: 'p2' })];
    mockRequest.mockResolvedValue(products);

    render(<ProductsPage />);

    await waitFor(() => {
      expect(typeof capturedAddSectionProps.setProducts).toBe('function');
    });

    // Calling the setter should update the component's product list
    const setProducts = capturedAddSectionProps.setProducts as (
      updater: (prev: Product[]) => Product[],
    ) => void;

    const newProduct = makeProduct({ _id: 'p3', name: 'Brand New' });

    act(() => {
      setProducts((prev) => [newProduct, ...prev]);
    });

    await waitFor(() => {
      expect(screen.getByText('Brand New')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Basic rendering
  // -------------------------------------------------------------------------

  it('renders the Products page heading', async () => {
    render(<ProductsPage />);
    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
    });
  });

  it('fetches products on mount and renders them', async () => {
    const products = [makeProduct({ _id: 'p1', name: 'Gadget A' })];
    mockRequest.mockResolvedValue(products);

    render(<ProductsPage />);

    await waitFor(() => {
      expect(screen.getByText('Gadget A')).toBeInTheDocument();
    });
  });

  it('opens the modal when the "Add Product" button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductsPage />);

    await waitFor(() => {
      expect(capturedAddSectionProps).toBeDefined();
    });

    expect(capturedAddSectionProps.showModal).toBe(false);

    const addButton = screen.getByRole('button', { name: /add product/i });
    await user.click(addButton);

    expect(capturedAddSectionProps.showModal).toBe(true);
  });

  it('sets editingProduct when the edit (pencil) button is clicked on a product', async () => {
    const user = userEvent.setup();
    const product = makeProduct({ _id: 'p1', name: 'Editable Product' });
    mockRequest.mockResolvedValue([product]);

    render(<ProductsPage />);

    await waitFor(() => {
      expect(screen.getByText('Editable Product')).toBeInTheDocument();
    });

    const pencilButton = screen.getByRole('button', { name: '' }); // PencilIcon button
    await user.click(pencilButton);

    expect(capturedAddSectionProps.editingProduct).toEqual(product);
    expect(capturedAddSectionProps.showModal).toBe(true);
  });

  it('passes setProducts to DeleteProductSection as well', async () => {
    const products = [makeProduct({ _id: 'p1', name: 'Target Product' })];
    mockRequest.mockResolvedValue(products);

    render(<ProductsPage />);

    // Wait until the product is rendered (which means DeleteProductSection also rendered)
    await waitFor(() => {
      expect(screen.getByText('Target Product')).toBeInTheDocument();
    });

    expect(typeof capturedDeleteSectionProps.setProducts).toBe('function');
  });

  // -------------------------------------------------------------------------
  // Regression: the old refetchProducts callback must not be passed
  // -------------------------------------------------------------------------

  it('regression: AddProductSection no longer receives a refetchProducts prop', async () => {
    // Before this PR, ProductsPage passed `refetchProducts={productData}`.
    // After the PR it must pass `setProducts={setProducts}` instead.
    render(<ProductsPage />);

    await waitFor(() => {
      expect(capturedAddSectionProps).toBeDefined();
    });

    expect(capturedAddSectionProps).not.toHaveProperty('refetchProducts');
    expect(capturedAddSectionProps).toHaveProperty('setProducts');
  });
});