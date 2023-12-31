import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm, useFormState } from 'react-hook-form';
import type { Options } from 'chakra-react-select';

import { ref, child, push, update, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes } from 'firebase/storage';

import { rtdb, strg } from '../../../shared/firebase';
import { resizeFile } from '../../../utils';
import { TOAST_DURATION } from '../../../shared/constants';

import type { ItemFormValuesType, CustomOption } from '../interfaces';
import type { Item, Service } from '../../../shared/interfaces';

const FILE_META = {
  cacheControl: 'public,max-age=7200',
  contentType: 'image/jpeg',
};

const INITIAL_ITEM_FORM: ItemFormValuesType = {
  itemTitle: '',
  itemPrice: '',
  itemDescription: '',
  itemWaitTime: '',
  itemImage: null,
  itemService: { label: '', value: '' },
};

export const useItemForm = () => {
  const {
    getValues,
    setValue,
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValuesType>({ defaultValues: INITIAL_ITEM_FORM });

  const toast = useToast();

  const [services, setServices] = useState<Options<CustomOption>>([]);

  const [imgSrcFromFile, setImgSrcFromFile] = useState<string | undefined>(undefined);
  const { dirtyFields } = useFormState({ control });

  const onSubmit = useCallback(
    async (formValues: ItemFormValuesType) => {
      const data = {
        ...formValues,
        itemService: formValues.itemService.value,
      };

      const itemId = push(child(ref(rtdb), 'items')).key;

      const resizedFile = await resizeFile(data.itemImage[0]);
      const renamedFile = new File([resizedFile], itemId);

      const fileRef = storageRef(strg, `items/${renamedFile.name}`);

      await uploadBytes(fileRef, renamedFile, FILE_META).catch((err) => console.table(err));

      const newItem: Omit<Item, 'id' | 'qty'> = {
        title: data.itemTitle,
        description: data.itemDescription,
        price: data.itemPrice,
        imgPath: `items/${renamedFile.name}`,
        parent: data.itemService,
        type: 'item',
      };

      const updates = {
        [`services/${data.itemService}/categories/${itemId}`]: true,
        [`items/${itemId}`]: newItem,
      };

      await update(ref(rtdb), updates);

      reset({
        ...INITIAL_ITEM_FORM,
        itemService: services[0] || INITIAL_ITEM_FORM.itemService,
      });

      setImgSrcFromFile(undefined);

      toast({
        title: 'Готово',
        description:
          'Товар создан, теперь его можно редактировать либо хозяину сервиса через Мои сервисы, либо менеджерам Pixpax из любого места меню при включеном editMode',
        status: 'success',
        duration: TOAST_DURATION * 3,
        isClosable: true,
      });

      console.log(data);
    },
    [reset, toast, services],
  );

  useEffect(() => {
    if (!dirtyFields.itemImage) return;

    const files = getValues().itemImage;
    setImgSrcFromFile(URL.createObjectURL(files[0]));
  }, [dirtyFields.itemImage, getValues]);

  useEffect(() => {
    const unsubServices = onValue(child(ref(rtdb), 'services'), (snap) => {
      if (snap.exists()) {
        const data = snap.val() as Record<string, Service>;

        const mapedData = Object.entries(data).map(([serviceKey, service]) => ({
          label: service.title,
          value: serviceKey,
        }));

        setServices(mapedData);
        setValue('itemService', mapedData[0]);
      }
    });

    return () => unsubServices();
  }, [setValue]);

  return {
    services,
    loading: isSubmitting,
    control,
    errors,
    pickedImage: imgSrcFromFile,
    handleSubmit,
    register,
    onSubmit,
  };
};
