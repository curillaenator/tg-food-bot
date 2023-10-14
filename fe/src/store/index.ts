import { createEvent, createStore } from 'effector';

export type ShowcaseItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  type: string;
  waitTime: string;
  qty: number;
};

export type Order = {
  id: string;
  applicant: User['id'];
  items: ShowcaseItem[];
};

export type User = {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
  tel?: string;
  adress?: string;
  isAdmin?: boolean;
  orders?: Order['id'];
};

export interface GlobalStore {
  user: User | null;
  basket: ShowcaseItem[];
}

export const setUser = createEvent<User | null>();
export const updateUser = createEvent<Partial<User>>();
export const setBasket = createEvent<ShowcaseItem>();

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
  }))
  .on(updateUser, (state, partialUser) => ({
    ...state,
    user: { ...state.user, ...partialUser },
  }));
