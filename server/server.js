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
// ✅ CORS UPDATE - Netlify URL add karo
app.use(cors({
  origin: ['https://your-netlify-app.netlify.app', 'http://localhost:3000'],
  credentials: true
}));

// ✅ HEALTH ROUTE (Render ke liye important)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running on Render'
  });
});

app.get('/', (req, res) => res.send('Server is live on Render...'));

app.post('/api/debug-test', (req, res) => {
  console.log("✅✅✅ DIRECT TEST ROUTE HIT! ✅✅✅");
  console.log("Request body:", req.body);
  res.json({ 
    success: true,
    message: "Direct route working!",
    enhancedContent: "• Test: Developed applications\n• Test: Collaborated with teams\n• Test: Optimized performance" 
  });
});

app.use('/api/users', userRouter);
app.use('/api/resumes', resumerouter);
app.use('/api/ai', aiRouter);

// ✅ REMOVE VERCEL CHECK - Directly listen karo
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

// ✅ Export bhi rakh sakte ho agar needed ho
export default app;