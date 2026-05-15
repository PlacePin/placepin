import type { Request, Response } from 'express';

export const updateAddress = async (
  req: Request,
  res: Response,
) => {
  const { street, suite, city, state, zip } = req.body;
  const userId = req.userId;

  console.log(street, suite, city, state, zip)

  if (!userId) {
    return res.status(404).json({ message: 'User does not exist.' })
  }

  try {

  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unexpected Error' })
  }
}