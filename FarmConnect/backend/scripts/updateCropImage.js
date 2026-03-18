const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const [,, cropName, imagePath] = process.argv;

if (!cropName || !imagePath) {
  console.error("Usage: node scripts/updateCropImage.js \"Crop Name\" \"C:\\path\\to\\image.jpg\"");
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

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
};

const run = async () => {
  const buffer = fs.readFileSync(imagePath);
  const base64 = buffer.toString("base64");
  const mime = getMimeType(imagePath);
  const dataUrl = `data:${mime};base64,${base64}`;

  await mongoose.connect(MONGO_URI);
  const crop = await Crop.findOne({ name: cropName });
  if (!crop) {
    console.error(`Crop not found: ${cropName}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  crop.image = dataUrl;
  await crop.save();

  console.log(`Updated image for crop: ${cropName}`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
