require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { TempleState, Expense, Stop, GalleryItem, Location } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Force no-cache for HTML, JS, CSS so browser always gets fresh files
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path === '/' || req.path.endsWith('.js') || req.path.endsWith('.css')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

// Serve static files from root
app.use(express.static(path.join(__dirname, 'www')));

// Shared state stored in memory (real-time live tracking)
let liveLocation = null;
let stopInProgress = null; // { startTime, lat, lng }

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (mongoUri && !mongoUri.includes('<username>') && !mongoUri.includes('xxxx')) {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('Connected to MongoDB Atlas successfully.');
      loadPersistedLocation();
    })
    .catch(err => {
      console.error('MongoDB Atlas connection error:', err.message);
      console.error('The server will run, but database operations will fail.');
    });
} else {
  console.warn('\n================================================================');
  console.warn('WARNING: MONGODB_URI is not set or contains placeholders in .env');
  console.warn('Please update the .env file with your MongoDB Atlas URI.');
  console.warn('The application is running, but database features will fail.');
  console.warn('================================================================\n');
}

async function loadPersistedLocation() {
  try {
    const loc = await Location.findOne({ key: 'latest' });
    if (loc) {
      liveLocation = {
        lat: loc.lat,
        lng: loc.lng,
        speed: loc.speed,
        timestamp: loc.timestamp
      };
      console.log("Loaded last persisted location from MongoDB:", liveLocation);
    }
  } catch (err) {
    console.error("Error loading persisted location from MongoDB:", err.message);
  }
}


// Ensure upload folder exists
const uploadDir = path.join(__dirname, 'shared_gallery');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Helper to reverse geocode lat/lng to a clean place name using OpenStreetMap Nominatim
async function fetchAddress(lat, lng) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`, {
      headers: { 'User-Agent': 'TempleTourTracker/1.0' }
    });
    const data = await response.json();
    if (data && data.address) {
      const addr = data.address;
      // Build a clean, readable name snippet
      const place = data.name || addr.amenity || addr.shop || addr.tourism || addr.highway || addr.road || addr.suburb || addr.city || addr.town;
      const region = addr.city || addr.town || addr.state;
      if (place && region) {
        return `${place}, ${region}`;
      }
      return data.display_name ? data.display_name.split(',').slice(0, 3).join(',').trim() : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (err) {
    console.error("Reverse geocoding error:", err.message);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// API: Location sharing and automatic stop logging
// Helper to process location data and update stops tracking
async function processLocationUpdate(rawLocation) {
  let data = rawLocation;

  // Detect and normalize OwnTracks format (lon -> lng, vel -> speed)
  if (data._type === 'location' || (data.lat && data.lon)) {
    data = {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      speed: data.vel !== undefined ? parseFloat(data.vel) : 0,
      timestamp: data.timestamp || Date.now()
    };
  } else {
    data = {
      ...data,
      timestamp: data.timestamp || Date.now()
    };
  }

  // Automatic stops tracking logic
  if (data.lat && data.lng) {
    const isStopped = data.speed < 2; // threshold: 2 km/h

    if (isStopped) {
      if (!stopInProgress) {
        stopInProgress = {
          startTime: data.timestamp,
          lat: data.lat,
          lng: data.lng
        };
      } else {
        const elapsed = data.timestamp - stopInProgress.startTime;
        // Check if stopped for more than 1 minute (60,000 ms)
        if (elapsed >= 60000) {
          try {
            const activeStop = await Stop.findOne({ active: true });
            if (!activeStop) {
              // Get next sequence ID for Stop
              const maxStop = await Stop.findOne().sort('-id');
              const nextId = maxStop ? maxStop.id + 1 : 1;

              // Log new active stop
              await Stop.create({
                id: nextId,
                lat: stopInProgress.lat,
                lng: stopInProgress.lng,
                startTime: stopInProgress.startTime,
                duration: 1, // initial 1 minute
                active: true,
                placeName: 'Fetching address...'
              });

              // Asynchronously query Nominatim API and update the stop name in background
              fetchAddress(stopInProgress.lat, stopInProgress.lng).then(async (address) => {
                try {
                  await Stop.updateOne({ id: nextId }, { placeName: address });
                  console.log(`Stop #${nextId} resolved to: ${address}`);
                } catch (e) {
                  console.error("Error updating stop placeName:", e.message);
                }
              });
            } else {
              // Update duration of current active stop in minutes
              activeStop.duration = Math.round(elapsed / 60000);
              await activeStop.save();
            }
          } catch (e) {
            console.error("Error logging stop to database:", e.message);
          }
        }
      }
    } else {
      // Vehicle is moving (speed >= 2 km/h)
      if (stopInProgress) {
        try {
          const activeStop = await Stop.findOne({ active: true });
          if (activeStop) {
            // Finish the active stop
            activeStop.active = false;
            activeStop.endTime = data.timestamp;
            activeStop.duration = Math.max(1, Math.round((data.timestamp - stopInProgress.startTime) / 60000));
            await activeStop.save();
          }
        } catch (e) {
          console.error("Error closing stop in database:", e.message);
        }
        stopInProgress = null;
      }
    }
  }

  // Update in DB (persist the latest location)
  if (data.lat && data.lng) {
    try {
      await Location.updateOne(
        { key: 'latest' },
        {
          lat: data.lat,
          lng: data.lng,
          speed: data.speed !== undefined ? parseFloat(data.speed) : 0,
          timestamp: data.timestamp
        },
        { upsert: true }
      );
    } catch (err) {
      console.error("Failed to persist location to MongoDB:", err.message);
    }
  }

  liveLocation = data;
  return data;
}

// API: Single location sharing and automatic stop logging
app.post('/api/location', async (req, res) => {
  console.log("--> Incoming location request body:", JSON.stringify(req.body));
  try {
    const processed = await processLocationUpdate(req.body);
    res.json([]);
  } catch (err) {
    console.error("Error in POST /api/location:", err.message);
    res.status(500).json({ error: "Failed to log location" });
  }
});

// API: Batch offline location synchronization
app.post('/api/location/sync', async (req, res) => {
  console.log("--> Incoming sync request, count:", req.body && req.body.locations ? req.body.locations.length : 0);
  try {
    const { locations } = req.body;
    if (!Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ error: "Invalid or empty locations array" });
    }

    // Sort locations chronologically before processing
    locations.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    // Process sequential updates
    for (const loc of locations) {
      await processLocationUpdate(loc);
    }

    res.json([]);
  } catch (err) {
    console.error("Error in POST /api/location/sync:", err.message);
    res.status(500).json({ error: "Failed to sync locations" });
  }
});

app.get('/api/location', (req, res) => {
  if (liveLocation) {
    res.json(liveLocation);
  } else {
    res.status(404).json({ error: "No location updates yet" });
  }
});

// API: Get logged stops list
app.get('/api/stops', async (req, res) => {
  try {
    const stops = await Stop.find().sort({ id: 1 });
    res.json(stops || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stops list" });
  }
});

// API: Temple states management
app.post('/api/temple-states', async (req, res) => {
  try {
    const states = req.body;
    if (Array.isArray(states)) {
      for (const t of states) {
        await TempleState.updateOne({ id: t.id }, t, { upsert: true });
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save temple states" });
  }
});

app.get('/api/temple-states', async (req, res) => {
  try {
    const states = await TempleState.find().sort({ id: 1 });
    res.json(states || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch temple states" });
  }
});

// API: Expenses management
app.post('/api/expenses', async (req, res) => {
  try {
    const expenses = req.body;
    // Overwrite existing expense list to sync front-end state
    await Expense.deleteMany({});
    if (Array.isArray(expenses) && expenses.length > 0) {
      await Expense.insertMany(expenses);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save expenses" });
  }
});

app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ id: 1 });
    res.json(expenses || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// API: Gallery file upload
app.post('/api/upload', upload.single('media'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const location = req.body.location || 'General';
  const fileUrl = `/shared_gallery/${req.file.filename}`;
  const timestamp = Date.now();
  const isVideo = req.file.mimetype.startsWith('video/');

  const itemData = {
    id: timestamp,
    title: req.file.originalname,
    type: isVideo ? 'Video' : 'Photo',
    size: (req.file.size / (1024 * 1024)).toFixed(1) + ' MB',
    date: new Date().toISOString().split('T')[0],
    emoji: isVideo ? '🎥' : '📷',
    dataUrl: fileUrl,
    filename: req.file.filename,
    location: location
  };

  try {
    await GalleryItem.create(itemData);
    res.json({
      success: true,
      file: itemData
    });
  } catch (err) {
    console.error("Database save failed for uploaded file:", err.message);
    res.status(500).json({ error: "Failed to save file metadata in database" });
  }
});

// Serve uploaded gallery files
app.use('/shared_gallery', express.static(uploadDir));

// API: Get gallery files list
app.get('/api/gallery', async (req, res) => {
  try {
    const media = await GalleryItem.find().sort({ id: -1 });
    res.json(media || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gallery items" });
  }
});

// API: Delete a specific gallery item
app.post('/api/gallery/delete', async (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ error: 'No filename provided' });
  }
  const safeFilename = path.basename(filename);
  const filePath = path.join(uploadDir, safeFilename);

  try {
    // Delete metadata from MongoDB
    await GalleryItem.deleteOne({ filename: safeFilename });

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, err => {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete file from disk' });
        }
        res.json({ success: true });
      });
    } else {
      res.json({ success: true, message: 'Metadata deleted, file was not present on disk' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// API: Reset endpoint
app.post('/api/reset', async (req, res) => {
  liveLocation = null;
  stopInProgress = null;
  
  try {
    // Clear all MongoDB collections
    await Promise.all([
      TempleState.deleteMany({}),
      Expense.deleteMany({}),
      Stop.deleteMany({}),
      GalleryItem.deleteMany({}),
      Location.deleteMany({})
    ]);
    
    // Clear shared_gallery files
    if (fs.existsSync(uploadDir)) {
      fs.readdir(uploadDir, (err, files) => {
        if (!err && files) {
          for (const file of files) {
            fs.unlink(path.join(uploadDir, file), err => {});
          }
        }
      });
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset application data' });
  }
});

app.listen(PORT, () => {
  console.log(`YOUNG BOYS server running at http://localhost:${PORT}`);
});
