# Allo Inventory Reservation System
A Next.js inventory reservation system built for Allo Engineering Take-Home Exercise.

---

## Features
- Product inventory management
- Warehouse-based stock tracking
- Reservation system with expiry
- Concurrency-safe reservation handling
- Confirm and release reservation APIs
- Countdown timer for checkout
- Automatic stock updates
- Reservation expiry validation

---

## Tech Stack
- Next.js 16
- TypeScript
- Prisma
- Supabase PostgreSQL
- Tailwind CSS

---
## Setup Instructions
### 1. Install dependencies
npm install
### 2. Configure environment variables
Create `.env`
DATABASE_URL="your_database_url"
### 3. Generate Prisma client
npx prisma generate
### 4. Push schema to database
npx prisma db push
### 5. Seed database
npx tsx prisma/seed.ts
### 6. Run development server
npm run dev

---

## API Endpoints

### Get Products
GET /api/products

### Get Warehouses
GET /api/warehouses

### Create Reservation
POST /api/reservations

### Confirm Reservation
POST /api/reservations/:id/confirm

### Release Reservation
POST /api/reservations/:id/release

---

## Concurrency Handling
Prisma transactions are used to safely update reserved stock and prevent overselling when multiple users attempt reservations simultaneously.

---

## Expiry Handling
Reservations expire automatically after a fixed duration. Expired reservations cannot be confirmed.

---

## Future Improvements
- Redis distributed locking
- Background cleanup jobs
- Idempotency keys
- Improved UI notifications
- Authentication system