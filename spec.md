# Specification

## Summary
**Goal:** Build FreshCart, a grocery delivery web app with a product catalog, shopping cart, checkout flow, and basic order management.

**Planned changes:**
- Apply a farmers'-market-inspired visual theme (warm greens, earthy neutrals, crisp whites, card-based layouts, clean sans-serif typography) across all pages.
- Create a backend data model for grocery products (id, name, category, description, price in cents, imageUrl, stock, isAvailable) with at least 20 seeded products across 5+ categories.
- Create a backend order model (orderId, buyerName, deliveryAddress, items, totalAmount, status, createdAt) with `placeOrder` and `getOrders` functions.
- Build a homepage with a hero banner, featured categories section, featured products grid, and a persistent navbar with logo, search bar, and cart icon with item count badge.
- Build a product catalog page with a responsive grid, category filtering, and price sorting; each product card shows name, image, price, and Add to Cart button.
- Implement a client-side shopping cart as a slide-in drawer with add/remove/quantity controls and a running subtotal.
- Build a checkout page with name, delivery address, and delivery time fields; on submission persist the order and show an order confirmation screen; clear cart on success.
- Build an admin orders page listing all orders in a table (order ID, buyer name, address, item count, total, status).
- Load hero banner and category/product images from `/assets/generated/`.
