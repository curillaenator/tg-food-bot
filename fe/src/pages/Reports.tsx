import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { Select } from 'chakra-react-select';

import {
  Box,
  FormControl,
  FormLabel,
  // Button
} from '@chakra-ui/react';

import { useReports } from '../hooks/useReports';
import { $globalStore } from '../store';

import { isManager } from '../utils';
import { MONTH_LABELS, YEARS } from '../shared/constants';

import styles from './styles.module.scss';

export const Reports: FC = () => {
  const { user } = useStore($globalStore);
  const navigate = useNavigate();

  useEffect(() => {
    const pageIsAvalable = isManager(user?.role);

    if (pageIsAvalable) return;

    navigate('/');
  }, [user, navigate]);

  const { year, month, handleYear, handleMonth, onSubmit } = useReports();

  return (
    <Box as='main' h='full' px={4} pb={4}>
      <form className={styles.form} onSubmit={onSubmit}>
        <FormControl isRequired>
          <FormLabel fontSize='sm'>Выбрать год</FormLabel>

          <Select
            size='md'
            isMulti={false}
            name='year-selector'
            onChange={handleYear}
            value={{ label: year, value: year }}
            options={YEARS.map((n) => ({ label: n, value: n }))}
            placeholder='Выбрать год'
            closeMenuOnSelect={true}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize='sm'>Выбрать месяц</FormLabel>

          <Select
            size='md'
            isMulti={false}
            name='month-selector'
            onChange={handleMonth}
            value={month}
            options={Object.entries(MONTH_LABELS).map(([v, label]) => ({ value: +v, label }))}
            placeholder='Выбрать год'
            closeMenuOnSelect={true}
          />
        </FormControl>

        {/* <Button size='md' w='full' type='submit'>
          Сформировать
        </Button> */}
      </form>
    </Box>
  );
};
