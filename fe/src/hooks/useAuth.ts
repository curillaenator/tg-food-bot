import { useEffect, useState, useCallback, useReducer } from 'react';
import { ref, set, child, get } from 'firebase/database';
// import { doc, setDoc } from 'firebase/firestore';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { setUser } from '../store';

import { rtdb, auth } from '../shared/firebase';
import type { User } from '../shared/interfaces';

type ActionType = 'email' | 'password' | 'error';

export interface Action {
  type: ActionType;
  payload: string;
}

const reducer = (state: AppUserCreds, action: Action): AppUserCreds => {
  switch (action.type) {
    case 'email':
      return { ...state, email: action.payload };
    case 'password':
      return { ...state, password: action.payload };
    case 'error':
      return { ...state, error: action.payload };
  }
};

const PASS_LENGTH = 10;

const credsCheck = (creds: AppUserCreds, dispatch: React.Dispatch<Action>) => {
  const { email, password } = creds;

  if (!email.length || !email.match(/.*@.*\..+/i)) {
    dispatch({ type: 'error', payload: 'Email has wrong format' });
    return false;
  }

  if (password.length < PASS_LENGTH) {
    dispatch({ type: 'error', payload: `${PASS_LENGTH} or more chars as password required` });
    return false;
  }

  return true;
};

export const useAuth = () => {
  const [creds, dispatch] = useReducer(reducer, { email: '', password: '' });
  const onCredsChange = useCallback(
    (action: Action) => {
      dispatch(action);
      dispatch({ type: 'error', payload: '' });
    },
    [dispatch],
  );

  const [firstTime, setFirstTime] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const logIn = () => {
    if (!credsCheck(creds, dispatch)) return;

    setAuthLoading(true);

    signInWithEmailAndPassword(auth, creds.email, creds.password).catch((err) => {
      setAuthLoading(false);
      dispatch({ type: 'error', payload: `${err.code}: ${err.message}` });
      console.table(err);
    });
  };

  const signIn = () => {
    if (!credsCheck(creds, dispatch)) return;

    setAuthLoading(true);

    createUserWithEmailAndPassword(auth, creds.email, creds.password)
      .then(async (userCredential) => {
        const { user } = userCredential;

        const appUser: User = {
          id: user.uid,
          name: user.displayName || '',
          avatar: user.photoURL || '',
          tel: user.phoneNumber || '',
          email: user.email || '',
          adress: '',
          role: 'pixpax',
        };

        // await setDoc(doc(firedb, 'users', user.uid), appUser);
        await set(ref(rtdb, `users/${user.uid}`), appUser);

        setUser(appUser);
        // setAuthLoading(false);
      })
      .catch((err) => {
        setAuthLoading(false);
        dispatch({ type: 'error', payload: err.message.replace(/^Firebase:\s/, '').replace('auth/', '') });
        console.table(err);
      });
  };

  const signOut = () => {
    setAuthLoading(true);

    fbSignOut(auth).then(() => {
      setUser(null);
      setAuthLoading(false);
    });
  };

  const resetPassword = () => {
    sendPasswordResetEmail(auth, creds.email).then(() => {
      dispatch({ type: 'error', payload: `Check ${creds.email} for reset password` });
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!!user) {
        get(child(ref(rtdb), `users/${user.uid}`))
          .then((snap) => {
            if (snap.exists()) setUser(snap.val());
          })
          .then(() => setAuthLoading(false));
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    creds,
    authLoading,
    firstTime,
    signOut,
    authAction: () => (firstTime ? signIn() : logIn()),
    onCredsChange,
    setFirstTime,
    resetPassword,
  };
};
