import React, { useEffect, useState } from 'react';
import { auth, GoogleAuth } from './core/db/firebase';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth';
import { Button, CircularProgress, Box } from '@mui/material';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Chat from './pages/Chat';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cek untuk hasil redirect
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('Redirect login success:', result.user);
          setUser(result.user);
          navigate('/Chat'); // Pindahkan user ke chat setelah login redirect
        } else {
          console.log('No redirect result found');
        }
      } catch (error) {
        console.error('Error during redirect login:', error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    checkRedirectResult();

    // Listener untuk auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User detected:', user);
        setUser(user);
        navigate('/Chat'); // Arahkan ke Chat jika user terdeteksi
      } else {
        console.log('No user detected');
        setUser(null);
      }
      setLoading(false); // Stop loading spinner
    });

    return () => unsubscribe();
  }, [navigate]);

  // Menentukan apakah menggunakan Popup atau Redirect
  const SignInWithGoogle = async () => {
    try {
      if (window.innerWidth <= 768) {
        console.log('Mobile device detected, using popup');
        await signInWithPopup(auth, GoogleAuth); // Popup untuk mobile
      } else {
        console.log('Desktop device detected, using redirect');
        await signInWithRedirect(auth, GoogleAuth); // Redirect untuk desktop
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const SignOut = async () => {
    try {
      await signOut(auth);
      console.log('Logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const PriavateRouter = ({ children }) => {
    return user ? children : <Navigate to="/" />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className='w-screen h-screen'>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Box display="flex" justifyContent="center" marginTop="50px">
                <Button variant="contained" color="primary" onClick={SignInWithGoogle}>
                  Sign In With Google
                </Button>
              </Box>
            ) : (
              <Navigate to="/Chat" replace />
            )
          }
        />
        <Route
          path="/Chat"
          element={
            <PriavateRouter>
              <Chat SignOut={SignOut} user={user} />
            </PriavateRouter>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
