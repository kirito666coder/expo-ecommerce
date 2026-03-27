import { Request, Response, NextFunction } from 'express';

// --- Mocks (must be declared before imports that use them) ---

const mockProductSave = jest.fn();
const mockProductFindById = jest.fn();

jest.mock('../../src/models', () => ({
  productModel: {
    findById: (...args: unknown[]) => mockProductFindById(...args),
    find: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
  },
  orderModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  },
  userModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

const mockUploadImages = jest.fn();
const mockDeleteImages = jest.fn();

jest.mock('../../src/services/upload.service', () => ({
  uploadImagesToCloudinary: (...args: unknown[]) => mockUploadImages(...args),
  deleteMultipleImagesFromCloudinary: (...args: unknown[]) => mockDeleteImages(...args),
}));

jest.mock('../../src/libs/logger', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Import after mocks
import { updateProductController } from '../../src/controllers/admin.controller';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeReqRes(
  overrides: {
    params?: Record<string, string>;
    body?: Record<string, unknown>;
    files?: unknown[];
  } = {},
) {
  const req = {
    params: overrides.params ?? { id: 'product-123' },
    body: overrides.body ?? {},
    files: overrides.files ?? [],
  } as unknown as Request;

  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res = { status, json } as unknown as Response;

  const next = jest.fn() as NextFunction;

  return { req, res, status, json, next };
}

function makeProduct(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'product-123',
    name: 'Test Product',
    description: 'A test product',
    price: 10,
    stock: 5,
    category: 'Electronics',
    images: [
      { url: 'https://example.com/img1.jpg', public_id: 'products/img1' },
      { url: 'https://example.com/img2.jpg', public_id: 'products/img2' },
    ],
    save: mockProductSave,
    ...overrides,
  };
}

/** Flush all pending microtasks so async handlers fully settle. */
const flushPromises = () => new Promise<void>((resolve) => setImmediate(resolve));

/** Invoke the asyncHandler-wrapped controller and wait for it to settle. */
async function invokeController(
  controller: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // asyncHandler returns (req, res, next) => void (Promise internally)
  const handler = controller as (req: Request, res: Response, next: NextFunction) => void;
  handler(req, res, next);
  await flushPromises();
}

// ---------------------------------------------------------------------------
// Tests for updateProductController
// ---------------------------------------------------------------------------

describe('updateProductController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProductSave.mockResolvedValue(undefined);
    mockDeleteImages.mockResolvedValue(undefined);
    mockUploadImages.mockResolvedValue([
      { url: 'https://example.com/new.jpg', public_id: 'products/new' },
    ]);
  });

  // -------------------------------------------------------------------------
  // 404 – product not found
  // -------------------------------------------------------------------------

  it('returns 404 when the product does not exist', async () => {
    mockProductFindById.mockResolvedValue(null);

    const { req, res, status, json, next } = makeReqRes({ params: { id: 'nonexistent' } });

    await invokeController(updateProductController as any, req, res, next);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'Product not found' });
  });

  // -------------------------------------------------------------------------
  // 400 – too many files
  // -------------------------------------------------------------------------

  it('returns 400 when more than 3 image files are provided', async () => {
    const product = makeProduct();
    mockProductFindById.mockResolvedValue(product);

    const files = [{}, {}, {}, {}]; // 4 files
    const { req, res, status, json, next } = makeReqRes({ files });

    await invokeController(updateProductController as any, req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Maximum 3 images allowed' });
    expect(mockDeleteImages).not.toHaveBeenCalled();
    expect(mockUploadImages).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Key PR change: no files → keep existing images
  // -------------------------------------------------------------------------

  it('skips image deletion and upload when no files are provided', async () => {
    const product = makeProduct();
    mockProductFindById.mockResolvedValue(product);

    const { req, res, status, json, next } = makeReqRes({ files: [] });

    await invokeController(updateProductController as any, req, res, next);

    expect(mockDeleteImages).not.toHaveBeenCalled();
    expect(mockUploadImages).not.toHaveBeenCalled();
    expect(mockProductSave).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith(200);
  });

  it('keeps original images on the product when no files are provided', async () => {
    const originalImages = [
      { url: 'https://example.com/orig1.jpg', public_id: 'products/orig1' },
    ];
    const product = makeProduct({ images: originalImages });
    mockProductFindById.mockResolvedValue(product);

    const { req, res, next } = makeReqRes({ files: [] });

    await invokeController(updateProductController as any, req, res, next);

    // images field must be untouched
    expect(product.images).toEqual(originalImages);
  });

  // -------------------------------------------------------------------------
  // Key PR change: files present → delete old + upload new
  // -------------------------------------------------------------------------

  it('deletes old images and uploads new ones when files are provided', async () => {
    const product = makeProduct();
    mockProductFindById.mockResolvedValue(product);

    const newImages = [{ url: 'https://example.com/new1.jpg', public_id: 'products/new1' }];
    mockUploadImages.mockResolvedValue(newImages);

    const files = [{ fieldname: 'images', buffer: Buffer.from('') }];
    const { req, res, status, next } = makeReqRes({ files });

    await invokeController(updateProductController as any, req, res, next);

    expect(mockDeleteImages).toHaveBeenCalledWith(['products/img1', 'products/img2']);
    expect(mockUploadImages).toHaveBeenCalledWith(files);
    expect(product.images).toEqual(newImages);
    expect(mockProductSave).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith(200);
  });

  it('uploads exactly 1 file and replaces images', async () => {
    const product = makeProduct();
    mockProductFindById.mockResolvedValue(product);

    const uploadedImages = [{ url: 'https://cdn.example.com/single.jpg', public_id: 'products/single' }];
    mockUploadImages.mockResolvedValue(uploadedImages);

    const files = [{ fieldname: 'images', buffer: Buffer.from('') }];
    const { req, res, status, next } = makeReqRes({ files });

    await invokeController(updateProductController as any, req, res, next);

    expect(mockUploadImages).toHaveBeenCalledTimes(1);
    expect(product.images).toEqual(uploadedImages);
    expect(status).toHaveBeenCalledWith(200);
  });

  it('uploads exactly 3 files (boundary) without returning 400', async () => {
    const product = makeProduct();
    mockProductFindById.mockResolvedValue(product);

    const files = [{}, {}, {}]; // exactly 3 files
    const { req, res, status, next } = makeReqRes({ files });

    await invokeController(updateProductController as any, req, res, next);

    expect(status).not.toHaveBeenCalledWith(400);
    expect(mockUploadImages).toHaveBeenCalledWith(files);
    expect(status).toHaveBeenCalledWith(200);
  });

  // -------------------------------------------------------------------------
  // Text field updates
  // -------------------------------------------------------------------------

  it('updates text fields on the product when provided in the body', async () => {
    const product = makeProduct();
    mockProductFindById.mockResolvedValue(product);

    const body = {
      name: 'Updated Name',
      description: 'Updated description',
      price: '29.99',
      stock: '100',
      category: 'Accessories',
    };
    const { req, res, status, next } = makeReqRes({ body, files: [] });

    await invokeController(updateProductController as any, req, res, next);

    expect(product.name).toBe('Updated Name');
    expect(product.description).toBe('Updated description');
    expect(product.price).toBe(29.99);
    expect(product.stock).toBe(100);
    expect(product.category).toBe('Accessories');
    expect(status).toHaveBeenCalledWith(200);
  });

  it('does not overwrite fields that are absent from the request body', async () => {
    const product = makeProduct({ name: 'Original Name', price: 10, stock: 5 });
    mockProductFindById.mockResolvedValue(product);

    // Only update category
    const body = { category: 'Fashion' };
    const { req, res, next } = makeReqRes({ body, files: [] });

    await invokeController(updateProductController as any, req, res, next);

    expect(product.name).toBe('Original Name');
    expect(product.price).toBe(10);
    expect(product.stock).toBe(5);
    expect(product.category).toBe('Fashion');
  });

  // -------------------------------------------------------------------------
  // Response shape
  // -------------------------------------------------------------------------

  it('responds with 200 and the saved product', async () => {
    const product = makeProduct();
    mockProductFindById.mockResolvedValue(product);

    const { req, res, status, json, next } = makeReqRes({ files: [] });

    await invokeController(updateProductController as any, req, res, next);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(product);
  });

  // -------------------------------------------------------------------------
  // Regression: previously images were always required for update
  // -------------------------------------------------------------------------

  it('regression: allows product update without uploading any images (was previously blocked)', async () => {
    // Before the PR, passing no files would have returned 400 with "At least one image is required".
    // After the PR the same request must succeed.
    const product = makeProduct();
    mockProductFindById.mockResolvedValue(product);

    const { req, res, status, json, next } = makeReqRes({ files: [] });

    await invokeController(updateProductController as any, req, res, next);

    expect(status).not.toHaveBeenCalledWith(400);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ _id: 'product-123' }));
  });
});