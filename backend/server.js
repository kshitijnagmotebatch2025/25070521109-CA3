require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));
app.use('/api/books', bookRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
