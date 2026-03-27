/**
 * Tests for AddProductSection – focused on the changes introduced in this PR:
 *
 * 1. `setProducts` prop replaces `refetchProducts`
 * 2. Submitting without images is now allowed when editing an existing product
 * 3. On successful submit, `setProducts` is called twice (filter-old then prepend-new)
 * 4. The X (close) button calls `closeHandle` in addition to `setShowModal(false)`
 * 5. The Trash2Icon per image preview removes that image from both `images` and `imagePreviews`
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddProductSection from '../AddProductSection';
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

// Clerk is required by useApi → useAuth
jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: jest.fn().mockResolvedValue('mock-token') }),
}));

// URL.createObjectURL is not available in jsdom
global.URL.createObjectURL = jest.fn((file: File) => `blob:mock/${file.name}`);
global.URL.revokeObjectURL = jest.fn();

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  _id: 'prod-1',
  name: 'Widget',
  description: 'A great widget',
  price: 9.99,
  stock: 42,
  category: 'Electronics',
  images: [{ url: 'https://example.com/img.jpg', public_id: 'products/img' }],
  averageRating: 4,
  totalReviews: 10,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-02',
  ...overrides,
});

const makeFile = (name = 'photo.png') =>
  new File(['dummy content'], name, { type: 'image/png' });

// ---------------------------------------------------------------------------
// Default props builder
// ---------------------------------------------------------------------------

function buildProps(overrides: {
  showModal?: boolean;
  editingProduct?: Product | null;
  setShowModal?: jest.Mock;
  setEditingProduct?: jest.Mock;
  setProducts?: jest.Mock;
} = {}) {
  return {
    showModal: overrides.showModal ?? true,
    editingProduct: overrides.editingProduct ?? null,
    setShowModal: overrides.setShowModal ?? jest.fn(),
    setEditingProduct: overrides.setEditingProduct ?? jest.fn(),
    setProducts: overrides.setProducts ?? jest.fn(),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Find the file input element in the rendered component. */
function getFileInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector('input[type="file"]');
  if (!input) throw new Error('File input not found');
  return input as HTMLInputElement;
}

/** Find the form element to fire submit events on. */
function getForm(container: HTMLElement): HTMLFormElement {
  const form = container.querySelector('form');
  if (!form) throw new Error('Form element not found');
  return form;
}

/** Find all Trash2 icon SVGs rendered by lucide-react. */
function getTrashIcons(container: HTMLElement): NodeListOf<Element> {
  return container.querySelectorAll('svg.lucide-trash-2');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AddProductSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Rendering / prop contract
  // -------------------------------------------------------------------------

  it('renders "Add New Product" heading when not editing', () => {
    const props = buildProps();
    render(<AddProductSection {...props} />);
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
  });

  it('renders "Edit Product" heading when editingProduct is set', () => {
    const props = buildProps({ editingProduct: makeProduct() });
    render(<AddProductSection {...props} />);
    expect(screen.getByText('Edit Product')).toBeInTheDocument();
  });

  it('pre-fills form fields from editingProduct', () => {
    const product = makeProduct({ name: 'My Widget', price: 29.99, stock: 7 });
    const props = buildProps({ editingProduct: product });
    render(<AddProductSection {...props} />);

    expect(screen.getByDisplayValue('My Widget')).toBeInTheDocument();
    expect(screen.getByDisplayValue('29.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('7')).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // PR change: images not required when editing
  // -------------------------------------------------------------------------

  it('shows alert and does not call request when adding a new product without any image', () => {
    const props = buildProps();
    const { container } = render(<AddProductSection {...props} />);

    // Submit the form directly – bypasses native required-field validation in jsdom
    // so the React onSubmit handler fires, which then checks images.length
    fireEvent.submit(getForm(container));

    expect(window.alert).toHaveBeenCalledWith('At least 1 image is required');
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('does NOT show alert and calls request when editing without any new image', async () => {
    const product = makeProduct();
    mockRequest.mockResolvedValue({ ...product, name: 'Updated Widget' });

    const props = buildProps({ editingProduct: product });
    const { container } = render(<AddProductSection {...props} />);

    fireEvent.submit(getForm(container));

    // allow microtasks to settle
    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled();
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // PR change: setProducts called (filter then prepend) on success
  // -------------------------------------------------------------------------

  it('calls setProducts twice on successful submission – filter then prepend', async () => {
    const returnedProduct = makeProduct({ _id: 'new-prod', name: 'Brand New' });
    mockRequest.mockResolvedValue(returnedProduct);

    const setProducts = jest.fn();
    const props = buildProps({ setProducts });
    const { container } = render(<AddProductSection {...props} />);

    // Add an image first so the validation passes for a new product
    await act(async () => {
      fireEvent.change(getFileInput(container), {
        target: { files: [makeFile('img1.png')] },
      });
    });

    fireEvent.submit(getForm(container));

    await waitFor(() => {
      expect(setProducts).toHaveBeenCalledTimes(2);
    });

    // First call: filter out the old entry with the same _id
    const firstCallArg = setProducts.mock.calls[0][0];
    expect(typeof firstCallArg).toBe('function');

    // Second call: prepend the new product
    const secondCallArg = setProducts.mock.calls[1][0];
    expect(typeof secondCallArg).toBe('function');

    // Verify the filter function removes an item with the matching _id
    const prevWithDuplicate = [returnedProduct, makeProduct({ _id: 'other-1' })];
    const filtered = firstCallArg(prevWithDuplicate);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]._id).toBe('other-1');

    // Verify the prepend function places the product at the front
    const prevAfterFilter = [makeProduct({ _id: 'other-1' })];
    const prepended = secondCallArg(prevAfterFilter);
    expect(prepended[0]._id).toBe('new-prod');
  });

  it('calls setProducts on edit success – removes old entry and prepends updated one', async () => {
    const existing = makeProduct({ _id: 'prod-1', name: 'Old Name' });
    const updated = { ...existing, name: 'New Name' };
    mockRequest.mockResolvedValue(updated);

    const setProducts = jest.fn();
    const props = buildProps({ editingProduct: existing, setProducts });
    const { container } = render(<AddProductSection {...props} />);

    fireEvent.submit(getForm(container));

    await waitFor(() => expect(setProducts).toHaveBeenCalledTimes(2));

    // Verify filter call removes the old product
    const filterFn = setProducts.mock.calls[0][0];
    const filtered = filterFn([existing, makeProduct({ _id: 'other' })]);
    expect(filtered.some((p: Product) => p._id === 'prod-1')).toBe(false);

    // Verify prepend call puts the updated product first
    const prependFn = setProducts.mock.calls[1][0];
    const result = prependFn([makeProduct({ _id: 'other' })]);
    expect(result[0].name).toBe('New Name');
  });

  it('does not call setProducts when the request returns null (failure)', async () => {
    mockRequest.mockResolvedValue(null);

    const setProducts = jest.fn();
    const product = makeProduct();
    const props = buildProps({ editingProduct: product, setProducts });
    const { container } = render(<AddProductSection {...props} />);

    fireEvent.submit(getForm(container));

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    expect(setProducts).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // PR change: X button closes modal AND calls closeHandle
  // -------------------------------------------------------------------------

  it('X button calls setShowModal(false) and resets editingProduct via closeHandle', async () => {
    const user = userEvent.setup();
    const setShowModal = jest.fn();
    const setEditingProduct = jest.fn();
    const props = buildProps({ setShowModal, setEditingProduct });
    render(<AddProductSection {...props} />);

    // The X button contains only the XIcon SVG; find it by looking for the circle-ghost button
    const xButton = document.querySelector('button.btn-circle.btn-ghost');
    expect(xButton).toBeTruthy();
    await user.click(xButton!);

    expect(setShowModal).toHaveBeenCalledWith(false);
    expect(setEditingProduct).toHaveBeenCalledWith(null);
  });

  it('Cancel button resets editingProduct to null', async () => {
    const user = userEvent.setup();
    const setEditingProduct = jest.fn();
    const setShowModal = jest.fn();
    const props = buildProps({
      editingProduct: makeProduct(),
      setEditingProduct,
      setShowModal,
    });
    render(<AddProductSection {...props} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(setEditingProduct).toHaveBeenCalledWith(null);
    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  // -------------------------------------------------------------------------
  // PR change: Trash icon removes image from previews and images list
  // -------------------------------------------------------------------------

  it('Trash icon removes the corresponding image preview from the list', async () => {
    const { container } = render(<AddProductSection {...buildProps()} />);

    // Upload two images
    await act(async () => {
      fireEvent.change(getFileInput(container), {
        target: { files: [makeFile('img1.png'), makeFile('img2.png')] },
      });
    });

    // Two previews should be visible
    await waitFor(() => {
      expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    // Two trash icons should be present
    expect(getTrashIcons(container)).toHaveLength(2);

    // Click the first trash icon
    await act(async () => {
      fireEvent.click(getTrashIcons(container)[0]);
    });

    // Only one image preview should remain
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('Trash icon removes the correct image by index (second of two)', async () => {
    const { container } = render(<AddProductSection {...buildProps()} />);

    await act(async () => {
      fireEvent.change(getFileInput(container), {
        target: { files: [makeFile('first.png'), makeFile('second.png')] },
      });
    });

    await waitFor(() => {
      expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    // Remove the second image (index 1)
    await act(async () => {
      fireEvent.click(getTrashIcons(container)[1]);
    });

    // First image (alt="Preview 1") should remain
    const imgs = screen.getAllByRole('img') as HTMLImageElement[];
    expect(imgs).toHaveLength(1);
    expect(imgs[0].alt).toBe('Preview 1');
  });

  it('after removing an image from a 3-image list, the remaining previews render correctly', async () => {
    const { container } = render(<AddProductSection {...buildProps()} />);

    await act(async () => {
      fireEvent.change(getFileInput(container), {
        target: { files: [makeFile('a.png'), makeFile('b.png'), makeFile('c.png')] },
      });
    });

    await waitFor(() => expect(screen.getAllByRole('img')).toHaveLength(3));

    // Remove the middle image (index 1)
    await act(async () => {
      fireEvent.click(getTrashIcons(container)[1]);
    });

    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(getTrashIcons(container)).toHaveLength(2);
  });

  // -------------------------------------------------------------------------
  // Image upload validation (max 3 images – unchanged, regression guard)
  // -------------------------------------------------------------------------

  it('shows alert when more than 3 images are selected at once', async () => {
    const { container } = render(<AddProductSection {...buildProps()} />);

    await act(async () => {
      fireEvent.change(getFileInput(container), {
        target: {
          files: [makeFile('a.png'), makeFile('b.png'), makeFile('c.png'), makeFile('d.png')],
        },
      });
    });

    expect(window.alert).toHaveBeenCalledWith('You can upload maximum 3 images');
  });

  // -------------------------------------------------------------------------
  // Error handling
  // -------------------------------------------------------------------------

  it('displays error message when the request throws an Error', async () => {
    mockRequest.mockRejectedValue(new Error('Network failure'));

    const product = makeProduct();
    const props = buildProps({ editingProduct: product });
    const { container } = render(<AddProductSection {...props} />);

    fireEvent.submit(getForm(container));

    await waitFor(() => {
      expect(screen.getByText('Network failure')).toBeInTheDocument();
    });
  });

  it('displays fallback error when the thrown value is not an Error instance', async () => {
    mockRequest.mockRejectedValue('unexpected string');

    const product = makeProduct();
    const props = buildProps({ editingProduct: product });
    const { container } = render(<AddProductSection {...props} />);

    fireEvent.submit(getForm(container));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});