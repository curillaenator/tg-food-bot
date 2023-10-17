import { setBasketItemQty } from '../../../store';

import type { BasketCardProps } from '../BasketCard';

export const useBasketCard = (props: BasketCardProps) => {
  const { id, qty = 1 } = props;

  const incr = () => setBasketItemQty({ itemId: id, qty: qty + 1 });
  const decr = () => setBasketItemQty({ itemId: id, qty: qty - 1 });

  return {
    qty,
    incr,
    decr,
  };
};
