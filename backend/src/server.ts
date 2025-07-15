import express from 'express';
import cors from 'cors';
import analyzeRoutes from './routes/analyze';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://price-valve-frontend-gxzqkzrht-rick-lius-projects.vercel.app',
    'https://YOUR-ACTUAL-FRONTEND-URL.com' // TODO: Replace with your real deployed frontend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 