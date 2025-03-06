import express from 'express';
import { createBooking, getAllBookings, getUserBookings } from '../controllers/booking.controller';

const router = express.Router();

router.post('/create', createBooking);
router.get('/user/:userId', getUserBookings);
router.get('/', getAllBookings);

export default router;