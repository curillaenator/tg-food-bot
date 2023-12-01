import type { User, Category as Service } from '../../shared/interfaces';

export interface OwnerFormState {
  user: Partial<User>;
  serviceToOwn: Partial<Service>;
  servicesOwned: Service[];
}
