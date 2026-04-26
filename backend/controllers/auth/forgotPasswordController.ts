import type { Request, Response } from 'express';
import crypto from 'crypto';
import { TenantModel } from '../../database/models/Tenant.model';
import { LandlordModel } from '../../database/models/Landlord.model';
import { TradesmenModel } from '../../database/models/Tradesmen.model';
import { emailPasswordReset } from '../../utils/emailService';

const genericResponse = { message: 'If an account with that email exists, a reset link will be sent.' }

export const forgotPasswordController = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'An email is required.' }) // we're sending this generic message to prevent potential hackers from finding out if an email exists or not when sending requests
    }

    try {
        const user =
            (await TenantModel.findOne({ email: email.toLowerCase().trim() })) ||
            (await LandlordModel.findOne({ email: email.toLowerCase().trim() })) ||
            (await TradesmenModel.findOne({ email: email.toLowerCase().trim() }));

        if (!user) {
            return res.status(200).json(genericResponse);
        }

        const rawToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

        user.passwordReset = { token: hashedToken, expires: new Date(Date.now() + 60 * 60 * 1000) } //creates an expiration time of 1 hour from when the resetToken was created
        await user.save();

        const clientUrl = process.env.CLIENT_URL;

        const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

        await emailPasswordReset(user.email, resetUrl)

        return res.status(200).json(genericResponse);

    } catch (err) {
        console.error('forgotPasswordController error:', err)
        return res.status(500).json({ message: 'Something went wrong, please try again.' })
    }

}