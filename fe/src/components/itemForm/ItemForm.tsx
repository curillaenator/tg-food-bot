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

import { FileUploader } from '../fileUploader';

import { useItemForm } from './hooks/useItemForm';
import { validateFiles } from './validateFiles';
import type { ItemFormValuesType } from './interfaces';
import s from './styles.module.scss';

const TEXT_INPUTS: (keyof ItemFormValuesType)[] = ['itemTitle', 'itemDescription', 'itemPrice'];

const TEXT_INPUTS_TITLES = {
  itemTitle: 'Название',
  itemDescription: 'Описание',
  itemPrice: 'Цена из меню сервиса (ВАЖНО!!!)',
};

export const ItemForm: FC = () => {
  const {
    loading,
    pickedImage = undefined,
    services,
    control,
    errors,
    handleSubmit,
    register,
    onSubmit,
  } = useItemForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <Flex gap={2} justifyContent='space-between' alignItems='center' mb={4}>
        <Heading fontSize='2xl'>Новый товар</Heading>

        {loading && <Spinner />}
      </Flex>

      <Controller
        control={control}
        name='itemService'
        rules={{ required: 'Please select at least one category' }}
        render={(renderProps) => {
          const {
            field,
            fieldState: { error },
          } = renderProps;

          const { onChange, onBlur, value, name, ref } = field;

          return (
            <FormControl isRequired isDisabled={loading}>
              <FormLabel>Выбрать сервис</FormLabel>

              <Select
                size='lg'
                isMulti={false}
                name={name}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                options={services}
                placeholder='Categories'
                closeMenuOnSelect={true}
              />

              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </FormControl>
          );
        }}
      />

      <FormControl isInvalid={!!errors.itemImage} isRequired isDisabled={loading}>
        <FormLabel>Обложка</FormLabel>

        <FileUploader
          // multiple
          accept={'image/*'}
          register={register('itemImage', { validate: validateFiles })}
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

      {TEXT_INPUTS.map((inputId) => (
        <FormControl key={inputId} isInvalid={!!errors[inputId]} isRequired isDisabled={loading}>
          <FormLabel htmlFor={inputId}>{TEXT_INPUTS_TITLES[inputId]}</FormLabel>

          <Input
            size='lg'
            type={inputId === 'itemPrice' ? 'number' : 'text'}
            autoComplete='off'
            id={inputId}
            placeholder='Minimum 5 chars'
            {...register(inputId, {
              required: 'Required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
          />

          <FormErrorMessage>{errors[inputId] && errors[inputId].message}</FormErrorMessage>
        </FormControl>
      ))}

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
