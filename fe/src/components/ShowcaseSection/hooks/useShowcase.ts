import { useCallback, useState, useEffect } from 'react';

import { ref as storageRef, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref, update, get, child } from 'firebase/database';

import { strg, rtdb } from '../../../shared/firebase';

import type { ShowcaseSectionProps } from '../interfaces';
import type { Category } from '../../../shared/interfaces';

export const useShowcase = (props: ShowcaseSectionProps) => {
  const { id, imgPath, type, parent, onRemoveService } = props;

  const [serviceImgUrl, setServiceImgUrl] = useState<string | undefined>(undefined);

  const isCoverRecievable = type === 'service' || type === 'category';

  useEffect(() => {
    if (!isCoverRecievable || !imgPath) return;

    getDownloadURL(storageRef(strg, imgPath)).then((url) => setServiceImgUrl(url));
  }, [imgPath, isCoverRecievable]);

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

            onRemoveService(id);
          }
        });
      }
    },
    [id, parent, imgPath, onRemoveService],
  );

  return {
    serviceImgUrl,
    removeService,
    setServiceImgUrl,
  };
};
