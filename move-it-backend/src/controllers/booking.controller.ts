import { PrismaClient, Booking, Car } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

type CreateBookingRequest = Request<{}, {}, {
  startDate: string;
  endDate: string;
  carId: string;
  userId: string;
  transactionRef: string;
  totalAmount: number;
  numberOfDays: number;
}>;

// Create a new booking
export const createBooking = async (req: CreateBookingRequest, res: Response) => {
  const { startDate, endDate, carId, userId, transactionRef, totalAmount, numberOfDays } = req.body;

  try {
    // Get the car price per day
    const car: Car | null = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const booking: Booking = await prisma.booking.create({
      data: {
        startDate,
        endDate,
        numberOfDays,
        totalAmount,
        transactionRef,
        carId,
        userId,
      },
    });

    return res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking', details: error });
  }
};

type GetUserBookingsRequest = Request<{ userId: string }>;

// Retrieve bookings by user ID
export const getUserBookings = async (req: GetUserBookingsRequest, res: Response) => {
  const { userId } = req.params;

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { car: true },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bookings', details: error });
  }
};

// Retrieve all bookings
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { car: true, user: true },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve all bookings', details: error });
  }
};
