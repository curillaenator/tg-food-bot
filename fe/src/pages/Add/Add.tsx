import React, { FC, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { useForm, Controller } from 'react-hook-form';
import { Select } from 'chakra-react-select';

import { Box, Stack, FormErrorMessage, FormLabel, FormControl, Input, Button, Heading } from '@chakra-ui/react';

import { $globalStore } from '../../store';

import type { Category } from '../../components/ShowcaseSection';

import s from './styles.module.scss';

interface AddFormValues {
  serviceTitle: string;
  serviceAddres: string;
  serviceDescription: string;
  serviceType?: { label: string; value: string };
  serviceImage?: File;

  categories?: Category[];
}

const INITIAL_SERVICE_FORM: AddFormValues = {
  serviceTitle: '',
  serviceAddres: '',
  serviceDescription: '',
  serviceType: { label: 'Food', value: 'food' },
};

const TEXT_INPUTS: (keyof AddFormValues)[] = ['serviceTitle', 'serviceDescription', 'serviceAddres'];

export const Add: FC = () => {
  const { user } = useStore($globalStore);
  const navigate = useNavigate();

  useEffect(() => {
    const pageIsAvalable = !!user?.id && (user.role === 'admin' || user.role === 'manager');
    if (pageIsAvalable) return;

    navigate('/');
  }, [user, navigate]);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AddFormValues>({ defaultValues: INITIAL_SERVICE_FORM });

  const onSubmit = useCallback((formValues: AddFormValues) => {
    const bdPayload = { ...formValues, serviceType: formValues.serviceType.value };

    console.log(bdPayload);
  }, []);

  return (
    <Box as='main' h='full'>
      <Stack w='full' gap={8}>
        <form className={s.form}>
          <Heading fontSize='2xl' mb={8}>
            Create service item
          </Heading>
        </form>

        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <Heading fontSize='2xl' mb={8}>
            Create service
          </Heading>

          {TEXT_INPUTS.map((inputId) => (
            <FormControl key={inputId} isInvalid={!!errors[inputId]}>
              <FormLabel htmlFor={inputId}>{inputId.replace('service', '')}</FormLabel>

              <Input
                size='lg'
                id={inputId}
                placeholder='Minimum 5 chars'
                {...register(inputId, {
                  required: 'Required',
                  minLength: { value: 5, message: 'Minimum length should be 5' },
                })}
              />

              <FormErrorMessage>{errors[inputId] && errors[inputId].message}</FormErrorMessage>
            </FormControl>
          ))}

          <Controller
            control={control}
            name='serviceType'
            rules={{ required: 'Please enter at least one food group.' }}
            render={(renderProps) => {
              const {
                field,
                fieldState: { error },
              } = renderProps;

              const { onChange, onBlur, value, name, ref } = field;

              return (
                <FormControl>
                  <FormLabel>Category</FormLabel>

                  <Select
                    size='lg'
                    isMulti={false}
                    name={name}
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    options={[
                      { label: 'Food', value: 'food' },
                      { label: 'Beverages', value: 'beverages' },
                    ]}
                    placeholder='Food Groups'
                    closeMenuOnSelect={true}
                  />

                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              );
            }}
          />

          <Box pt={12} pb={4} w='full'>
            <Button size='lg' w='full' p={4} h='fit-content' isLoading={isSubmitting} type='submit'>
              Save
            </Button>
          </Box>
        </form>
      </Stack>
    </Box>
  );
};
