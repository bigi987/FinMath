import { Currency } from '../types';

export const DEFAULT_RATES: Record<Currency, number> = {
  USD: 1.0,
  MDL: 18.0,
  EUR: 18.0 / 19.5, // 1 EUR = 19.5 MDL, so in USD base: 18 / 19.5 ≈ 0.923
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  MDL: 'MDL',
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  MDL: 'Moldovan Leu',
};

/**
 * Converts an amount from one currency to another using the USD-based rate table.
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rates: Record<Currency, number> = DEFAULT_RATES
): number {
  if (from === to) return amount;
  if (!amount || isNaN(amount)) return 0;

  // Convert `from` to base (USD), then base (USD) to `to`
  const rateFrom = rates[from] || 1;
  const rateTo = rates[to] || 1;

  const inUSD = amount / rateFrom;
  const inTarget = inUSD * rateTo;

  return Number(inTarget.toFixed(2));
}

/**
 * Formats a monetary number with thousands separators, 2 decimal places, and currency code.
 * e.g. 16,974.12 USD
 */
export function formatCurrency(
  amount: number,
  currency: Currency,
  options?: {
    showDecimals?: boolean;
    compact?: boolean;
    symbolPrefix?: boolean;
  }
): string {
  const { showDecimals = true, compact = false, symbolPrefix = false } = options || {};

  if (amount === null || amount === undefined || isNaN(amount)) {
    if (symbolPrefix && currency !== 'MDL') {
      return `${CURRENCY_SYMBOLS[currency]}0`;
    }
    return `0 ${currency}`;
  }

  if (compact) {
    if (Math.abs(amount) >= 1_000_000) {
      const val = (amount / 1_000_000).toFixed(1).replace(/\.0$/, '');
      if (symbolPrefix && currency !== 'MDL') return `${CURRENCY_SYMBOLS[currency]}${val}M`;
      return `${val}M ${currency}`;
    }
    if (Math.abs(amount) >= 1_000) {
      const val = (amount / 1_000).toFixed(1).replace(/\.0$/, '');
      if (symbolPrefix && currency !== 'MDL') return `${CURRENCY_SYMBOLS[currency]}${val}k`;
      return `${val}k ${currency}`;
    }
    if (amount === 0) {
      if (symbolPrefix && currency !== 'MDL') return `${CURRENCY_SYMBOLS[currency]}0`;
      return `0 ${currency}`;
    }
  }

  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  if (symbolPrefix && currency !== 'MDL') {
    return `${CURRENCY_SYMBOLS[currency]}${formattedNum}`;
  }

  return `${formattedNum} ${currency}`;
}

/**
 * Fetch live rates with fallback
 */
export async function fetchLiveRates(): Promise<{
  rates: Record<Currency, number>;
  updatedAt: string;
  isLive: boolean;
}> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data && data.rates && data.rates.MDL && data.rates.EUR) {
      return {
        rates: {
          USD: 1.0,
          MDL: data.rates.MDL,
          EUR: data.rates.EUR,
        },
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLive: true,
      };
    }
  } catch {
    // Graceful fallback to reference fixed rates
  }

  return {
    rates: DEFAULT_RATES,
    updatedAt: 'Default (1 USD = 18 MDL · 1 EUR = 19.5 MDL)',
    isLive: false,
  };
}
