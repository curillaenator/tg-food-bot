const rtf = new Intl.RelativeTimeFormat('ru', {
  numeric: 'auto',
  style: 'long',
  localeMatcher: 'best fit',
});

export const getRelativeTime = (dateStamp: string) => {
  const diffSeconds = Math.round((+dateStamp - Date.now()) / 1000);

  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
  const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

  const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(diffSeconds));

  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // @ts-expect-error TODO проверить типизацию
  return rtf.format(Math.floor(diffSeconds / divisor), units[unitIndex]);
};
