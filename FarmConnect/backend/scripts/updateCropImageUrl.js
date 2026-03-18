const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const [,, cropName, imageUrl] = process.argv;

if (!cropName || !imageUrl) {
  console.error("Usage: node scripts/updateCropImageUrl.js \"Crop Name\" \"https://example.com/image.jpg\"");
  process.exit(1);
}

const { MONGO_URI } = process.env;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI in backend .env");
  process.exit(1);
}

const CropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
});
const Crop = mongoose.model("Crop", CropSchema);

const run = async () => {
  await mongoose.connect(MONGO_URI);
  const crop = await Crop.findOne({ name: cropName });
  if (!crop) {
    console.error(`Crop not found: ${cropName}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  crop.image = imageUrl;
  await crop.save();

  console.log(`Updated image URL for crop: ${cropName}`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
