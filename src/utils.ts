export const timestampToTime = (ts: number) => {
  const rough_seconds = ts / 1e9
  var sec_num = Math.floor(rough_seconds);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  return String(hours).padStart(2, '0') +
    ':' + String(minutes).padStart(2, '0') +
    ':' + String(seconds).padStart(2, '0') +
    // Doing this trick to avoid precision errors in javascript..
    '.' + String(rough_seconds).split('.').pop()!.padStart(9, '0')
}
