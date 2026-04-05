import type { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config()

export const waitlistController = async (req: Request, res: Response) => {
  const { email } = req.body
  const RESEND_API_KEY = process.env.RESEND_API_KEY!
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL!

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email address.' })
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PlacePin <kerlin@placepin.io>',
        to: [NOTIFY_EMAIL],
        subject: `New waitlist signup: ${email}`,
        html: `<p><strong>${email}</strong> just joined the PlacePin waitlist.</p>`,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.log('Resend error', error)
      return res.status(500).json({ message: 'Could not join waitlist.' })
    }

    return res.status(200).json({ message: 'Successfully joined waitlist.' })
  } catch (err) {
    console.log('Could not join waitlist', err)
    res.status(500).json({ error: 'Could not join waitlist.' })
  }
}