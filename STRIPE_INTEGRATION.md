# Stripe Payment Integration — Valley Rose Hotel

## What Was Built

The booking flow previously used a fake card form with no real payment processing. This has been replaced with a full Stripe integration. Guests must now pay before their reservation is confirmed, and they choose between two options at checkout.

---

## How It Works (Flow)

```
Guest selects room & dates
        ↓
Guest fills personal info
        ↓
Guest reviews booking summary
        ↓
Guest chooses payment option:
  ┌─────────────────────┐   ┌──────────────────────────────┐
  │  Pay Full Amount    │   │  Pay Check-in Fee            │
  │  €{total cost}      │   │  €{fee set by admin}         │
  │  Nothing due later  │   │  Remaining due at check-in   │
  └─────────────────────┘   └──────────────────────────────┘
        ↓ (selecting either creates a Stripe PaymentIntent server-side)
Stripe card form appears (handles 3DS / SCA automatically)
        ↓
Stripe charges the card
        ↓
Reservation + Customer are created in the database
        ↓
Payment record is linked to the reservation
        ↓
Confirmation screen shown with reservation number
```

---

## Data Required to Go Live

You need **3 values** from your Stripe account. All of them are found at:
**[https://dashboard.stripe.com](https://dashboard.stripe.com) → Developers**

### 1. Stripe Secret Key
- Where: Stripe Dashboard → **Developers → API Keys → Secret key**
- Starts with `sk_test_...` (test) or `sk_live_...` (production)
- Goes in: `backend/.env`

```
STRIPE_SECRET_KEY=<your-secret-key-here>
```

### 2. Stripe Publishable Key
- Where: Stripe Dashboard → **Developers → API Keys → Publishable key**
- Starts with `pk_test_...` (test) or `pk_live_...` (production)
- Goes in: `frontend/.env`

```
VITE_STRIPE_PUBLISHABLE_KEY=<your-publishable-key-here>
```

### 3. Stripe Webhook Secret
- Where: Stripe Dashboard → **Developers → Webhooks → Add endpoint**
- Endpoint URL: `https://valley-rose-hotel-git-main-ahmed-alis-projects-588ffe47.vercel.app/api/payments/webhook`
- Events to select: `payment_intent.succeeded`, `payment_intent.payment_failed`
- After creating the endpoint, click it → copy the **Signing secret** (starts with `whsec_...`)
- Goes in: `backend/.env`

```
STRIPE_WEBHOOK_SECRET=<your-webhook-secret-here>
```

---

## One-Time Setup After Deployment

Run this once to seed the default check-in fee into the database:

```bash
cd backend
npm run seed:app-settings
```

This inserts:
- `checkin_fee_type` = `fixed`
- `checkin_fee_amount` = `50` (€50 by default)

After that, you can change these values anytime from the dashboard at **Payment Settings**.

---

## Test Cards (Stripe Test Mode)

Use these while `STRIPE_SECRET_KEY` starts with `sk_test_`:

| Card Number | Scenario |
|---|---|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |
| `4000 0000 0000 9995` | Payment declined (insufficient funds) |
| `4000 0000 0000 0002` | Payment declined (generic) |

For all test cards: use any future expiry date (e.g. `12/28`), any 3-digit CVC, any ZIP.

---

## New Files Created

### Backend
| File | Purpose |
|---|---|
| `backend/src/modules/appSettings/appSettings.model.js` | Stores check-in fee config in MongoDB |
| `backend/src/modules/appSettings/appSettings.controller.js` | GET (public) + PUT (admin) handlers |
| `backend/src/modules/appSettings/appSettings.routes.js` | Routes for `/api/app-settings` |
| `backend/src/scripts/seedAppSettings.js` | Seeds default check-in fee values |

### Frontend
| File | Purpose |
|---|---|
| `frontend/src/pages/booking/components/Payment.jsx` | Replaced — full Stripe Elements UI |

### Dashboard
| File | Purpose |
|---|---|
| `dashboard/src/services/appSettingsService.js` | API calls to `/api/app-settings` |
| `dashboard/src/pages/PaymentSettings/PaymentSettingsPage.jsx` | Admin page to configure check-in fee |

---

## Modified Files

### Backend
| File | Change |
|---|---|
| `backend/src/server.js` | Registered `/api/app-settings` route |
| `backend/src/modules/payment/payment.model.js` | Added `stripePaymentIntentId`, `paymentType`, `amountDue`; extended enum with `PartiallyPaid` |
| `backend/src/modules/payment/payment.controller.js` | Added `createIntent`, `confirmPayment`, `handleWebhook` |
| `backend/src/modules/payment/payment.routes.js` | Added 3 public Stripe routes |
| `backend/src/modules/offlineReservation/offlineReservation.model.js` | Added `PartiallyPaid` to paymentStatus enum |
| `backend/src/modules/offlineReservation/offlineReservation.controller.js` | Public reservations now start as `Pending` (not `Paid`) |
| `backend/.env` | Added `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` placeholders |
| `backend/package.json` | Added `stripe` dependency + `seed:app-settings` script |

### Frontend
| File | Change |
|---|---|
| `frontend/src/pages/booking/BookingPage.jsx` | Removed old card fields; added Stripe state fields |
| `frontend/src/pages/booking/components/FinalReview.jsx` | Added payment guard + `confirmPayment` call |
| `frontend/src/services/bookingService.js` | Added `getAppSettings`, `createPaymentIntent`, `confirmPayment` |
| `frontend/src/locales/en.js` | Added `payment.*` translation keys |
| `frontend/src/locales/de.js` | Added `payment.*` translation keys (German) |
| `frontend/.env` | Added `VITE_STRIPE_PUBLISHABLE_KEY` placeholder |
| `frontend/package.json` | Added `@stripe/react-stripe-js`, `@stripe/stripe-js` |

### Dashboard
| File | Change |
|---|---|
| `dashboard/src/router/AppRouter.jsx` | Added `/payment-settings` route |
| `dashboard/src/components/Layout/Sidebar.jsx` | Added "Payment Settings" nav item |

---

## Payment Status Values

Reservations and payment records now use these statuses:

| Status | Meaning |
|---|---|
| `Pending` | Reservation created, payment not yet confirmed |
| `Paid` | Full amount paid |
| `PartiallyPaid` | Check-in fee paid — remaining balance due at check-in |
| `Failed` | Payment failed or was declined |
| `Refunded` | Payment was refunded |

---

## What's Next

### High Priority

#### 1. Show Remaining Balance in Reservation Dashboard
The `OfflineReservation` record now has `paymentStatus: 'PartiallyPaid'` and the linked `Payment` record has an `amountDue` field. The dashboard's reservation list/detail views should show this clearly so staff know which guests have outstanding balances at check-in.

**Where to change:** `dashboard/src/pages/OfflineReservation/OfflineReservationPage.jsx` and `dashboard/src/pages/ManageBookings/ManageBookingsPage.jsx`
**Data available:** `reservation.paymentStatus`, `payment.amountDue`

#### 2. Mark Remaining Balance as Collected at Check-in
When a guest pays the outstanding balance at the hotel (cash or terminal), staff should be able to mark it as collected. This needs a "Collect remaining balance" button that calls `PATCH /api/payments/:id` to set `paymentStatus: 'Paid'` and `amountDue: 0`, and `PATCH /api/offline-reservations/:id/status` to update the reservation status.

#### 3. Stripe Dashboard Webhook (Required for Production)
Without the webhook, the system relies solely on the frontend calling `/api/payments/confirm`. The webhook is the safety net for cases where the user closes the tab after payment but before the reservation is created. Set it up in Stripe Dashboard before going live.

### Medium Priority

#### 4. Payment History Page in Dashboard
Currently, the `Payment` collection in MongoDB contains all payment records but there is no dashboard page to view them. A simple table showing: guest name, reservation number, amount paid, payment type, date, and Stripe transaction ID would be useful for accounting.

#### 5. Refund Support via Stripe
Add a "Refund" button in the reservation detail view. On click, call `stripe.refunds.create({ payment_intent: payment.stripePaymentIntentId })` on the backend, then update `paymentStatus: 'Refunded'` in both the `Payment` and `OfflineReservation` records.

**New endpoint needed:** `POST /api/payments/:id/refund` (admin only)

#### 6. Email Confirmation After Payment
After reservation is confirmed in `FinalReview.jsx`, send a confirmation email to the guest with their reservation number, dates, amount paid, and (if partial) the remaining balance. Use a service like Resend, SendGrid, or Nodemailer.

**New endpoint needed:** Called from within `createReservationPublic` or as a separate trigger after `confirmPayment`.

### Low Priority

#### 7. Switch to Live Mode
When ready, change both keys from `sk_test_`/`pk_test_` to `sk_live_`/`pk_live_` in the respective `.env` files. Also register a new webhook in Stripe Dashboard pointing to the same URL but using the live mode signing secret.

#### 8. Currency Support
The system is hardcoded to `EUR`. If other currencies are ever needed, the `currency` field exists on the `Payment` model and is passed to Stripe — it just needs to be made configurable.

---

## API Reference (New Endpoints)

### `GET /api/app-settings` — Public
Returns the current check-in fee configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "checkin_fee_type": "fixed",
    "checkin_fee_amount": "50"
  }
}
```

### `PUT /api/app-settings/:key` — Admin only
Updates a single setting. Requires `Authorization: Bearer <token>`.

**Body:** `{ "value": "30" }`

### `POST /api/payments/create-intent` — Public
Creates a Stripe PaymentIntent before card entry.

**Body:**
```json
{
  "amount": 45000,
  "currency": "eur",
  "paymentType": "full",
  "metadata": {
    "roomType": "Double Room",
    "guestEmail": "guest@example.com"
  }
}
```
**Response:** `{ "clientSecret": "pi_..._secret_...", "paymentIntentId": "pi_..." }`

### `POST /api/payments/confirm` — Public
Called after Stripe confirms the payment. Creates the Payment record and links it to the reservation.

**Body:**
```json
{
  "paymentIntentId": "pi_...",
  "reservationId": "682...",
  "customerId": "682...",
  "amount": 45000,
  "paymentType": "full",
  "totalCost": 450
}
```
**Response:** `{ "success": true, "paymentId": "682...", "transactionId": "pi_...", "amountDue": 0 }`

### `POST /api/payments/webhook` — Stripe only
Receives async payment events from Stripe. Requires the `stripe-signature` header and a raw (non-JSON-parsed) request body.

Handled events:
- `payment_intent.succeeded` → sets `paymentStatus` to `Paid` or `PartiallyPaid`
- `payment_intent.payment_failed` → sets `paymentStatus` to `Failed`
