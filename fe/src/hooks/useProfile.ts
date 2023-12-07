import { useDeferredValue, useEffect } from 'react';
import { useStore } from 'effector-react';
import { ref, set } from 'firebase/database';

import { $globalStore } from '../store';
import { rtdb } from '../shared/firebase';

export const useProfile = () => {
  const { user } = useStore($globalStore);

  const { id, name, tel, adress } = useDeferredValue(user);

  useEffect(() => {
    set(ref(rtdb, `users/${id}/name`), name);
  }, [name, id]);

  useEffect(() => {
    set(ref(rtdb, `users/${id}/adress`), adress);
  }, [adress, id]);

  useEffect(() => {
    set(ref(rtdb, `users/${id}/tel`), tel);
  }, [tel, id]);

  return {
    ...user,
  };
};
