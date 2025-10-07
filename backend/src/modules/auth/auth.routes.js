const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const { 
  register, 
  login, 
  registerValidators, 
  loginValidators,
  getAdmins,
  createAdmin,
  createAdminValidators,
  deleteAdmin,
  changePassword,
  changePasswordValidators
} = require('./auth.controller');

// Public routes
router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);

// Protected routes - require authentication
router.use(authenticate); // All routes below require authentication

// Admin management routes - require admin role
router.get('/admins', authorize('admin'), getAdmins);
router.post('/admins', authorize('admin'), createAdminValidators, createAdmin);
router.delete('/admins/:adminId', authorize('admin'), deleteAdmin);

// Password management - any authenticated user
router.put('/change-password', changePasswordValidators, changePassword);

module.exports = router;



