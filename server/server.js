import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumerouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Database connection
await connectDB();

app.use(express.json());

// ✅ FIXED CORS - Add your exact Netlify URL
app.use(cors({
  origin: [
    'https://waliresumebuilder.netlify.app', // ✅ Your exact Netlify URL
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ HEALTH ROUTE
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running on Render'
  });
});

app.get('/', (req, res) => res.send('Server is live on Render...'));

app.use('/api/users', userRouter);
app.use('/api/resumes', resumerouter);
app.use('/api/ai', aiRouter);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

export default app;