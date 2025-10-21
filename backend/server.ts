import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB } from './config/mongoDatabase';
import signupRoute from './routes/auth/signupRoute';
import loginRoute from './routes/auth/loginRoute';
import userBasicInfoRoute from './routes/settings/userBasicInfoRoute';
import stripeSubscriptionCheckoutFormRoute from './routes/stripe/stripeSubscriptionCheckoutFormRoute';
import stripeSaveCardFormRoute from './routes/stripe/stripeSaveCardFormRoute';
import stripeWebhookRoute from './routes/stripe/webhooks/stripeWebhookRoute';
import subscriptionRoute from './routes/resources/subscriptionRoute';
import inviteRoute from './routes/resources/inviteRoute';
import userRoute from './routes/resources/userRoute';
import landlordTenantDataRoute from './routes/resources/landlordTenantDataRoute';

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
app.use('/api', userBasicInfoRoute)
app.use('/api', stripeSubscriptionCheckoutFormRoute)
app.use('/api', stripeSaveCardFormRoute)
app.use('/api', subscriptionRoute)
app.use('/api', inviteRoute)
app.use('/api', userRoute)
app.use('/api', landlordTenantDataRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})