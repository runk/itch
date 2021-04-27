export const timestampToTime = (ts: number, precision = 9) => {
  const rough_seconds = ts / 1e9;
  var sec_num = Math.floor(rough_seconds);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  const precisionFactor = Math.pow(10, precision);
  let fraction = rough_seconds - sec_num;
  fraction = Math.round(fraction * precisionFactor) / precisionFactor;

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
