export const timestampToTime = (ts: number, precision = 9) => {
  const roughSeconds = ts / 1e9;
  const numSeconds = Math.floor(roughSeconds);

  const hours = Math.floor(numSeconds / 3600);
  const minutes = Math.floor((numSeconds - hours * 3600) / 60);
  const seconds = numSeconds - hours * 3600 - minutes * 60;

  const precisionMultiplier = Math.pow(10, precision);
  let fraction = roughSeconds - numSeconds;
  fraction = Math.round(fraction * precisionMultiplier) / precisionMultiplier;

  return (
    String(hours).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0') +
    ':' +
    String(seconds).padStart(2, '0') +
    '.' +
    String(fraction).substring(2).padStart(precision, '0')
  );
};
