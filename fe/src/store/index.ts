import { createEvent, createStore } from 'effector';
import type { User, Item, SidebarItem } from '../shared/interfaces';

export type Order = {
  id: string;
  applicant: User['id'];
  items: Item[];
};

export type Background = 'wowwy' | 'playfull' | 'fire' | 'luxary';

export interface GlobalStore {
  background: Background;
  user: User | null;
  basket: Item[];
  isEditor: boolean;
  touched: boolean;

  sidebar: Record<string, SidebarItem[]>;
}

export const setSidebar = createEvent<Record<string, SidebarItem[]>>();

export const setTouched = createEvent();

export const setBackground = createEvent<Background>();

export const setUser = createEvent<User | null>();
export const updateUser = createEvent<Partial<User>>();

export const setEditor = createEvent<boolean>();

export const resetBasket = createEvent();
export const setBasket = createEvent<Item>();
export const removeBasketItem = createEvent<string>();
export const setBasketItemQty = createEvent<{ itemId: string; qty: number }>();

export const $globalStore = createStore<GlobalStore>({
  touched: false,
  background: 'wowwy',
  user: null,
  basket: [],
  isEditor: false,

  sidebar: {},
});

$globalStore
  .on(setSidebar, (state, sidebar) => ({
    ...state,
    sidebar,
  }))
  .on(setTouched, (state) => ({
    ...state,
    touched: true,
  }))
  .on(setEditor, (state, isEditor) => ({
    ...state,
    isEditor,
  }))
  .on(setBackground, (state, background) => ({
    ...state,
    background,
  }))
  .on(setUser, (state, user) => ({
    ...state,
    user,
  }))
  .on(resetBasket, (state) => ({
    ...state,
    basket: [],
  }))
  .on(removeBasketItem, (state, itemId) => {
    const removeIndex = state.basket.findIndex((item) => item.id === itemId);
    const updatedBasket = [...state.basket];
    updatedBasket.splice(removeIndex, 1);

    return { ...state, basket: updatedBasket };
  })
  .on(setBasketItemQty, (state, payload) => {
    const { itemId, qty } = payload;

    const itemToEdit = state.basket.findIndex((el) => el.id === itemId);
    const updatedBasket = [...state.basket];
    updatedBasket[itemToEdit].qty = qty;

    return { ...state, basket: updatedBasket };
  })
  .on(setBasket, (state, basketItem) => {
    const itemToEdit = state.basket.findIndex((el) => el.id === basketItem.id);

    if (itemToEdit >= 0) {
      const updatedBasket = [...state.basket];
      updatedBasket[itemToEdit].qty = (updatedBasket[itemToEdit].qty || 1) + 1;

      return { ...state, basket: updatedBasket };
    }

    return { ...state, basket: [...state.basket, basketItem] };
  })
  .on(updateUser, (state, partialUser) => ({
    ...state,
    user: { ...state.user, ...partialUser },
  }));
