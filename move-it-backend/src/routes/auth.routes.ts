import express from 'express';
import { register, login, getProfile, loginAdmin, getUsers, getUserById, deleteUserById, updateProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/login/admin', loginAdmin);
router.get('/profile', getProfile);
router.get('/users',  getUsers); // Route to get all users
router.get('/users/:id', getUserById); // Route to get user by ID
router.delete('/users/:id', authenticate, deleteUserById); // Route to delete user by ID
router.put('/profile', updateProfile); // Route to update user profile

export default router;
