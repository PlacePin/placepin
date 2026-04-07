import type { Request, Response } from 'express';
import axios from 'axios';

export const addEmailForFeatureUpdates = async (
  req: Request,
  res: Response
) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY!
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL!

  const { contactEmail } = req.body

  try {
    await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'PlacePin <support@placepin.io>',
        to: [NOTIFY_EMAIL],
        subject: `${contactEmail} wants to be notified on new features!`,
        html: `<p><strong>${contactEmail}</strong> joined the PlacePin new feature list.</p>`,
      },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      })

    return res.status(200).json({ message: 'Successfully joined feature list' })

  } catch (err) {
    console.error('Unexpected Error:', err)
    return res.status(500).json({ message: 'Could not join features list. Try again at a later time!' })
  }
}