import React, { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Select } from 'chakra-react-select';

import {
  Box,
  Flex,
  Image,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Heading,
  Spinner,
} from '@chakra-ui/react';

import { LinkIcon, PlusSquareIcon } from '@chakra-ui/icons';

import { useServiceForm } from './hooks/useServiceForm';

import { validateFiles } from './utils';

import { FileUploader } from '../fileUploader';

import type { ServiceFormValuesType } from './interfaces';
import s from './styles.module.scss';

const TEXT_INPUTS: (keyof ServiceFormValuesType)[] = [
  'serviceTitle',
  'serviceDescription',
  'serviceAddres',
  'serviceWorkHours',
];

const TEXT_INPUTS_TITLES = {
  serviceTitle: 'Название ',
  serviceDescription: 'Описание',
  serviceAddres: 'Адрес сервиса',
  serviceWaitTime: 'Время работы сервиса',
};

export const ServiceForm: FC = () => {
  const {
    loading,
    pickedImage = undefined,
    categories,
    subcategories,
    control,
    errors,
    handleSubmit,
    register,
    registerWithMask,
    onSubmit,
    handleCurrentCategory,
  } = useServiceForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <Flex gap={2} justifyContent='space-between' alignItems='center'>
        <Heading fontSize='xl'>Новый сервис</Heading>
        {loading && <Spinner />}
      </Flex>

      <Controller
        control={control}
        name='serviceCategory'
        rules={{ required: 'Please select at least one category' }}
        render={(renderProps) => {
          const {
            field,
            fieldState: { error },
          } = renderProps;

          const { onChange, onBlur, value, name, ref } = field;

          return (
            <FormControl isRequired isDisabled={loading}>
              <FormLabel fontSize='sm'>Категория</FormLabel>

              <Select
                size='md'
                isMulti={false}
                name={name}
                ref={ref}
                onChange={(e) => {
                  onChange(e);
                  handleCurrentCategory(e);
                }}
                onBlur={onBlur}
                value={value}
                options={categories}
                placeholder='Categories'
                closeMenuOnSelect={true}
              />

              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </FormControl>
          );
        }}
      />

      <Controller
        control={control}
        name='serviceSubcategory'
        rules={{ required: 'Please select at least one subcategory' }}
        render={(renderProps) => {
          const {
            field,
            fieldState: { error },
          } = renderProps;

          const { onChange, onBlur, value, name, ref } = field;

          return (
            <FormControl isRequired isDisabled={loading || !subcategories.length}>
              <FormLabel fontSize='sm'>Подкатегория</FormLabel>

              <Select
                // isDisabled={!categories.length}
                size='md'
                isMulti={false}
                name={name}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                options={subcategories}
                placeholder='Categories'
                closeMenuOnSelect={true}
              />

              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </FormControl>
          );
        }}
      />

      <FormControl isInvalid={!!errors.serviceImage} isRequired isDisabled={loading}>
        <FormLabel fontSize='sm'>Обложка</FormLabel>

        <FileUploader
          // multiple
          accept={'image/*'}
          register={register('serviceImage', { validate: validateFiles })}
        >
          <Button
            variant='outline'
            colorScheme='gray'
            color='whiteAlpha.400'
            leftIcon={<LinkIcon boxSize={4} />}
            size='md'
            w='full'
            p={2}
          >
            Add photo
          </Button>
        </FileUploader>
      </FormControl>

      {pickedImage && <Image w='full' aspectRatio='3 / 1' objectFit='cover' borderRadius={12} src={pickedImage} />}

      {TEXT_INPUTS.map((inputId) => {
        const isWorkingHours = inputId === 'serviceWorkHours';

        const requiredRegisterOptions = {
          required: 'Required',
          minLength: { value: 5, message: 'Minimum length should be 5' },
        };

        const formRegister = isWorkingHours
          ? registerWithMask(inputId, ['99:99-99:99'], requiredRegisterOptions)
          : register(inputId, requiredRegisterOptions);

        return (
          <FormControl key={inputId} isInvalid={!!errors[inputId]} isRequired isDisabled={loading}>
            <FormLabel fontSize='sm' htmlFor={inputId}>
              {TEXT_INPUTS_TITLES[inputId]}
            </FormLabel>

            <Input
              {...formRegister}
              size='md'
              autoComplete='off'
              id={inputId}
              placeholder={isWorkingHours ? '9:00-20:00' : 'Минимум 5 букв'}
            />

            <FormErrorMessage>{errors[inputId] && errors[inputId].message}</FormErrorMessage>
          </FormControl>
        );
      })}

      <Box mt={2} pb={0} w='full'>
        <Button leftIcon={<PlusSquareIcon boxSize={6} />} size='md' w='full' p={4} isLoading={loading} type='submit'>
          Добавить в базу
        </Button>
      </Box>
    </form>
  );
};
