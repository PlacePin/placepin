import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB } from './config/mongoDatabase';
import authRoutes from './routes/auth/authRoutes';
import settingsRoutes from './routes/settings/settingsRoutes';
import stripeSubscriptionCheckoutFormRoute from './routes/stripe/stripeSubscriptionCheckoutFormRoute';
import stripeSaveCardFormRoute from './routes/stripe/stripeSaveCardFormRoute';
import stripeWebhookRoute from './routes/stripe/webhooks/stripeWebhookRoute';
import subscriptionRoute from './routes/resources/subscriptionRoute';
import inviteRoute from './routes/resources/inviteRoute';
import userRoute from './routes/resources/userRoute';
import landlordTenantDataRoute from './routes/resources/landlordTenantDataRoute';
import landlordPropertyDataRoute from './routes/resources/landlordPropertyDataRoute';
import { authenticateToken } from './middleware/authenticateToken';

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
app.use('/api/auth', authRoutes)
app.use('/api/settings', authenticateToken, settingsRoutes)
app.use('/api', stripeSubscriptionCheckoutFormRoute)
app.use('/api', stripeSaveCardFormRoute)
app.use('/api', subscriptionRoute)
app.use('/api', inviteRoute)
app.use('/api/user', authenticateToken, userRoute)
app.use('/api', landlordTenantDataRoute)
app.use('/api', landlordPropertyDataRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})