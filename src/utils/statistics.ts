import { RiskStatisticsResult } from '../types';

export function calculateStatistics(returns: number[], riskFreeRate: number = 2.0): RiskStatisticsResult {
  const cleanReturns = returns.filter((r) => typeof r === 'number' && !isNaN(r));

  if (cleanReturns.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      variance: 0,
      standardDeviation: 0,
      minReturn: 0,
      maxReturn: 0,
      positiveCount: 0,
      negativeCount: 0,
      sharpeRatio: 0,
      distributionBins: [],
    };
  }

  const n = cleanReturns.length;
  const sum = cleanReturns.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  // Sorted array for median, min, max
  const sorted = [...cleanReturns].sort((a, b) => a - b);
  const minReturn = sorted[0];
  const maxReturn = sorted[sorted.length - 1];

  let median = 0;
  const mid = Math.floor(n / 2);
  if (n % 2 !== 0) {
    median = sorted[mid];
  } else {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  }

  // Variance & Standard Deviation (Population standard deviation per formula in cards)
  const sumSquaredDiffs = cleanReturns.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const variance = sumSquaredDiffs / n;
  const standardDeviation = Math.sqrt(variance);

  const positiveCount = cleanReturns.filter((r) => r > 0).length;
  const negativeCount = cleanReturns.filter((r) => r < 0).length;

  const sharpeRatio = standardDeviation > 0 ? (mean - riskFreeRate) / standardDeviation : 0;

  // Generate distribution bins for histogram chart
  const binsCount = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(n))));
  const rangeSpan = maxReturn === minReturn ? 10 : maxReturn - minReturn;
  const step = rangeSpan / binsCount;

  const distributionBins: RiskStatisticsResult['distributionBins'] = [];

  for (let i = 0; i < binsCount; i++) {
    const binStart = minReturn + i * step;
    const binEnd = minReturn + (i + 1) * step;
    const isLast = i === binsCount - 1;

    const count = cleanReturns.filter((val) => {
      if (isLast) {
        return val >= binStart && val <= binEnd;
      }
      return val >= binStart && val < binEnd;
    }).length;

    const midPoint = (binStart + binEnd) / 2;

    // Normal probability density function: (1 / (sigma * sqrt(2*pi))) * exp(-0.5 * ((x-mu)/sigma)^2)
    let normalDensity = 0;
    if (standardDeviation > 0) {
      const z = (midPoint - mean) / standardDeviation;
      const pdf = (1 / (standardDeviation * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
      // Scale PDF so it visualizes nicely alongside count
      normalDensity = Number((pdf * n * step).toFixed(2));
    }

    distributionBins.push({
      range: `${binStart.toFixed(1)}% to ${binEnd.toFixed(1)}%`,
      count,
      normalDensity,
    });
  }

  return {
    count: n,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    standardDeviation: Number(standardDeviation.toFixed(2)),
    minReturn: Number(minReturn.toFixed(2)),
    maxReturn: Number(maxReturn.toFixed(2)),
    positiveCount,
    negativeCount,
    sharpeRatio: Number(sharpeRatio.toFixed(2)),
    distributionBins,
  };
}
