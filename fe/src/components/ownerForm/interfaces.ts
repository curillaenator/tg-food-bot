import type { User } from '../../store/index';
import type { Category as Service } from '../ShowcaseSection';

export interface OwnerFormState {
  user: Partial<User>;
  serviceToOwn: Partial<Service>;
  servicesOwned: Service[];
}
