export function parseZonedDateTime(zonedDateTimeStr?:string) {
  if(!zonedDateTimeStr)
    return

  const date = new Date(zonedDateTimeStr);
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
export function parseTime(timeTimeStr?:string){
  if(!timeTimeStr)
    return
  const date = new Date(timeTimeStr)

  return date.toLocaleTimeString("en-uk")
}