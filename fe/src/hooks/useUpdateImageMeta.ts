// import { useEffect } from 'react';

// import { ref, listAll, updateMetadata } from 'firebase/storage';

// import { strg } from '../shared/firebase';

// export const useUpdateImageMeta = () => {
//   useEffect(() => {
//     listAll(ref(strg, 'dishes')).then((res) => {
//       res.items.forEach((itemRef) => {
//         updateMetadata(itemRef, {
//           cacheControl: 'public,max-age=1800',
//           contentType: 'image/jpeg',
//         });
//         console.log(itemRef);
//       });
//     });
//   }, []);
// };
