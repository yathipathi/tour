require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { TempleState, Expense, Stop, GalleryItem } = require('./models');

const DATA_FILE = path.join(__dirname, 'yatra_data.json');
const uploadDir = path.join(__dirname, 'shared_gallery');

async function runMigration() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('xxxx')) {
    console.error('================================================================');
    console.error('ERROR: Please set a valid MONGODB_URI in your .env file first!');
    console.error('Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db');
    console.error('================================================================');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  // --- 1. Migrate JSON data (Temples, Expenses, Stops) ---
  if (fs.existsSync(DATA_FILE)) {
    console.log(`Reading local data from ${DATA_FILE}...`);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
      console.error('Failed to parse yatra_data.json:', e.message);
      data = {};
    }

    // Migrate Temple States
    if (data.templeStates && Array.isArray(data.templeStates)) {
      console.log(`Migrating ${data.templeStates.length} temple states...`);
      for (const t of data.templeStates) {
        await TempleState.updateOne({ id: t.id }, t, { upsert: true });
      }
      console.log('Temple states migrated.');
    }

    // Migrate Expenses
    if (data.expenses && Array.isArray(data.expenses)) {
      console.log(`Migrating ${data.expenses.length} expenses...`);
      for (const e of data.expenses) {
        await Expense.updateOne({ id: e.id }, e, { upsert: true });
      }
      console.log('Expenses migrated.');
    }

    // Migrate Stops
    if (data.stopsList && Array.isArray(data.stopsList)) {
      console.log(`Migrating ${data.stopsList.length} stops...`);
      for (const s of data.stopsList) {
        await Stop.updateOne({ id: s.id }, s, { upsert: true });
      }
      console.log('Stops migrated.');
    }

    // Migrate Gallery Meta / Sync files
    const galleryMeta = data.galleryMeta || {};
    if (fs.existsSync(uploadDir)) {
      console.log('Syncing files in shared_gallery with MongoDB...');
      const files = fs.readdirSync(uploadDir);
      let syncCount = 0;

      for (const file of files) {
        const parts = file.split('-');
        const timestamp = parseInt(parts[0]);
        const originalName = parts.slice(1).join('-');
        const ext = path.extname(file).toLowerCase();
        const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(ext);
        const meta = galleryMeta[file] || {};

        try {
          const stats = fs.statSync(path.join(uploadDir, file));
          const galleryItemData = {
            id: timestamp || stats.mtimeMs,
            title: originalName || file,
            type: isVideo ? 'Video' : 'Photo',
            size: (stats.size / (1024 * 1024)).toFixed(1) + ' MB',
            date: new Date(stats.mtime).toISOString().split('T')[0],
            emoji: isVideo ? '🎥' : '📷',
            dataUrl: `/shared_gallery/${file}`,
            filename: file,
            location: meta.location || 'General'
          };

          await GalleryItem.updateOne(
            { filename: file },
            galleryItemData,
            { upsert: true }
          );
          syncCount++;
        } catch (e) {
          console.error(`Failed to sync file ${file}:`, e.message);
        }
      }
      console.log(`Synced ${syncCount} gallery items to database.`);
    }
  } else {
    console.log('No yatra_data.json found. Skipping JSON data migration.');
  }

  console.log('Migration finished successfully!');
  await mongoose.disconnect();
}

runMigration().catch(err => {
  console.error('Migration crashed:', err);
  process.exit(1);
});
