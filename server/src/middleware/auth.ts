import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // TODO: verify the token exists and add the user data to the request object
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    req.user = decoded as JwtPayload; 
next();
return();
  }catch (err) {
    return res.status(403).json({message: 'Invalid token'});
  }
};
