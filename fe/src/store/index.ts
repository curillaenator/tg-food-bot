import { createEvent, createStore } from 'effector';

export type ShowcaseItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  price: string;
  waitTime: string;
  qty: number;
};

export type Order = {
  id: string;
  applicant: User['id'];
  items: ShowcaseItem[];
};

export type Role = 'business' | 'manager' | 'employee' | 'admin' | 'pixpax';

export type User = {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
  tel?: string;
  adress?: string;
  role?: Role;
  orders?: Order['id'];
};

export type Background = 'wowwy' | 'playfull' | 'fire' | 'luxary';

export interface GlobalStore {
  background: Background;
  user: User | null;
  basket: ShowcaseItem[];
}

export const setBackground = createEvent<Background>();
export const setUser = createEvent<User | null>();
export const updateUser = createEvent<Partial<User>>();
export const setBasket = createEvent<ShowcaseItem>();

export const $globalStore = createStore<GlobalStore>({
  background: 'wowwy',
  user: null,
  basket: [],
});

$globalStore
  .on(setBackground, (state, background) => ({
    ...state,
    background,
  }))
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
