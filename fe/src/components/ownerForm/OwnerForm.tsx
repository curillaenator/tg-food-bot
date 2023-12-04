import React, { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Select } from 'chakra-react-select';

import { Box, Flex, FormErrorMessage, FormLabel, FormControl, Button, Heading, Spinner, Text } from '@chakra-ui/react';

import { PlusSquareIcon } from '@chakra-ui/icons';

import { AttachedServices } from './AtachedServices';

import { useOwnerForm } from './hooks/useOwnerForm';

import s from './styles.module.scss';

export const OwnerForm: FC = () => {
  const {
    selectedUser,
    servicesOwned,
    serviceToOwn,

    ownersList,
    servicesList,

    loading = false,

    control,
    handleSubmit,
    onSubmit,
    setValue,
  } = useOwnerForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <Flex gap={2} justifyContent='space-between' alignItems='center'>
        <Heading fontSize='xl'>Связать сервис и партнера</Heading>
        {loading && <Spinner />}
      </Flex>

      <Text fontSize='sm' color='chakra-subtle-text'>
        Список отображаемых партнеров согласовывается с Админом
      </Text>

      <Controller
        control={control}
        name='user'
        rules={{ required: 'Нужно выбрать партнера из списка' }}
        render={(renderProps) => {
          const {
            field,
            fieldState: { error },
          } = renderProps;

          const { onChange, onBlur, value, name, ref } = field;

          return (
            <FormControl isRequired isDisabled={loading}>
              <FormLabel fontSize='sm'>Выбрать партнера</FormLabel>

              <Select
                size='md'
                isMulti={false}
                name={name}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                options={ownersList}
                closeMenuOnSelect={true}
              />

              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </FormControl>
          );
        }}
      />

      <AttachedServices
        selectedUser={selectedUser}
        setValue={setValue}
        // @ts-expect-error types
        servicesList={servicesList}
        servicesOwned={servicesOwned}
      />

      <Controller
        control={control}
        name='serviceToOwn'
        rules={{ required: 'Please select at least one service' }}
        render={(renderProps) => {
          const {
            field,
            fieldState: { error },
          } = renderProps;

          const { onChange, onBlur, value, name, ref } = field;

          return (
            <FormControl isRequired isDisabled={!selectedUser?.id || loading}>
              <FormLabel fontSize='sm'>Выбрать сервис</FormLabel>

              <Select
                size='md'
                isMulti={false}
                name={name}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                options={servicesList}
                closeMenuOnSelect={true}
              />

              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </FormControl>
          );
        }}
      />

      <Box mt={2} pb={0} w='full'>
        <Button
          isDisabled={!serviceToOwn}
          leftIcon={<PlusSquareIcon boxSize={6} />}
          size='md'
          w='full'
          p={4}
          isLoading={loading}
          type='submit'
        >
          Привязать сервис
        </Button>
      </Box>
    </form>
  );
};
