// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));           // allow larger JSON (base64 images)
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json());

// Routes
const authRoutes = require('./Routes/Authroutes');
const beamRoutes = require('./Routes/BeamRoutes');
const contactRoutes = require('./Routes/Contactroute'); // <--- updated this line
const profileRoutes = require('./Routes/profile');

app.use('/api/auth', authRoutes);
app.use('/api/beamdata', beamRoutes);
app.use('/api/contact', contactRoutes); // <--- add this
app.use('/api/auth', profileRoutes);

// Connect to MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

  
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
