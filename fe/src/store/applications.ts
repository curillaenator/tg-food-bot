import { createEvent, createStore } from 'effector';

import type { Application } from '../shared/interfaces';

export interface ApplicationsStore {
  pickedApplications: Application[];
}

// export const pickApplication = createEvent<Application>();
export const setPickedApplications = createEvent<Application[]>();

export const $aplicationsStore = createStore<ApplicationsStore>({
  pickedApplications: [],
});

$aplicationsStore.on(setPickedApplications, (state, pickedApplications) => ({
  ...state,
  pickedApplications,
}));
// .on(pickApplication, (state, application) => ({
//   ...state,
//   pickedApplications: [...state.pickedApplications, application],
// }));
