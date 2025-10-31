import type { Request, Response } from "express";

export const sendMessage = async (
  req: Request,
  res: Response
) => {

  console.log('hhhh')
  res.status(200).json({ message: 'test' })
}