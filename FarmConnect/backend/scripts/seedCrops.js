const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in backend .env');
  process.exit(1);
}

// --- Schemas (mirroring backend/server.js) ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['Farmer', 'Consumer', 'Admin'], default: 'Consumer' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  joinDate: { type: Date, default: Date.now },
  phone: { type: String },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

const CropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: String, required: true },
  image: { type: String },
  farmer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  category: { type: String },
  location: { type: String },
  harvestDate: { type: String },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
});

const User = mongoose.model('User', UserSchema);
const Crop = mongoose.model('Crop', CropSchema);

const buildImageUrl = (name) => {
  const query = encodeURIComponent((name || 'farm produce').trim());
  return `https://source.unsplash.com/featured/?${query}`;
};

const demoCrops = [
  {
    name: 'Tomato',
    description: 'Fresh, vine-ripened tomatoes perfect for salads and curries.',
    price: '38',
    quantity: '250',
    category: 'Vegetables',
    location: 'Coimbatore',
  },
  {
    name: 'Potato',
    description: 'Farm-grown potatoes with rich taste and firm texture.',
    price: '26',
    quantity: '500',
    category: 'Vegetables',
    location: 'Erode',
  },
  {
    name: 'Onion',
    description: 'Crisp red onions, ideal for daily cooking.',
    price: '32',
    quantity: '300',
    category: 'Vegetables',
    location: 'Tiruppur',
  },
  {
    name: 'Carrot',
    description: 'Crunchy carrots packed with nutrients.',
    price: '44',
    quantity: '200',
    category: 'Vegetables',
    location: 'Ooty',
  },
  {
    name: 'Banana',
    description: 'Sweet, ripe bananas from local farms.',
    price: '50',
    quantity: '180',
    category: 'Fruits',
    location: 'Pollachi',
  },
  {
    name: 'Mango',
    description: 'Juicy seasonal mangoes with rich aroma.',
    price: '120',
    quantity: '120',
    category: 'Fruits',
    location: 'Salem',
  },
  {
    name: 'Green Chilli',
    description: 'Spicy green chillies for bold flavor.',
    price: '60',
    quantity: '90',
    category: 'Vegetables',
    location: 'Dindigul',
  },
  {
    name: 'Spinach',
    description: 'Fresh spinach leaves for healthy meals.',
    price: '28',
    quantity: '150',
    category: 'Vegetables',
    location: 'Coimbatore',
  },
  {
    name: 'Coconut',
    description: 'Tender coconuts with refreshing water.',
    price: '45',
    quantity: '80',
    category: 'Fruits',
    location: 'Pollachi',
  },
  {
    name: 'Rice (Ponni)',
    description: 'Premium ponni rice, clean and aromatic.',
    price: '62',
    quantity: '400',
    category: 'Grains',
    location: 'Thanjavur',
  },
];

const seed = async () => {
  await mongoose.connect(MONGO_URI);

  let farmer = await User.findOne({ email: 'demo.farmer@farmconnect.com' });
  if (!farmer) {
    farmer = await User.create({
      name: 'Demo Farmer',
      email: 'demo.farmer@farmconnect.com',
      password: 'Farmer123',
      role: 'Farmer',
      status: 'Active',
      phone: '+91 90000 00000',
    });
  }

  let created = 0;
  for (const crop of demoCrops) {
    const existing = await Crop.findOne({ name: crop.name, farmer: farmer._id });
    const imageUrl = buildImageUrl(crop.name);

    if (existing) {
      if (!existing.image || existing.image.startsWith('data:')) {
        existing.image = imageUrl;
        await existing.save();
      }
      continue;
    }

    await Crop.create({
      ...crop,
      image: imageUrl,
      farmer: farmer._id,
      status: 'active',
    });
    created += 1;
  }

  console.log(`Seed complete. Added ${created} crops.`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
