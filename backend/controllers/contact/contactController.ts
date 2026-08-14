import type { Request, Response } from 'express';
import axios from 'axios';

export const sendContactMessage = async (
  req: Request,
  res: Response
) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY!
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL!

  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Enter a valid email.' });
  }

  try {
    await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'PlacePin <support@placepin.io>',
        to: [NOTIFY_EMAIL],
        reply_to: email,
        subject: `New contact form query from ${name}`,
        html: `
          <p><strong>From:</strong> ${name} (${email})</p>
          <hr />
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return res.status(200).json({ message: "Thanks for reaching out! We'll get back to you soon." })

  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Resend response:', err.response?.data)
    }
    console.error('sendContactMessage failed:', err)
    return res.status(500).json({ message: 'Could not send your message. Please try again later.' })
  }
}
