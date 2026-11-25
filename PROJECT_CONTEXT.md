# ShopEase – Full Project Context (paste this into any chatbot / AI model)

ShopEase is an e-commerce app (Flipkart/Amazon style) with two parts in one Git repo (branch `shopease-mobile`):

| Folder | Role | Tech |
|---|---|---|
| `ecommerce 2/` | **Backend** – REST API, database, auth | Spring Boot 3.5.6, Java 21, Spring Security + JWT, JPA/Hibernate, H2 file DB, Lombok |
| `ecommerce-mobile/` | **Frontend** – the app users see | Expo SDK 58, React Native 0.88, React 19, TypeScript, Expo Router, axios |
| `data/` | H2 database files (`ecommerce_db.mv.db`) | created by the backend |
| `start-backend.sh`, `SETUP.md` | run script and setup guide | |

(There was an older web frontend; it is out of scope and must not be touched.)

---

## 1. How the two parts are connected

```
 Phone (Expo Go) / Android emulator / Chrome (Expo web)
        │  React Native app  (ecommerce-mobile)
        │  axios  →  HTTP + JSON,  header  Authorization: Bearer <JWT>
        ▼
 Spring Boot API  (ecommerce 2)   http://<laptop-ip>:8080/api/...
        │  Controller → Service → Repository (JPA)
        ▼
 H2 file database  (data/ecommerce_db)
```

- The app talks to the backend only through REST calls under `/api`.
- **Base URL** (`src/services/api.ts`): `EXPO_PUBLIC_API_URL` if set, otherwise it takes the host the Expo dev server runs on (`Constants.expoConfig.hostUri`) and uses `http://<that-host>:8080/api`. So phone and laptop must be on the same Wi-Fi. The Android emulator reaches the laptop as `10.0.2.2`.
- **CORS** (`config/CorsConfig.java`): the backend allows browser origins `http://localhost:*` and `http://127.0.0.1:*` (Expo web picks any free port). Native apps (phone/emulator) are not subject to CORS; only Chrome/web is.
- Product images are served by the backend itself from `src/main/resources/static/product-images/` at `/product-images/**` (public).

---

## 2. Backend (`ecommerce 2`)

Package `com.ecommerce.ecommerce`, layered:

- `Controller/` – REST endpoints
- `Service/` (interfaces) + `ServiceImpl/` (logic)
- `Repository/` – Spring Data JPA
- `Entity/` – database tables
- `DTO/` – request/response shapes (entities are not returned directly)
- `Security/JwtAuthenticationFilter` – reads `Authorization: Bearer ...`, validates the token, puts the user's email into the Spring security context
- `config/SecurityConfig` – stateless sessions, CSRF off, CORS on, which URLs are public
- `config/CorsConfig`, `config/DataSeeder`, `util/ImageUrls`

### Config (`application.properties`, git-ignored; created per SETUP.md)
H2 file DB `jdbc:h2:file:./data/ecommerce_db` (user `sa`, empty password), `ddl-auto=update` (tables are created/updated automatically), `show-sql=true`, a `jwt.secret`, `server.error.include-message=always`. Port 8080.
H2 allows **one process** on the file at a time: if DBeaver or an old backend holds it, startup fails with "Database may be already in use".

### Authentication
- Public (no token): `/api/users/login`, `/api/users/register`, `/api/products/**`, `/product-images/**`, `/error`.
- Everything else needs a valid JWT. Missing/expired token ⇒ Spring answers **403** (not 401).
- Login returns `AuthResponseDTO` (token + user). The JWT subject is the user's email.

### Endpoints
**Users** `/api/users`: `POST /register` (always a customer), `POST /register-merchant` (merchant token required), `POST /login`, `GET /profile`, `PUT /profile`, `DELETE /delete`
**Products** `/api/products` (public): `GET /` (search/category/brand/sort), `GET /categories`, `GET /brands`, `GET /filter`, `GET /{id}`, plus `POST`, `PUT /{id}`, `DELETE /{id}` for admin-style management
**Cart** `/api/cart`: `GET /` (current user's cart), `POST /add` (productId, quantity, optional size), `DELETE /{cartItemId}`
**Cart items** `/api/cart-items`: `PUT /{id}/increment`, `PUT /{id}/decrement`, `DELETE /{id}`
**Orders** `/api/orders`: `POST /place` (turns the cart into an order), `GET /` (my orders), `GET /{orderId}`, `PUT /{orderId}/cancel`
**Order items** `/api/orderitems`: basic CRUD (not used by the mobile app)

### Data model (tables)
- `users`: id, name, email (login ID), password, address, phone, gender, dateOfBirth, city, pincode. One-to-one with Cart, one-to-many with Orders.
- `products`: id, name, description, price, **mrp** (original price, used for "% OFF"), quantity (stock), imageUrl, **imageUrls** (gallery), category, brand, seller, distributor, warranty, specifications, **sizes** (for clothes), sizeChart, offers.
- `carts`: one per user. `cart_items`: cart, product, quantity, size.
- `orders`: user, totalAmount, status, orderDate. `order_items`: order, product, quantity, price (price at purchase time), size.

### Business rules visible to the app
- **Stock**: adding/incrementing/ordering beyond available stock is rejected with **HTTP 409 Conflict** and a message; the app treats 409 as "limited stock", never as a logout.
- Clothes have `sizes`; the cart line carries a chosen `size`.
- Orders have a status (the app shows a StatusBadge) and can be cancelled; order numbers are per-user (`orderNumber` in the response).
- **DataSeeder** (`CommandLineRunner`) loads `src/main/resources/seed/products.json` on startup and attaches gallery images discovered as `static/product-images/<slug>-1.jpg`, `-2.jpg`, ... Existing products are only filled in once, so manual edits are not overwritten. Products with no real photos are skipped.

### Run it
From the project root: `./start-backend.sh` (needs JDK 21; JDK 22+ breaks Lombok). Server on `http://localhost:8080`.

---

## 3. Mobile app (`ecommerce-mobile`)

Expo Router, file-based routing in `src/app/`.

```
src/app/
  _layout.tsx        root: providers + Stack with protected routes
  index.tsx          redirects to /home if logged in, else /login
  (auth)/login.tsx, register.tsx
  (tabs)/_layout.tsx (bottom tab bar via components/app-tabs.tsx)
  (tabs)/home.tsx, cart.tsx, orders.tsx, wishlist.tsx, profile.tsx
  product/[id].tsx   product detail (gallery, sizes, add to cart)
  order/[id].tsx     order detail
  edit-profile.tsx
```

### Navigation / auth gate
`_layout.tsx` uses `Stack.Protected`: with a token you get `(tabs)`, product, order and edit-profile screens; without one only `(auth)` (login/register). Logging in/out switches the screens automatically.

### State: React Context providers (nested in `_layout.tsx`)
`ToastProvider > DialogProvider > AuthProvider > CartProvider > WishlistProvider`
- **AuthContext** – `token`, `user`, `signIn`, `signOut`; token saved with `storage/authStorage.ts` (AsyncStorage) so login survives restarts. `api.ts` registers a session-expired handler (called on 401/403 when a token was sent).
- **CartContext** – `count`, `refresh()`, `setCount()`; keeps the red badge number on the cart tab icon and Home header. Refreshed after add-to-cart; the Cart screen syncs it after every change.
- **WishlistContext** – liked product ids (heart button).
- **ToastContext / DialogContext** – small toast messages and confirm/success dialogs (`utils/confirm.ts`).

### Services (`src/services/`) – the only code that calls the backend
- `api.ts` – axios instance, request interceptor adds the `Bearer` token from storage, response interceptor triggers sign-out on 401/403 with a token, helpers `isStockError` (409) and `getErrorMessage`.
- `authService.ts` – login, register, getProfile, updateProfile
- `productService.ts` – getProducts({search, category, brand, sort}), getProduct, getCategories, getBrands
- `cartService.ts` – getCart, addToCart, increment/decrement/removeItem, `cartTotal`, `cartCount`
- `orderService.ts` – placeOrder, getOrders, getOrder, cancelOrder

### Screens (what each does)
- **Home** – dark header with search and cart button (with badge), promo banner, horizontally scrollable category chips and brand chips (`ScrollRow`), price slider / filter sheet, product grid of `ProductCard`s.
- **ProductCard** – photo, discount badge, heart (wishlist), "+" quick add, press animation (shrinks, green frame); on web also hover + hand cursor.
- **Product detail** – image gallery with zoom, size selector + size chart, price/MRP/offers/specifications, Add to cart.
- **Cart** – list with quantity stepper and remove, price summary, "Place Order". Stock warnings from the server.
- **Orders / Order detail** – history, status, cancel.
- **Profile** – fixed dark header (avatar, "Hi, name", email, Edit), Orders/Cart tiles, profile completion %, personal info, delivery address, menu, logout.
- **Wishlist**, **Edit profile**, **Login/Register**.

### Typical flow (add to cart → order)
1. Login → backend returns JWT → stored → app redirects to Home.
2. Home calls `GET /api/products` (public) and renders cards.
3. Tap "+" → `POST /api/cart/add` with the JWT → backend checks stock, creates/updates the cart item → app calls `refreshCart()` → badge number updates.
4. Cart tab → `GET /api/cart`; +/- call `/api/cart-items/{id}/increment|decrement`.
5. "Place Order" → `POST /api/orders/place` → backend creates order + order items from the cart, reduces stock, empties the cart → app shows success dialog → Orders tab shows it.

### Platform notes
- Runs on: Expo Go (phone, same Wi-Fi), Android emulator, and web (Chrome).
- Hover and the hand mouse cursor exist **only on web**. The Android emulator turns the mouse into touch, so there is no cursor change there (a limitation, not a bug); tap/press feedback works everywhere.
- The emulator hides its on-screen keyboard when a Mac keyboard is attached (`adb shell settings put secure show_ime_with_hard_keyboard 1` brings it back).
- Dev server: `cd ecommerce-mobile && npx expo start` (port 8081, or 8082 if busy). Lint/typecheck: `npx expo lint`, `npx tsc --noEmit`.

---

## 4. Quick start
1. `./start-backend.sh` (project root) → API on :8080.
2. `cd ecommerce-mobile && npm install && npx expo start`.
3. Scan the QR with Expo Go, press `a` for the Android emulator, or `w` for Chrome.
4. Register a user, browse, add to cart, place an order.

## 5. Known gaps / caveats
- JWT secret is hard-coded in `application.properties` (fine for dev, replace for production).
- `JwtAuthenticationFilter` prints tokens to the console (debug logging; remove for production).
- Passwords/ H2 file DB are dev-grade; no payment integration; no admin UI (product CRUD endpoints exist but are not role-protected).
- The H2 file lock means DBeaver and the backend can't use the DB at the same time.
