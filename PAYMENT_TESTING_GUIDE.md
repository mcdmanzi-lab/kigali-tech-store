# Payment Testing Guide - Kigali Tech Store

## Setup Complete ✅

Your payment system is now ready. Follow these steps to test payments:

---

## Step 1: Start the Backend Server

**Windows (PowerShell):**
```powershell
cd "c:\Users\lenovo\Desktop\internship\E-COMMERCE TASK\kigali-tech-store\server"
node index.js
```

**Expected Output:**
```
Stripe server listening on http://localhost:4242
```

⚠️ **Keep this terminal running!** The server must stay active for payments to work.

---

## Step 2: Start Your Vue App

In another terminal:
```powershell
cd "c:\Users\lenovo\Desktop\internship\E-COMMERCE TASK\kigali-tech-store"
npm run dev
```

---

## Step 3: Test Payment with Stripe Test Cards

Navigate to checkout and use these **test card numbers**:

### ✅ Successful Payment
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/25`)
- **CVC:** Any 3 digits (e.g., `123`)
- **Name:** Any name

### ❌ Declined Payment
- **Card Number:** `4000 0000 0000 0002`
- **Expiry:** Any future date
- **CVC:** Any 3 digits

### 🔄 Requires Authentication (3D Secure)
- **Card Number:** `4000 0025 0000 3155`
- **Expiry:** Any future date
- **CVC:** Any 3 digits

---

## Step 4: Check Payment Logs

1. **Frontend Console** (Browser DevTools - F12):
   - Shows checkout steps and payment confirmation
   - Will show "✓ Payment succeeded!" when successful

2. **Backend Server Terminal**:
   - Shows payment intent creation
   - Shows successful API calls

3. **Stripe Dashboard**:
   - Visit: https://dashboard.stripe.com/test/payments
   - Log in with your Stripe account
   - See all test transactions

---

## Troubleshooting

### ❌ "Cannot connect to payment server"
- **Problem:** Backend server isn't running
- **Solution:** Make sure `node index.js` is running in the server folder

### ❌ "Stripe not configured"
- **Problem:** Missing Stripe keys
- **Solution:** Check both files have Stripe keys:
  - `.env.local` → VITE_STRIPE_PK (public key)
  - `server/.env.local` → STRIPE_SECRET_KEY (secret key)

### ❌ "Payment failed"
- **Problem:** Card was declined or invalid
- **Solution:** Use test cards from the list above

### ❌ "No client secret received"
- **Problem:** Server error creating payment intent
- **Solution:** 
  1. Check server terminal for errors
  2. Verify STRIPE_SECRET_KEY is set
  3. Restart the server

---

## Email Notifications

⚠️ **Important:** Stripe sandbox does NOT send real confirmation emails. To view transactions:

1. Go to https://dashboard.stripe.com/test/payments
2. Click on any payment to see full details
3. In production, webhooks would trigger email confirmations

---

## Environment Variables

### `.env.local` (Frontend)
```
VITE_STRIPE_PK=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

### `server/.env.local` (Backend)
```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
PORT=4242
```

---

## Payment Flow Diagram

```
1. Customer fills checkout form (shipping address)
                ↓
2. Customer enters card details (payment step)
                ↓
3. Frontend calls: POST http://localhost:4242/create-payment-intent
                ↓
4. Backend creates PaymentIntent with Stripe API
                ↓
5. Backend returns clientSecret to frontend
                ↓
6. Frontend confirms payment with Stripe.confirmCardPayment()
                ↓
7. Stripe processes payment (returns status: 'succeeded')
                ↓
8. Frontend creates order in local store
                ↓
9. Redirect to order success page
```

---

## Success Indicators ✅

When payment is successful, you should see:

1. **Browser Console:**
   ```
   ✓ PaymentIntent created: pi_...
   Confirming payment with Stripe...
   ✓ Payment confirmed. Status: succeeded
   ✓ Payment succeeded!
   ```

2. **Order Created:**
   - Page redirects to `/order-success/:orderId`
   - Shows "Thank you for your purchase"
   - Cart is cleared

3. **Stripe Dashboard:**
   - New charge appears under "Payments"
   - Amount shows in USD (e.g., $5.00)
   - Status shows "Succeeded"

---

## For Production (Future)

When you deploy to production:

1. **Replace test keys with live keys:**
   - `pk_live_...` (public key)
   - `sk_live_...` (secret key)

2. **Update server URL** (currently localhost:4242)
   - Change to your production server URL

3. **Set up Stripe Webhooks:**
   - Listen for `payment_intent.succeeded`
   - Send confirmation emails
   - Update order status

---

## Questions?

Check Stripe Documentation: https://stripe.com/docs/testing
