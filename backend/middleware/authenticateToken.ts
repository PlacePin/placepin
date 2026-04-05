import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Makes sure the user is auth based on userId

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(' ')[1];
  const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!;

  if (!accessToken) return res.status(401).json({ message: 'Missing authorization token' });

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_TOKEN);

    if (!decoded || typeof decoded !== 'object') {
      return res.status(400).json({ message: "Something's wrong with your access token." })
    }

    req.userId = (decoded as any).userID;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: err.message });
    }
    res.status(500).json({ message: "Unexpected authentication error" });
  }
};
