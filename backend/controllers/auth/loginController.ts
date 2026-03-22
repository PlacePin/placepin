import type { Request, Response } from 'express';
import { TenantModel } from '../../database/models/Tenant.model';
import { LandlordModel } from '../../database/models/Landlord.model';
import { TradesmenModel } from '../../database/models/Tradesmen.model';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

export const loginController = async (req: Request, res: Response) => {

  // Destructures the email and password and saves the env access token into a var
  const { email, password } = req.body
  const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!

  try {
    // Looking for the email in the database. Store the result in a var named user
    const user = await TenantModel.findOne({ email }) ||
                 await LandlordModel.findOne({ email }) ||
                 await TradesmenModel.findOne({ email });

    // If the user does not exist in either database return error
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Try again.' })
    }

    // Comparing the entered password with a password in the database
    const isPasswordAMatch = await bcrypt.compare(password, user.password)

    // If the password is not a match throw error
    if (!isPasswordAMatch) {
      return res.status(401).send({ message: 'Invalid credentials. Try again.' })
    }

    // Creating an accessToke and encoding it with info. Expires in 30 days
    const accessToken = jwt.sign({
      email: user.email,
      userID: user._id,
      username: user.username,
      fullName: user.fullName,
      accountType: user.accountType,
    },
    // Remember to switch this to 1 hour and httpOnly cookies after xss practice
      JWT_ACCESS_TOKEN,
      { expiresIn: '30d' }
    )

    // TODO: Add refresh tokens

    user.lastActive = new Date()
    user.save()

    // Respond with token, email, username, user, accountType
    return res.status(200).json({ accessToken, email, username: user.username, accountType: user.accountType })
  } catch (err) {
    console.log('Could not login', err)
    res.status(500).json({ error: "Could not login" })
  }
}