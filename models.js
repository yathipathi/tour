const mongoose = require('mongoose');

// Schema for Temple States
const TempleStateSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  visited: { type: Boolean, default: false },
  current: { type: Boolean, default: false }
});

// Schema for Expenses
const ExpenseSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  temple: { type: String }
});

// Schema for Automatic Stops
const StopSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number },
  duration: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
  placeName: { type: String, default: 'Fetching address...' }
});

// Schema for Gallery items (Media Metadata)
const GalleryItemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true }, // 'Photo' or 'Video'
  size: { type: String },
  date: { type: String, required: true },
  emoji: { type: String },
  dataUrl: { type: String, required: true },
  filename: { type: String, required: true, unique: true },
  location: { type: String, default: 'General' }
});

// Schema for Latest Live Location
const LocationSchema = new mongoose.Schema({
  key: { type: String, default: 'latest', unique: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  speed: { type: Number, default: 0 },
  timestamp: { type: Number, required: true }
});

const TempleState = mongoose.model('TempleState', TempleStateSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);
const Stop = mongoose.model('Stop', StopSchema);
const GalleryItem = mongoose.model('GalleryItem', GalleryItemSchema);
const Location = mongoose.model('Location', LocationSchema);

module.exports = {
  TempleState,
  Expense,
  Stop,
  GalleryItem,
  Location
};

