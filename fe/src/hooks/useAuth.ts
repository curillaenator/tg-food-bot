import { useEffect } from 'react';

import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, OAuthProvider } from 'firebase/auth';

import { auth } from '../shared/firebase';

import { setUser } from '../store';

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export const useAuth = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!!user) {
        setUser({
          id: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
          tel: user.phoneNumber,
          email: user.email,
          adress: '',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    signOut: () =>
      signOut(auth).then(() => {
        setUser(null);
      }),
    authWith: {
      google: () => signInWithPopup(auth, googleProvider),
      apple: () => signInWithPopup(auth, appleProvider),
    },
  };
};
