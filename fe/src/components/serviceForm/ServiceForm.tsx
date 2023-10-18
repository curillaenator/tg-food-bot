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
  'serviceWaitTime',
];

const TEXT_INPUTS_TITLES = {
  serviceTitle: 'Название ',
  serviceDescription: 'Описание',
  serviceAddres: 'Адрес сервиса',
  serviceWaitTime: 'Время ожидания доставки ~',
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
    onSubmit,
    handleCurrentCategory,
  } = useServiceForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <Flex gap={2} justifyContent='space-between' alignItems='center' mb={8}>
        <Heading fontSize='2xl'>Новый сервис</Heading>

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
              <FormLabel>Категория</FormLabel>

              <Select
                size='lg'
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
              <FormLabel>Подкатегория</FormLabel>

              <Select
                // isDisabled={!categories.length}
                size='lg'
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
        <FormLabel>Обложка</FormLabel>

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
            size='lg'
            w='full'
            h='fit-content'
            p={3}
          >
            Add photo
          </Button>
        </FileUploader>
      </FormControl>

      {pickedImage && <Image w='full' aspectRatio='3 / 1' objectFit='cover' borderRadius={12} src={pickedImage} />}

      {TEXT_INPUTS.map((inputId) => {
        const isRequired = inputId !== 'serviceWaitTime';

        const requiredRegisterOptions = {
          required: 'Required',
          minLength: { value: 5, message: 'Minimum length should be 5' },
        };

        return (
          <FormControl key={inputId} isInvalid={!!errors[inputId]} isRequired={isRequired} isDisabled={loading}>
            <FormLabel htmlFor={inputId}>{TEXT_INPUTS_TITLES[inputId]}</FormLabel>

            <Input
              size='lg'
              autoComplete='off'
              id={inputId}
              placeholder={isRequired ? 'Минимум 5 букв' : ''}
              {...register(inputId, isRequired && requiredRegisterOptions)}
            />

            <FormErrorMessage>{errors[inputId] && errors[inputId].message}</FormErrorMessage>
          </FormControl>
        );
      })}

      <Box mt={8} pb={0} w='full'>
        <Button
          leftIcon={<PlusSquareIcon boxSize={6} />}
          size='lg'
          w='full'
          p={4}
          h='fit-content'
          isLoading={loading}
          type='submit'
        >
          Добавить в базу
        </Button>
      </Box>
    </form>
  );
};
