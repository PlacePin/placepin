import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB } from './config/mongoDatabase';
import signupRoute from './routes/auth/signupRoute';
import loginRoute from './routes/auth/loginRoute';
import landlordBasicInfoRoute from './routes/settings/landlordBasicInfoRoute';
import stripeSubscriptionCheckoutFormRoute from './routes/stripe/stripeSubscriptionCheckoutFormRoute';
import stripeSaveCardFormRoute from './routes/stripe/stripeSaveCardFormRoute';
import stripeWebhookRoute from './routes/stripe/webhooks/stripeWebhookRoute';
import subscriptionRoute from './routes/resources/subscriptionRoute';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

connectToDB()

// Middleware

app.use(cors())

// Webhooks
// Webhooks won't work if they're after the express.json()
app.use('/api', stripeWebhookRoute)

app.use(express.json())
app.use('/api', signupRoute)
app.use('/api', loginRoute)
app.use('/api', landlordBasicInfoRoute)
app.use('/api', stripeSubscriptionCheckoutFormRoute)
app.use('/api', stripeSaveCardFormRoute)
app.use('/api', subscriptionRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})