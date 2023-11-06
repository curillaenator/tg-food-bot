import { useCallback, useState, useEffect } from 'react';

import { ref as storageRef, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref, update, get, child } from 'firebase/database';

import { strg, rtdb } from '../../../shared/firebase';

import type { Category } from '../interfaces';

export const useShowcase = (props: Category) => {
  const { id, imgPath, type, parent } = props;

  const [serviceImgUrl, setServiceImgUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (type !== 'service' || !imgPath) return;
    getDownloadURL(storageRef(strg, imgPath)).then((url) => setServiceImgUrl(url));
  }, [imgPath, type]);

  const removeService = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();

      if (confirm('Точно удалить сервис?')) {
        get(child(ref(rtdb), `services/${id}`)).then((snap) => {
          if (snap.exists()) {
            const linkedItems = Object.keys((snap.val() as Category).categories || {});
            const rtdbUpd = Object.fromEntries(linkedItems.map((itemId) => [`items/${itemId}`, null]));

            linkedItems.forEach((itemId) => deleteObject(storageRef(strg, `items/${itemId}`)));
            console.log('items images deleted');

            deleteObject(storageRef(strg, imgPath));
            console.log('service image deleted');

            update(ref(rtdb), {
              ...rtdbUpd,
              [`categories/${parent}/categories/${id}`]: null,
              [`services/${id}`]: null,
            });
            console.log('related records deleted');
          }
        });
      }
    },
    [id, parent, imgPath],
  );

  // const addItem = useCallback(() => {}, [])

  return {
    serviceImgUrl,
    removeService,
  };
};
