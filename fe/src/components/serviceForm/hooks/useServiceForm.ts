import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm, useFormState } from 'react-hook-form';

import { ref, child, push, update } from 'firebase/database';
import { ref as storageRef, uploadBytes } from 'firebase/storage';

import { useCategoriesQuery } from './useCategoriesQuery';
import { rtdb, strg } from '../../../shared/firebase';
import { resizeFile } from '../../../utils';

import { TOAST_DURATION } from '../../../shared/constants';
import type { ServiceFormValuesType } from '../interfaces';

const FILE_META = {
  cacheControl: 'public,max-age=7200',
  contentType: 'image/jpeg',
};

const INITIAL_SERVICE_FORM: ServiceFormValuesType = {
  serviceTitle: '',
  serviceAddres: '',
  serviceDescription: '',
  serviceWaitTime: '',
  serviceImage: null,
  serviceCategory: { label: '', value: '' },
  serviceSubcategory: { label: '', value: '' },
};

export const useServiceForm = () => {
  const { loading, categories, subcategories, handleCurrentCategory } = useCategoriesQuery();

  const toast = useToast();

  const {
    getValues,
    setValue,
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValuesType>({ defaultValues: INITIAL_SERVICE_FORM });

  const [imgSrcFromFile, setImgSrcFromFile] = useState<string | undefined>(undefined);
  const { dirtyFields } = useFormState({ control });

  const onSubmit = useCallback(
    async (formValues: ServiceFormValuesType) => {
      const data = {
        ...formValues,
        serviceCategory: formValues.serviceCategory.value,
        serviceSubcategory: formValues.serviceSubcategory.value,
      };

      const serviceId = push(child(ref(rtdb), 'services')).key;

      const resizedFile = await resizeFile(data.serviceImage[0]);
      const renamedFile = new File([resizedFile], serviceId);

      const fileRef = storageRef(strg, `services/${renamedFile.name}`);

      await uploadBytes(fileRef, renamedFile, FILE_META).catch((err) => console.table(err));

      const updates = {
        [`categories/${data.serviceCategory}/${data.serviceSubcategory}/categories/${serviceId}`]: true,

        [`services/${serviceId}`]: {
          title: data.serviceTitle,
          description: data.serviceDescription,
          parent: `${data.serviceCategory}/${data.serviceSubcategory}`,
          adress: data.serviceAddres,
          waitTime: data.serviceWaitTime,
          imgPath: `services/${renamedFile.name}`,
          type: 'service',
          isActive: true,
        },
      };

      await update(ref(rtdb), updates);

      reset({
        ...INITIAL_SERVICE_FORM,
        serviceCategory: categories[0] || INITIAL_SERVICE_FORM.serviceCategory,
        serviceSubcategory: subcategories[0] || INITIAL_SERVICE_FORM.serviceSubcategory,
      });

      setImgSrcFromFile(undefined);

      toast({
        title: 'Готово',
        description:
          'Сервис создан, теперь его можно привязать к владельцу сервиса, после чего редактировать как владельцу сервиса, так и менеджерам Pixpax из любого места меню при включеном editMode',
        status: 'warning',
        duration: TOAST_DURATION * 3,
        isClosable: true,
      });

      console.table(data);
    },
    [reset, toast, categories, subcategories],
  );

  useEffect(() => {
    if (!dirtyFields.serviceImage) return;

    const files = getValues().serviceImage;
    setImgSrcFromFile(URL.createObjectURL(files[0]));
  }, [dirtyFields.serviceImage, getValues]);

  useEffect(() => {
    if (!categories.length) return;

    setValue('serviceCategory', categories[0]);
    handleCurrentCategory(categories[0]);
  }, [categories, setValue, handleCurrentCategory]);

  useEffect(() => {
    if (!subcategories.length) return;

    setValue('serviceSubcategory', subcategories[0]);
  }, [subcategories, setValue, getValues]);

  return {
    loading: loading || isSubmitting,
    categories,
    subcategories,
    pickedImage: imgSrcFromFile,
    control,
    errors,
    handleSubmit,
    register,
    onSubmit,
    handleCurrentCategory,
  };
};
