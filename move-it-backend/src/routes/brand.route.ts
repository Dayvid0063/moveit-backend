import express from 'express';
import * as carBrandController from '../controllers/brand.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create', carBrandController.createCarBrand);
router.get('/', carBrandController.getCarBrands);
router.get('/:id', carBrandController.getCarBrandById);
router.put('/update/:id', carBrandController.updateCarBrand);
router.delete('/delete/:id', carBrandController.deleteCarBrand);

export default router;
