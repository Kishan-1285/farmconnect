const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

// --- 1. CONFIGURATION & SETUP ---
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // For Base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// --- 2. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    // Don't stop the server, but log the error
  });

// --- 3. DATABASE MODELS (SCHEMAS) ---

// User Model (Farmer, Consumer, Admin)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['Farmer', 'Consumer', 'Admin'], default: 'Consumer' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  joinDate: { type: Date, default: Date.now },
  phone: { type: String },
});

// Password hashing
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password matching
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

// Crop Model
const CropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: String, required: true },
  image: { type: String }, // Base64
  farmer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  category: { type: String },
  location: { type: String },
  harvestDate: { type: String },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
});
const Crop = mongoose.model('Crop', CropSchema);

// Order Model
const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  crop: { type: mongoose.Schema.ObjectId, ref: 'Crop', required: true },
  cropName: { type: String },
  quantity: { type: Number },
  totalPrice: { type: Number },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  deliveryAddress: { type: String },
  phone: { type: String },
  paymentMethod: { type: String },
  orderDate: { type: String },
  deliveryDate: { type: String },
});
const Order = mongoose.model('Order', OrderSchema);

// Contact Message Model
const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);


// --- 4. MIDDLEWARE (Auth Check) ---
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'User is not an administrator' });
  }
};

// --- 5. HELPER FUNCTIONS ---
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// --- 6. API ROUTES (ENDPOINTS) ---

// A. Auth Routes (Register, Login, AdminLogin)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const user = await User.create({
      name: fullName,
      email,
      password,
      role: userType === 'farmer' ? 'Farmer' : 'Consumer',
    });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide email, password, and role' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (user.role !== role) {
      return res.status(401).json({ success: false, message: `This account is not registered as a ${role}` });
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === 'admin@farmconnect.com' && password === 'admin123') {
           let adminUser = await User.findOne({ email: 'admin@farmconnect.com' });
           if (!adminUser) { // Create the demo admin if it doesn't exist
             adminUser = new User({ name: 'Admin', email: 'admin@farmconnect.com', password: 'admin123', role: 'Admin' });
             await adminUser.save();
           }
           const admin = await User.findOne({ email: 'admin@farmconnect.com' });
           sendTokenResponse(admin, 200, res);
           return;
        }
        // Fallback for other admins in DB
        const user = await User.findOne({ email, role: 'Admin' }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        sendTokenResponse(user, 200, res);
    } catch (err) {
         res.status(500).json({ success: false, message: err.message });
    }
});

// B. User Management Routes (Admin Only)
app.get('/api/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'Admin' } });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, type, status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, 
      { name, email, phone, role: type, status },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/users/:id', protect, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// C. Crop Routes (Public, Farmer, Admin)
app.get('/api/crops', async (req, res) => { // Public: Get all crops (for testing, show all statuses)
  try {
    const crops = await Crop.find().populate('farmer', 'name');
    res.status(200).json({ success: true, data: crops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/crops/admin/all', protect, isAdmin, async (req, res) => { // Admin: Get ALL crops
  try {
    const crops = await Crop.find().populate('farmer', 'name');
    res.status(200).json({ success: true, data: crops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/crops/my-crops/all', protect, async (req, res) => { // Farmer: Get *my* crops
  try {
    if (req.user.role !== 'Farmer') return res.status(403).json({ success: false, message: 'Only farmers can view their crops' });
    const crops = await Crop.find({ farmer: req.user._id });
    res.status(200).json({ success: true, data: crops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/crops/:id', async (req, res) => { // Public: Get one crop
  try {
    const crop = await Crop.findById(req.params.id).populate('farmer', 'name location');
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    res.status(200).json({ success: true, data: crop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/crops', protect, async (req, res) => { // Farmer: Add Crop
  try {
    if (req.user.role !== 'Farmer') return res.status(403).json({ success: false, message: 'Only farmers can add crops' });
    
    const { cropName, description, price, quantity, image, category, location, harvestDate } = req.body;
    
    const crop = await Crop.create({
      name: cropName,
      description,
      price,
      quantity,
      image,
      category,
      location,
      harvestDate,
      farmer: req.user._id,
      status: 'active' // Default to active for display (can be changed by admin)
    });
    res.status(201).json({ success: true, data: crop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.put('/api/crops/:id', protect, async (req, res) => { // Farmer/Admin: Update Crop
  try {
    let crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

    // Check if user is the farmer OR an admin
    if (crop.farmer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this crop' });
    }
    
    // Farmers cannot approve their own pending crops
    if(req.user.role === 'Farmer' && crop.status === 'pending') {
        delete req.body.status;
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: crop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/crops/:id', protect, async (req, res) => { // Farmer/Admin: Delete Crop
  try {
    let crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

    // Check if user is the farmer OR an admin
    if (crop.farmer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this crop' });
    }

    await crop.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// D. Order Routes (Consumer, Admin)
app.post('/api/orders', protect, async (req, res) => { // Consumer: Create Order(s)
  try {
    const { cartItems, deliveryAddress, paymentMethod, phone } = req.body;
    const customer = req.user._id;
    const createdOrders = [];

    for (const item of cartItems) {
      const crop = await Crop.findById(item._id);
      if (!crop) return res.status(404).json({ success: false, message: `Crop ${item.name} not found`});

      const order = await Order.create({
        customer,
        farmer: crop.farmer,
        crop: crop._id,
        cropName: item.cropName,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        deliveryAddress,
        paymentMethod,
        phone: phone || req.user.phone,
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      });
      createdOrders.push(order);
    }
    res.status(201).json({ success: true, data: createdOrders });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/orders', protect, isAdmin, async (req, res) => { // Admin: Get all orders
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('farmer', 'name');
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/orders/:id', protect, isAdmin, async (req, res) => { // Admin: Update order status
  try {
    const { status } = req.body;
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    await order.save();
    
    // Re-populate to send back full data
    order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('farmer', 'name');

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// E. Stats Routes (Admin)
app.get('/api/stats/dashboard', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'Admin' } });
    const totalFarmers = await User.countDocuments({ role: 'Farmer' });
    const totalConsumers = await User.countDocuments({ role: 'Consumer' });
    const totalCrops = await Crop.countDocuments();
    const activeOrders = await Order.countDocuments({ status: { $in: ['pending', 'processing', 'shipped'] } });
    
    const revenueData = await Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: { totalUsers, totalFarmers, totalConsumers, totalCrops, activeOrders, totalRevenue },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// F. Contact Route (Public)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


// --- 7. START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});