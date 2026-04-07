import type { Request, Response } from 'express';
import axios from 'axios';

export const waitlistController = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body
  const RESEND_API_KEY = process.env.RESEND_API_KEY!
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL!

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email address.' })
  }

  try {
    await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'PlacePin <support@placepin.io>',
        to: [NOTIFY_EMAIL],
        subject: `New waitlist signup: ${email}`,
        html: `<p><strong>${email}</strong> just joined the PlacePin waitlist.</p>`,
      },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return res.status(200).json({ message: 'Successfully joined waitlist.' })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Resend response:', error.response?.data)
    }
    console.error('Resend error:', error)
    return res.status(500).json({ message: 'Could not join waitlist.' })
  }
}