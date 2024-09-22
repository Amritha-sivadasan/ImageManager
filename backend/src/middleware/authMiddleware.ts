import { validateToken } from "../utils/jwtGenerate";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload; 
  }

  export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({ message: 'Authorization header is missing' });
    }
  
    const token = authHeader.split(' ')[1]; 
  
    try {

      const decoded = validateToken(token, 'auth');
      req.user = decoded; 
  
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };