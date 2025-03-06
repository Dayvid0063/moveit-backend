import express from 'express';
import * as carController from '../controllers/car.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create', carController.createCar);
router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);
router.put('/update/:id', carController.updateCar);
router.delete('/delete/:id', carController.deleteCar);

export default router;
