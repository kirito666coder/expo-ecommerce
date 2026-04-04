# Backend API (`/backend`)

**Navigation**: [Main README](./README.md) • [Mobile App](./Mobile.md) • [Admin Dashboard](./Admin.md) • **[Backend API](./Backend.md)**

---

The Express.js REST API providing backend services, authentication integration, and database access for both the mobile application and admin dashboard.

## Tech Stack & Libraries

- **Runtime**: ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) Node.js
- **Framework**: ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) Express.js (v5.2.1)
- **Language**: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) TypeScript
- **Database Engine**: ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) MongoDB via Mongoose
- **Authentication**: @clerk/express
- **Background Jobs**: Inngest
- **File Uploads**: Cloudinary & Multer
- **Other utilities**: Cors, Dotenv, Helmet, Morgan, Winston

## Environment Variables

Create a `.env` file in the `/backend` directory:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ecommerce

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Inngest (Background Jobs)
INNGEST_EVENT_KEY=local
INNGEST_SIGNING_KEY=local
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. (Optional) Run Database Seeds:
   ```bash
   pnpm seed:products
   ```

## API Routes List

The backend exposes several routes securely via Clerk authentication and role-based access. All routes are prefixed based on their controller (e.g., `/api`).

### 1. Admin Routes (Admin Only) - `/admin`

| Method   | Endpoint                        | Description                                              |
| -------- | ------------------------------- | -------------------------------------------------------- |
| `GET`    | `/admin/products`               | Get all products                                         |
| `POST`   | `/admin/products`               | Create a new product (handles max 3 image uploads)       |
| `PUT`    | `/admin/products/:id`           | Update a specific product                                |
| `DELETE` | `/admin/products/:id`           | Delete a specific product                                |
| `GET`    | `/admin/orders`                 | Retrieves all orders                                     |
| `PATCH`  | `/admin/orders/:orderId/status` | Updates order tracking/status                            |
| `GET`    | `/admin/customers`              | Retrieves all platform customers                         |
| `GET`    | `/admin/stats`                  | Gets general sales and user statistics for the dashboard |

### 2. User/Customer Routes - `/users`

| Method   | Endpoint                      | Description               |
| -------- | ----------------------------- | ------------------------- |
| `GET`    | `/users/addresses`            | List all saved addresses  |
| `POST`   | `/users/addresses`            | Add a new address         |
| `PUT`    | `/users/addresses/:addressId` | Edit a specific address   |
| `DELETE` | `/users/addresses/:addressId` | Delete a specific address |
| `GET`    | `/users/wishlist`             | View wishlist items       |
| `POST`   | `/users/wishlist`             | Add an item to wishlist   |
| `DELETE` | `/users/wishlist/:productId`  | Remove item from wishlist |

### 3. Shopping Cart Routes - `/cart`

| Method   | Endpoint           | Description                      |
| -------- | ------------------ | -------------------------------- |
| `GET`    | `/cart/`           | Retrieve current cart data       |
| `POST`   | `/cart/`           | Add a brand new item to cart     |
| `PUT`    | `/cart/:productId` | Update item quantity in cart     |
| `DELETE` | `/cart/:productId` | Delete a specific item from cart |
| `DELETE` | `/cart/`           | Clear the entire cart            |

### 4. Orders Routes - `/orders`

| Method | Endpoint   | Description                                |
| ------ | ---------- | ------------------------------------------ |
| `GET`  | `/orders/` | Get orders belonging to the logged-in user |
| `POST` | `/orders/` | Create/Place a new order                   |

### 5. Standard Product Routes - `/products`

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| `GET`  | `/products/`    | Get available catalog products  |
| `GET`  | `/products/:id` | Get details of a single product |

### 6. Reviews - `/reviews`

| Method   | Endpoint             | Description               |
| -------- | -------------------- | ------------------------- |
| `POST`   | `/reviews/`          | Submit a new review       |
| `DELETE` | `/reviews/:reviewId` | Delete an existing review |

## Scripts

- `pnpm dev`: Runs the app via `ts-node-dev`.
- `pnpm build`: Compiles TypeScript to the `dist/` directory.
- `pnpm start`: Runs the compiled Node output.
