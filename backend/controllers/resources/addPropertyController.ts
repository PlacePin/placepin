import type { Request, Response } from "express";

export const addPropertyController = (req: Request, res: Response) => {
  const accessToken = req.params.id;

  console.log(accessToken)
  

}