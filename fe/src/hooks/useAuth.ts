import { useEffect, useState, useCallback, useReducer } from 'react';
import { ref, set } from 'firebase/database';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

import { rtdb, auth } from '../shared/firebase';

import { setUser } from '../store';

type ActionType = 'email' | 'password' | 'error';

interface Action {
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

  const logIn = () => {
    if (!credsCheck(creds, dispatch)) return;
    signInWithEmailAndPassword(auth, creds.email, creds.password).catch((err) => console.table(err));
  };

  const signIn = () => {
    if (!credsCheck(creds, dispatch)) return;
    createUserWithEmailAndPassword(auth, creds.email, creds.password).catch((err) => console.table(err));
  };

  const signOut = () => {
    fbSignOut(auth).then(() => setUser(null));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!!user) {
        const simpleUser = {
          id: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
          tel: user.phoneNumber,
          email: user.email,
          adress: '',
        };

        await set(ref(rtdb, `users/${user.uid}`), simpleUser);

        setUser(simpleUser);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    firstTime,
    signOut,
    authAction: () => (firstTime ? signIn() : logIn()),
    creds,
    onCredsChange,
    setFirstTime,
  };
};
