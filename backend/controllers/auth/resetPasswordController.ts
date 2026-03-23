import type { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { TenantModel } from '../../database/models/Tenant.model';
import { LandlordModel } from '../../database/models/Landlord.model';
import { TradesmenModel } from '../../database/models/Tradesmen.model';

export const resetPasswordController = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user =
            await TenantModel.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: new Date() } }) ||
            await LandlordModel.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: new Date() } }) ||
            await TradesmenModel.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: new Date() } });

        if (!user) {
            return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.set('passwordResetToken', undefined);
        user.set('passwordResetExpires', undefined);
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully. You can now log in.' });

    } catch (err) {
        console.error('resetPasswordController error:', err);
        return res.status(500).json({ message: 'Something went wrong, please try again.' });
    }
};
