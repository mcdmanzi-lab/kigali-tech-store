require('dotenv').config({ path: './.env.local' })
const express = require('express')
const Stripe = require('stripe')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const stripeSecret = process.env.STRIPE_SECRET_KEY
if (!stripeSecret) {
  console.warn('Warning: STRIPE_SECRET_KEY not set in server/.env.local')
}
const stripe = Stripe(stripeSecret || '')

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body
    if (!amount) return res.status(400).json({ error: 'Missing amount' })

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 4242
app.listen(PORT, () => console.log(`Stripe server listening on http://localhost:${PORT}`))
