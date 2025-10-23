import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!

export const verifyToken = (token: string): any => {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN);
    if (!decoded || typeof decoded !== 'object') return null;
    return decoded;
};