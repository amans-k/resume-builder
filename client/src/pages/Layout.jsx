import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Login from './Login';

const Layout = () => {
  const { user, isLoading, isInitialized } = useSelector((state) => state.auth);
  
  // ✅ Wait until auth check is complete
  if (!isInitialized || isLoading) {
    return <Loader />;
  }

  // ✅ If no user after auth check, show login
  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;