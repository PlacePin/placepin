import jwt from 'jsonwebtoken';

export const verifyToken = (token: string, secret: string): any => {
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded !== 'object') return null;
    return decoded;
};