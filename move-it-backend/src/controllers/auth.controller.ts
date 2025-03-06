import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, RegisterRequestBody, LoginRequestBody, UserResponse } from '../types';

const prisma = new PrismaClient();

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName, phoneNumber } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phoneNumber
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: true
            }
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: (error as Error).message });
    }
};

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        const userResponse: UserResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            role: user.role
        };

        res.json({ user: userResponse, token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
    }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: true
            }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: (error as Error).message });
    }
};

export const loginAdmin = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.role !== "ADMIN") {
            res.status(401).json({ message: "Unauthorized!" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid Credentials!" });
            return;
        }

        const age = 1000 * 60 * 60 * 24; // 1 day

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET!,
            { expiresIn: age }
        );

        const { password: _, ...userInfo } = user;

        res
            .cookie("token", token, {
                httpOnly:true,
                maxAge: age,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
            })
            .status(200)
            .json(userInfo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to login!" });
    }
};

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: true,
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: (error as Error).message });
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: true,
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: (error as Error).message });
    }
};

// Delete user by ID
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: (error as Error).message });
    }
};

// Update user profile
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { userId } = req.user!;
      const { email, firstName, lastName, phoneNumber, password } = req.body;
  
      // Hash the password if it is provided
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          email,
          firstName,
          lastName,
          phoneNumber,
          ...(password && { password: hashedPassword }) // Update the password if provided
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          role: true
        }
      });
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: (error as Error).message });
    }
  };
  
