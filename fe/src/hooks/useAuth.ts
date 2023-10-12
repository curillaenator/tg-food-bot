import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

import { auth } from '../shared/firebase';

const provider = new GoogleAuthProvider();

export const useAuth = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
    });

    return () => unsubscribe();
  }, []);

  return {
    authWithGoogle: () => signInWithPopup(auth, provider),
    signOut: () => signOut(auth),
  };
};
