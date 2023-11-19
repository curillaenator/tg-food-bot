import React, { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Select } from 'chakra-react-select';

import { Box, Flex, FormErrorMessage, FormLabel, FormControl, Button, Heading, Spinner } from '@chakra-ui/react';

import { PlusSquareIcon } from '@chakra-ui/icons';

import { AttachedServices } from './AtachedServices';

import { useOwnerForm } from './hooks/useOwnerForm';

import s from './styles.module.scss';

export const OwnerForm: FC = () => {
  const {
    selectedUser,
    attachedServices,
    allUsers,
    allServices,
    loading = false,
    control,
    // errors,
    handleSubmit,
    // register,
    onSubmit,
    setValue,
  } = useOwnerForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <Flex gap={2} justifyContent='space-between' alignItems='center' mb={8}>
        <Heading fontSize='2xl'>Привязать сервис к пользователю</Heading>

        {loading && <Spinner />}
      </Flex>

      <Controller
        control={control}
        name='user'
        rules={{ required: 'Please select at least one user' }}
        render={(renderProps) => {
          const {
            field,
            fieldState: { error },
          } = renderProps;

          const { onChange, onBlur, value, name, ref } = field;

          return (
            <FormControl isRequired isDisabled={loading}>
              <FormLabel>Выбрать пользователя</FormLabel>

              <Select
                size='lg'
                isMulti={false}
                name={name}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                options={allUsers}
                closeMenuOnSelect={true}
              />

              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </FormControl>
          );
        }}
      />

      {selectedUser?.ownerOf && (
        <AttachedServices
          selectedUser={selectedUser}
          attachedServices={attachedServices}
          setValue={setValue}
          // @ts-expect-error types
          allServices={allServices}
        />
      )}

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
                options={allServices}
                closeMenuOnSelect={true}
              />

              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </FormControl>
          );
        }}
      />

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
          Привязать сервис
        </Button>
      </Box>
    </form>
  );
};
