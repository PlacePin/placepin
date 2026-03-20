import './jobs/index';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { connectToDB } from './config/mongoDatabase';
import authRoutes from './routes/auth/authRoutes';
import settingsRoutes from './routes/settings/settingsRoutes';
import stripeWebhookRoute from './routes/stripe/webhooks/stripeWebhookRoute';
import subscriptionRoutes from './routes/resources/subscriptionRoutes';
import usersRoutes from './routes/resources/usersRoutes';
import landlordDataRoute from './routes/resources/landlordDataRoute';
import { authenticateToken } from './middleware/authenticateToken';
import { chatSocket } from './chatSocket';
import messageRoutes from './routes/messages/messageRoutes';
import workOrderRoutes from './routes/workOrders/workOrderRoutes';

// Add a rate limiter as middleware 

dotenv.config()

const app = express()
const server = http.createServer(app);
const PORT = process.env.PORT || 3000

connectToDB()

// Middleware

app.use(cors())

// Webhooks - won't work if they're after the express.json()
app.use('/api', stripeWebhookRoute)

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/settings', authenticateToken, settingsRoutes)
app.use('/api/subscription', authenticateToken, subscriptionRoutes)
app.use('/api/users', authenticateToken, usersRoutes)
app.use('/api/landlords', authenticateToken, landlordDataRoute)
app.use('/api/messages', authenticateToken, messageRoutes)
app.use('/api/workorders', authenticateToken, workOrderRoutes)

// Adding chat socket to server
chatSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})