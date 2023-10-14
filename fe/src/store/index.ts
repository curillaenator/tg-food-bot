import { createEvent, createStore } from 'effector';

export type User = {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
  tel?: string;
  adress?: string;
  isAdmin?: boolean;
};

export interface GlobalStore {
  user: User | null;
  basket: unknown[];
}

export const setUser = createEvent<User | null>();
export const setBasket = createEvent<unknown>();

export const $globalStore = createStore<GlobalStore>({
  user: null,
  basket: [],
});

$globalStore
  .on(setUser, (state, user) => ({
    ...state,
    user,
  }))
  .on(setBasket, (state, basketItem) => ({
    ...state,
    basket: [...state.basket, basketItem],
  }));
