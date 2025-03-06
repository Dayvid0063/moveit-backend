import { Request } from 'express';
import { User, UserRole } from '@prisma/client';

// Request types
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

// Request body types
export interface RegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

// Response types
export type UserResponse = Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'bookings'>;

export interface BookingRequestBody {
  startDate: Date;
  endDate: Date;
  carId: string;
}

export interface BookingResponse {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
  userId: string;
  carId: string;
}
