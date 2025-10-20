import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import Preview from './pages/Preview';
import Login from './pages/Login';
import { useDispatch, useSelector } from 'react-redux';
import api from './configs/api';
import { login, setInitialized } from './app/features/authslice';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  // ✅ ROBUST BACKEND PING FUNCTION
  useEffect(() => {
    const pingBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(`https://resume-builder-3-xfol.onrender.com/health`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log('✅ Backend health check passed - Status:', response.status);
        } else {
          console.log('⚠️ Backend responded with status:', response.status);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('❌ Backend request timeout');
        } else {
          console.log('❌ Backend unreachable:', error.message);
        }
      }
    };

    pingBackend();
    const pingInterval = setInterval(pingBackend, 10 * 60 * 1000);
    return () => clearInterval(pingInterval);
  }, []);

  // ... REST OF YOUR CODE REMAINS SAME
  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch(setInitialized());
        return;
      }

      try {
        const { data } = await api.get('/api/users/data', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (data.user) {
          dispatch(login({ token, user: data.user }));
        } else {
          localStorage.removeItem('token');
          dispatch(setInitialized());
        }
      } catch (error) {
        console.log('Auth check failed:', error.message);
        localStorage.removeItem('token');
        dispatch(setInitialized());
      }
    };

    setTimeout(() => {
      getUserData();
    }, 100);
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app/*" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          <Route path="view/:resumeId" element={<Preview />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;