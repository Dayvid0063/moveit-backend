import { Request, Response } from 'express';
import { PrismaClient, Car } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new car
export const createCar = async (req: Request<{}, {}, Omit<Car, 'id'>>, res: Response): Promise<void> => {
  try {
    const {
      name,
      plateNumber,
      status,
      pricePerDay,
      passengerCapacity,
      description,
      images,
      features,
      brandId,
    } = req.body;

    const car = await prisma.car.create({
      data: {
        name,
        plateNumber,
        status,
        pricePerDay,
        passengerCapacity,
        description,
        images,
        features,
        brandId,
      },
    });
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get all cars
export const getCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const cars = await prisma.car.findMany({
      include: { brand: true }, // Include related brand data
    });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get a single car by ID
export const getCarById = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const car = await prisma.car.findUnique({
        where: { id },
        include: { brand: true },
      });
  
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      
      return res.status(200).json(car);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

// Update a car
export const updateCar = async (req: Request<{ id: string }, {}, Partial<Omit<Car, 'id'>>>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    const car = await prisma.car.update({
      where: { id },
      data,
    });
    res.status(200).json(car);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Delete a car
export const deleteCar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.car.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
