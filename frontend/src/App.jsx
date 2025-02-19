import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Componant/Navbar.jsx';
import Setting from './Pages/Setting.jsx';
import Profile from './Pages/Profile.jsx';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import { useAuthStore } from './Store/isAuthStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './Store/isThemeStore.js';
import Videocall from './Pages/Videocall.jsx';
import IncomingCall from './Componant/IncomingCall.jsx';
import toast from 'react-hot-toast';

function App() {
  const { checkAuth, authUser, isCheckingAuth, socket } = useAuthStore();
  const { themes } = useThemeStore();
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (socket) {
      socket.on('incomingCall', (callData) => {
        setIncomingCall(callData);
      });

      socket.on('callEnded', () => {
        toast.error('Call ended');
        setIncomingCall(null);
      });

      socket.on('callCancelled', () => {
        setIncomingCall(null);
      });
    }

    return () => {
      if (socket) {
        socket.off('incomingCall');
        socket.off('callEnded');
        socket.off('callCancelled');
      }
    };
  }, [socket]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    );
  }
  // console.log("Auth User:", authUser);
  // console.log("Is Checking Auth:", isCheckingAuth);
  // console.log("Current Theme:", themes);
  return (
    <div data-theme={themes}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={'/login'} />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to={'/'} />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={'/'} />} />
        <Route path='/setting' element={authUser ? <Setting /> : <Navigate to={'/login'} />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to={'/login'} />} />
        <Route path='/video/:id' element={authUser ? <Videocall /> : <Navigate to={'/login'} />} />
      </Routes>
      <Toaster />
      {incomingCall && (
        <IncomingCall
          caller={incomingCall}
          onDecline={() => setIncomingCall(null)}
        />
      )}
    </div>
  );
}

export default App;