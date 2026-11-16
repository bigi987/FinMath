import { useState, useEffect } from 'react';
import { Currency } from '../types';
import { convertCurrency, DEFAULT_RATES, fetchLiveRates, formatCurrency } from '../utils/currency';
import { useLocalStorage } from './useLocalStorage';

export function useCurrency() {
  const [currency, setCurrency] = useLocalStorage<Currency>('finmath_currency', 'USD');
  const [rates, setRates] = useState<Record<Currency, number>>(DEFAULT_RATES);
  const [lastUpdated, setLastUpdated] = useState<string>('Standard Rates');
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    fetchLiveRates().then((res) => {
      setRates(res.rates);
      setLastUpdated(res.updatedAt);
      setIsLive(res.isLive);
    });
  }, []);

  const format = (amount: number, options?: { showDecimals?: boolean; compact?: boolean; symbolPrefix?: boolean }) => {
    return formatCurrency(amount, currency, options);
  };

  const convert = (amount: number, from: Currency, to: Currency) => {
    return convertCurrency(amount, from, to, rates);
  };

  return {
    currency,
    setCurrency,
    rates,
    lastUpdated,
    isLive,
    format,
    convert,
  };
}
