const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { router: authRoutes } = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

require('dotenv').config();
require('./db');
const PORT = parseInt(process.env.PORT, 10) || 4000;

// Enable CORS for frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://taskifygharsha.netlify.app'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: origin not allowed'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is working!' });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});