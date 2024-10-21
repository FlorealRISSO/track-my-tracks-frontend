function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function moveDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

export { formatDate, moveDays };