import { useState, useCallback, useEffect, type FormEvent } from 'react';
import { useStore } from 'effector-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ref, get } from 'firebase/database';

import { firedb, rtdb } from '../shared/firebase';
import { $globalStore } from '../store';

import { MONTH_LABELS } from '../shared/constants';
import type { Service, Item, User } from '../shared/interfaces';

interface SelectOptions {
  label: string;
  value: number | string;
}

interface TableItem {
  id: string;
  customer: User;
  details: Record<string, Item[]>;
  executorId: string;
  payed: string;
  status: string;
  totalApplicationPrice: string | number;
}

const filterDetailes = (details: Record<string, Service & { order: Item[] }>, selectedIds: string[]) => {
  const filtered = {};

  Object.entries(details).forEach(([serviceId, service]) => {
    if (selectedIds.includes(serviceId)) filtered[serviceId] = service.order;
  });

  return filtered;
};

export const useReports = () => {
  const { user } = useStore($globalStore);

  const [loading, setLoading] = useState<boolean>(false);

  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [month, setMonth] = useState<SelectOptions>({
    label: `${MONTH_LABELS[new Date().getMonth()]}`,
    value: new Date().getMonth(),
  });

  const [services, setServices] = useState<SelectOptions[]>(null);
  const [selectedService, setSelectedService] = useState<SelectOptions[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    if (!user?.ownerOf) {
      get(ref(rtdb, 'services')).then((snap) => {
        if (!snap.exists()) return;

        const data = Object.entries(snap.val() as Record<string, Service>).map(([id, { title }]) => ({
          value: id,
          label: title,
        }));

        setServices(data);
      });
    }
  }, [user]);

  const handleYear = useCallback((year: SelectOptions) => setYear(+year.value), []);
  const handleMonth = useCallback((month: SelectOptions) => setMonth(month), []);
  const handleService = useCallback((service: SelectOptions[]) => setSelectedService(service), []);

  const [tableData, setTableData] = useState<TableItem[]>([]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedService?.length) return;

    setLoading(true);

    const selectedIds = selectedService.map((selected) => String(selected.value));

    const fireQuery = query(
      collection(firedb, 'orders', `${year}`, `${month.value}`),
      where('status', '==', 'confirmed'),
    );

    const monthApplications = await getDocs(fireQuery).then((snap) => snap.docs.map((doc) => doc.data()));

    if (!monthApplications.length) {
      setTableData([]);
      setLoading(false);
      return;
    }

    const filteredByServiceId = monthApplications
      .map((order) => ({ ...order, details: filterDetailes(order.details, selectedIds) }))
      .filter((order) => !!Object.keys(order.details).length);

    setTableData(filteredByServiceId as TableItem[]);

    setLoading(false);
  };

  return {
    tableData,
    loading,
    month,
    year,
    services,
    selectedService,
    handleMonth,
    handleYear,
    handleService,
    onSubmit,
  };
};
