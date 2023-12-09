import { useState, useCallback, type FormEvent } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
// import type { Options } from 'chakra-react-select';

import { firedb } from '../shared/firebase';
import { MONTH_LABELS } from '../shared/constants';

interface Year {
  label: number;
  value: number;
}

interface Month {
  label: string;
  value: number;
}

export const useReports = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [month, setMonth] = useState<Month>({
    label: MONTH_LABELS[new Date().getMonth()],
    value: new Date().getMonth(),
  });

  const handleYear = useCallback((year: Year) => setYear(year.value), []);
  const handleMonth = useCallback((month: Month) => setMonth(month), []);

  // useEffect(() => {}, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    console.log('submitting');

    const monthOrders = await getDocs(query(collection(firedb, 'orders', `${year}`, `${month.value}`)));

    const monthfullfiled = monthOrders.docs.map((doc) => doc.data());

    console.log(monthfullfiled);
  };

  return {
    loading,
    month,
    year,
    handleMonth,
    handleYear,
    onSubmit,
  };
};
