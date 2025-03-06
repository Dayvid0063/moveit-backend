import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new car brand
export const createCarBrand = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, image } = req.body;
  
      const carBrand = await prisma.carBrand.create({
        data: { name, image },
      });
  
      return res.status(201).json(carBrand);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

// Get all car brands
export const getCarBrands = async (req: Request, res: Response): Promise<Response> => {
  try {
    const carBrands = await prisma.carBrand.findMany({
      include: { cars: true }, // Include related car data
    });

    return res.status(200).json(carBrands);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// Get a single car brand by ID
export const getCarBrandById = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const carBrand = await prisma.carBrand.findUnique({
      where: { id },
      include: { cars: true },
    });

    if (!carBrand) {
      return res.status(404).json({ error: 'Car brand not found' });
    }

    return res.status(200).json(carBrand);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};


// Update a car brand
export const updateCarBrand = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { name, image } = req.body;
  
      const carBrand = await prisma.carBrand.update({
        where: { id },
        data: { name, image },
      });
  
      return res.status(200).json(carBrand);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  };

// Delete a car brand
export const deleteCarBrand = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    await prisma.carBrand.delete({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
