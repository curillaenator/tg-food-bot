import { useEffect } from 'react';

import { ref, listAll, getMetadata, updateMetadata } from 'firebase/storage';

import { strg } from '../shared/firebase';

import { debounced } from '../utils';

const update = () => {
  console.log('DEBOUNCED: update meta fires');

  listAll(ref(strg, 'categories')).then((res) => {
    res.items.forEach(async (itemRef) => {
      await updateMetadata(itemRef, {
        cacheControl: 'public,max-age=7200',
        contentType: 'image/jpeg',
      });

      getMetadata(itemRef).then((meta) => console.log(meta));
    });
  });
};

const debouncedMetadata = debounced(update);

export const useUpdateImageMeta = () => {
  useEffect(() => {
    console.log('effect update meta fires');
    debouncedMetadata();
  }, []);
};
