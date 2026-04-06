import type { Request, Response } from 'express';
import { TenantModel, type TenantDocumentType } from '../../database/models/Tenant.model';
import { LandlordModel, type LandlordDocumentType } from '../../database/models/Landlord.model';
import { TradesmenModel, type TradesmenDocumentType } from '../../database/models/Tradesmen.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

export const signupController = async (req: Request, res: Response) => {

  const { email, username, address, password, phoneNumber, referral, accountType } = req.body
  const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!

  let hashedPassword: string;
  const saltRounds = 10
  let newUser: LandlordDocumentType | TenantDocumentType | TradesmenDocumentType | null = null;
  let existingEmail: string | null;
  let matchingLandlord: LandlordDocumentType | TenantDocumentType | TradesmenDocumentType | null = null

  try {
    // Check if user already exists in either collection
    existingEmail = await TenantModel.findOne({ email }) ||
                    await LandlordModel.findOne({ email }) ||
                    await TradesmenModel.findOne({ email })

    if (existingEmail) {
      res.status(409).json({ message: 'Email already in use. Please use a different email address.' })
      return
    }

    // Hash the password before storing in DB for security
    hashedPassword = await bcrypt.hash(password, saltRounds)

    let generatedUsername = username.split(' ').join('');

    generatedUsername = '@' + generatedUsername + String(Math.floor(Math.random() * 999999))

    // Create a new user document depending on account type
    if (accountType === 'tenant') {
      newUser = new TenantModel({
        fullName: username,
        username: generatedUsername,
        email,
        address,
        accountType,
        password: hashedPassword,
        phoneNumber,
        landlordReferral: referral,
        subscription: {
          isSubscribed: false,
          savedPaymentMethod: null,
          stripeCustomerId: null,
          tier: "Landlord-Sponsored",
        },
      })
    }

    if (accountType === 'landlord') {
      newUser = new LandlordModel({
        fullName: username,
        username: generatedUsername,
        email,
        address,
        accountType,
        password: hashedPassword,
        phoneNumber,
        subscription: {
          isSubscribed: false,
          savedPaymentMethod: null,
          stripeCustomerId: null,
        },
      })
    }

    if (accountType === 'tradesmen') {
      newUser = new TradesmenModel({
        fullName: username,
        username: generatedUsername,
        email,
        address,
        accountType,
        password: hashedPassword,
        phoneNumber,
        subscription: {
          isSubscribed: false,
          savedPaymentMethod: null,
          stripeCustomerId: null,
        },
      })
    }

    if (!newUser) {
      return res.status(400).json({ message: 'Retry creating an account.' })
    }

    if (accountType === 'tenant' && referral !== '') {
      matchingLandlord = await LandlordModel.findOneAndUpdate(
        { "properties.referralCode": referral },
        {
          $push: {
            "properties.$.tenants": {
              tenantId: newUser._id,
              referred: true,
              moveInDate: new Date()
            },
          }
        },
        { new: true }
      )

      if (!matchingLandlord) {
        return res.status(422).json({ message: 'Not a valid referral code. Try again, or leave blank!' })
      }

      (newUser as TenantDocumentType).referredByLandlord = matchingLandlord._id
    }

    // Save the user to the database
    await newUser.save();

    const stripeAccess = new Stripe(STRIPE_SECRET_KEY)

    // If the user already has a stripe customer id save it here
    let stripeCustomerId = newUser.subscription!.stripeCustomerId;

    // If the user doesn't have the stripe customer id create it here
    if (!stripeCustomerId) {
      const customer = await stripeAccess.customers.create({
        email: newUser.email,
      });

      stripeCustomerId = customer.id;

      newUser.subscription!.stripeCustomerId = customer.id;
    };

    // Save again to update the Stripe Customer ID
    newUser.lastActive = new Date();
    await newUser.save();

    // Grabbing the userId transforming it to a string
    const userID = newUser._id.toString();

    // Create JWT with email, userID and username as payload
    const accessToken = jwt.sign({
      email,
      userID,
      username,
      fullName: username,
      accountType,
    },
      // Remember to switch this to 1 hour and httpOnly cookies after xss practice
      JWT_ACCESS_TOKEN,
      { expiresIn: '30d' }
    )

    // TODO: Add refresh tokens

    // Respond with the token and account type
    return res.status(201).json({ message: 'User Created Successfully', accessToken, accountType })
  } catch (err) {
    console.error('Failed to create user', err)
    return res.status(500).json({ message: 'Failed to create new user' })
  }
}
