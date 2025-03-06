import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

// Define the JWT payload type
interface JWTPayload {
    userId: string;
    role: UserRole;
}

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const authorizeAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    if (req.user?.role !== UserRole.ADMIN) {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
};
