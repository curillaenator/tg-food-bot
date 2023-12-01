import { useEffect } from 'react';

import { ref, set } from 'firebase/database';
import { rtdb } from '../../../shared/firebase';

import { useTelegram } from '../../../hooks/useTelegram';
import type { User } from '../../../shared/interfaces';

export const useTelegramConnect = (user: User) => {
  const { tgUser } = useTelegram();

  useEffect(() => {
    if (!!user?.id && !!tgUser && !tgUser?.is_bot && 'username' in tgUser) {
      set(ref(rtdb, `users/${user.id}/tme`), `t.me/${tgUser.username}`);
    }
  }, [tgUser, user]);
};
