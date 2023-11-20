import type { User } from '../../store/index';
import type { Category as Service } from '../../shared/interfaces';

export interface OwnerFormState {
  user: Partial<User>;
  serviceToOwn: Partial<Service>;
  servicesOwned: Service[];
}
