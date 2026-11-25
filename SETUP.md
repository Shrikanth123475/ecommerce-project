# ShopEase – Setup Guide

ShopEase is a React Native (Expo) shopping app backed by a Spring Boot API.

- `ecommerce 2/` – Spring Boot backend (port 8080, H2 file database in `data/`)
- `ecommerce-mobile/` – the ShopEase mobile app (Expo + React Native)

## 1. Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Git | any | |
| JDK | **21** | JDK 22+ (e.g. 27) breaks the Lombok build. |
| Node.js | **22.13+** | `nvm install 22 && nvm use 22` |
| Expo Go | latest | Install on your phone from the App Store / Play Store. |

Your phone and laptop must be on the **same Wi-Fi**. Some office or guest
networks block device-to-device traffic; if the phone cannot connect, use a
phone hotspot for both devices.

## 2. Get the code

```bash
git clone https://github.com/Shrikanth123475/ecommerce-project.git
cd ecommerce-project
```

If the repo is private, ask the owner to add you as a collaborator first.

## 3. Create the backend settings file

`application.properties` is git-ignored, so it is not in the clone. Create
`ecommerce 2/src/main/resources/application.properties` with:

```properties
spring.application.name=ecommerce

spring.datasource.url=jdbc:h2:file:./data/ecommerce_db
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.error.include-message=always

# Any random text of at least 32 characters
jwt.secret=change-me-to-a-long-random-string-of-32-plus-chars
```

Optional: to get a **merchant** account (the only role allowed to add, edit or
delete products through the API), add two more lines. The account is created on
startup. Nobody can become a merchant by registering.

```properties
merchant.email=merchant@shopease.com
merchant.password=choose-a-password
```

## 4. Start the backend

Run from the **project root** (the folder that contains `data/`):

```bash
JAVA_HOME=$(/usr/libexec/java_home -v 21) "ecommerce 2/mvnw" -f "ecommerce 2/pom.xml" spring-boot:run
```

Or use the helper script, which does the same thing and always uses the
project's `data/` folder (macOS):

```bash
./start-backend.sh
```

Leave the terminal open. It is ready when you see
`Started EcommerceApplication`.

Check it:

```bash
curl http://localhost:8080/api/products/categories
```

Expected: `["Electronics","Furniture","Laptop","Men","Mobile","Tablet","Watches","Women"]`
(the product catalog is loaded automatically the first time the backend starts).

> **Important:** the database path is relative (`./data/ecommerce_db`). Starting
> the backend from any other folder (for example inside `ecommerce 2/`) creates
> a new **empty** database, and you will see `[]` and "Invalid email or
> password". Always start from the project root.

## 5. Start the mobile app

In a second terminal:

```bash
cd ecommerce-mobile
npm install
npx expo start
```

- **Phone:** scan the QR code with Expo Go (Camera app on iPhone).
- **Browser:** press `w`, or open the `http://localhost:<port>` address Expo
  prints (usually 8081; Expo picks the next free port if it is busy). The
  backend accepts browser requests from any `localhost` port.
  For a phone-sized view press `Cmd+Option+I`, then `Cmd+Shift+M` in Chrome.

The app finds the backend automatically from the Expo server's address
(`http://<your-laptop-ip>:8080/api`), so no configuration is needed in
development. To point at a different backend, copy `.env.example` to
`.env.local` and set `EXPO_PUBLIC_API_URL`.

## 6. Try it

The database starts **empty** (no users, no orders), so register first.

1. Register a new account (your own email and password), then log in.
2. Browse and search products, filter by category and brand, open a product.
3. Add to cart, change quantities, place an order.
4. See it under **Orders**, open it, and cancel it if you like.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Can't reach the server" on the phone | Same Wi-Fi? Open `http://<laptop-ip>:8080/api/products/categories` in the phone browser. If it fails, use a hotspot. Get the IP with `ipconfig getifaddr en0`. |
| "Can't reach the server" in the browser | Is the backend running (step 4)? Open the app from a `http://localhost:<port>` address (not your laptop's IP). If it still fails, restart the backend so it picks up the latest CORS settings. |
| "Invalid email or password" and `[]` from the categories call | Backend started from the wrong folder. Stop it and start from the project root (step 4). |
| `AsyncStorageError: Native module is null` | Keep `@react-native-async-storage/async-storage` at `2.2.0` (the version Expo Go supports): `npx expo install @react-native-async-storage/async-storage`. |
| Maven fails with `ExceptionInInitializerError ... EndPosTable` | Wrong JDK. Use JDK 21 (see the `JAVA_HOME` in step 4). |
| Node "outdated and unsupported" warning | `nvm install 22 && nvm use 22`. |
| Dark tab bar / unreadable labels | The app is locked to light mode; restart with `npx expo start -c`. |

## Notes

- The database files (`data/*.db`) are **not** in git. The first start creates a
  fresh local database, so data does not sync between machines and there are no
  shared logins. Register your own account.
- Passwords are stored as BCrypt hashes (max 72 characters). If you have a
  database from before this change, the backend upgrades its plain-text
  passwords to hashes automatically at startup; logins keep working.
- Only one process can open the H2 database file at a time. If the backend says
  "Database may be already in use", close DBeaver (or any other backend) first.
- To stop the backend: Ctrl+C, or `pkill -f spring-boot`.
