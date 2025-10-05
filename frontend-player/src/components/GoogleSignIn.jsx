import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { initFirebase, getFirebaseAuth } from '../firebase.js';
import { signInWithPopup } from 'firebase/auth';

export default function GoogleSignIn({ onSuccessRedirect = '/game' }) {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const clickSignIn = async () => {
    try {
      setLoading(true);
      initFirebase();
      const { auth, provider } = getFirebaseAuth();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const { data } = await api.post('/auth/firebase', { idToken });
      login(data.token, data.user);
      navigate(onSuccessRedirect);
    } catch (e) {
      // optionally show toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center my-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-3 text-gray-500 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={clickSignIn}
        disabled={loading}
        className="w-full mt-1 flex items-center justify-center gap-2 py-3 rounded-full border bg-white hover:bg-gray-50 shadow-sm"
      >
        <GoogleIcon /> {loading ? 'Signing in…' : 'Continue with Google'}
      </motion.button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.826 32.91 29.274 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.869 6.053 29.7 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.297 16.402 18.824 14 24 14c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.869 6.053 29.7 4 24 4 16.318 4 9.656 8.335 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.186 0 9.866-1.986 13.409-5.223l-6.197-5.238C29.188 35.091 26.715 36 24 36c-5.248 0-9.784-3.06-11.273-7.447l-6.49 5.005C9.54 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.06 3.09-3.54 5.676-6.894 6.539l6.197 5.238C38.393 37.676 44 31.5 44 24c0-1.341-.138-2.651-.389-3.917z"/>
    </svg>
  );
}
