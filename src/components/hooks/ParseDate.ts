export function parseZonedDateTime(zonedDateTimeStr:string) {
  const date = new Date(zonedDateTimeStr);
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
