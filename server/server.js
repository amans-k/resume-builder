import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumerouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';
const app = express();
const port = process.env.PORT || 3000;
//Database connection
await connectDB();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Server is live...'));

// ✅ DIRECT TEST ROUTE ADD KARO - Ye line add karo
app.post('/api/debug-test', (req, res) => {
  console.log("✅✅✅ DIRECT TEST ROUTE HIT! ✅✅✅");
  console.log("Request body:", req.body);
  res.json({ 
    success: true,
    message: "Direct route working!",
    enhancedContent: "• Test: Developed applications\n• Test: Collaborated with teams\n• Test: Optimized performance" 
  });
});

app.use('/api/users', userRouter )
app.use('/api/resumes', resumerouter )
app.use('/api/ai', aiRouter)
app.listen(port, () =>{
     console.log(`Server is running on port ${port}`)
    });