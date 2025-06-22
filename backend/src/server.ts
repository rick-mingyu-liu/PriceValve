import express from 'express';
import cors from 'cors';
import analyzeRoutes from './routes/analyze';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api', analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 