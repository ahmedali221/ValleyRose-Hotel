const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./user.model');

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign({ sub: user._id, role: user.role }, secret, { expiresIn: '7d' });
};

const registerValidators = [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'user']),
];

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already in use' });
  const user = await User.create({ name, email, password, role });
  const token = signToken(user);
  res.status(201).json({ user: { id: user.id, name, email, role: user.role }, token });
}

const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ user: { id: user.id, name: user.name, email, role: user.role }, token });
}

// Get all admins (admin only)
async function getAdmins(req, res) {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 });
    res.json(admins.map(admin => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
      isMainAdmin: admin.isMainAdmin || false
    })));
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
}

// Create new admin (admin only)
const createAdminValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('isMainAdmin').optional().isBoolean().withMessage('isMainAdmin must be a boolean'),
];

async function createAdmin(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, password, isMainAdmin = false } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // If setting as main admin, ensure no other main admin exists
    if (isMainAdmin) {
      const existingMainAdmin = await User.findOne({ isMainAdmin: true });
      if (existingMainAdmin) {
        return res.status(409).json({ message: 'A main admin already exists' });
      }
    }

    // Create new admin user
    const newAdmin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'admin',
      isMainAdmin: isMainAdmin || false
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
        isMainAdmin: newAdmin.isMainAdmin
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin' });
  }
}

// Delete admin (admin only, cannot delete main admin)
async function deleteAdmin(req, res) {
  try {
    const { adminId } = req.params;
    
    // Find the admin to delete
    const adminToDelete = await User.findById(adminId);
    if (!adminToDelete) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Prevent deletion of main admin
    if (adminToDelete.isMainAdmin) {
      return res.status(403).json({ message: 'Cannot delete main admin' });
    }

    // Prevent non-admin users from being deleted through this endpoint
    if (adminToDelete.role !== 'admin') {
      return res.status(403).json({ message: 'Can only delete admin users' });
    }

    await User.findByIdAndDelete(adminId);
    
    res.json({ 
      message: 'Admin deleted successfully',
      deletedAdmin: {
        id: adminToDelete._id,
        name: adminToDelete.name,
        email: adminToDelete.email
      }
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Error deleting admin' });
  }
}

// Change password for current user
const changePasswordValidators = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

async function changePassword(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
}

module.exports = { 
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
};



