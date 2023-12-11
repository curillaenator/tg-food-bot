import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { Select } from 'chakra-react-select';

import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Divider,
  Stack,
  Flex,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';

import { useReports } from '../hooks/useReports';
import { $globalStore } from '../store';

import { isManager, VNpricer } from '../utils';
import { MONTH_LABELS, YEARS } from '../shared/constants';

import type { Item } from '../shared/interfaces';

import styles from './styles.module.scss';

const DataRow: FC<{ id: string; details: Record<string, Item[]> }> = ({ id, details }) => {
  const data = Object.entries(details).map(([serviceId, order]) => ({ id: serviceId, order }));

  const orderPrice = data
    .map(({ order }) => order.reduce((acc, { qty, price }) => acc + +qty * +price, 0))
    .reduce((total, subTotal) => total + subTotal);

  return (
    <Tr>
      <Td>
        <Text width='64px' overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>
          {id}
        </Text>
      </Td>

      <Td>
        <Stack gap={2}>
          {data.map(({ id, order }) => (
            <UnorderedList key={id}>
              {order.map(({ title, qty, price }) => (
                <ListItem key={`${title}-${price}`} w='full'>
                  <Flex gap={2} w='full' justifyContent='space-between'>
                    <Text>{title}</Text>
                    <Text>{`| ${qty} |`}</Text>
                    <Text>{VNpricer.format(+price)}</Text>
                  </Flex>
                </ListItem>
              ))}
            </UnorderedList>
          ))}
        </Stack>
      </Td>

      <Td>{VNpricer.format(orderPrice)}</Td>
    </Tr>
  );
};

export const Reports: FC = () => {
  const { user } = useStore($globalStore);
  const navigate = useNavigate();

  useEffect(() => {
    const pageIsAvalable = user?.id && isManager(user?.role);

    if (pageIsAvalable) return;

    navigate('/');
  }, [user, navigate]);

  const {
    tableData,
    year,
    month,
    selectedService,
    services,
    loading,
    handleYear,
    handleMonth,
    handleService,
    onSubmit,
  } = useReports();

  // const userIsOwner = !!user?.ownerOf;

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
            value={{ label: `${year}`, value: `${year}` }}
            options={YEARS.map((n) => ({ label: `${n}`, value: `${n}` }))}
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

        <FormControl isRequired isDisabled={!services?.length}>
          <FormLabel fontSize='sm'>Выбрать сервис</FormLabel>

          <Select
            size='md'
            isMulti={true}
            name='service-selector'
            value={selectedService}
            onChange={handleService}
            options={services || []}
            placeholder='Выбрать сервис'
            closeMenuOnSelect={true}
          />
        </FormControl>

        <Button size='md' w='full' type='submit' isLoading={loading} isDisabled={loading}>
          Сформировать
        </Button>
      </form>

      <Divider my={4} />

      {!!tableData.length && (
        <TableContainer>
          <Table variant='striped' colorScheme='telegram' size='sm'>
            {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}

            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Состав</Th>
                <Th>Итог</Th>
              </Tr>
            </Thead>

            <Tbody>
              {tableData.map(({ id, details }) => (
                <DataRow key={id} id={id} details={details} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
