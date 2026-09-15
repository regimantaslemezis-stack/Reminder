const LT_MONTHS = [
  'sausio',
  'vasario',
  'kovo',
  'balandžio',
  'gegužės',
  'birželio',
  'liepos',
  'rugpjūčio',
  'rugsėjo',
  'spalio',
  'lapkričio',
  'gruodžio',
];

const LT_WEEKDAYS = [
  'Sekmadienis',
  'Pirmadienis',
  'Antradienis',
  'Trečiadienis',
  'Ketvirtadienis',
  'Penktadienis',
  'Šeštadienis',
];

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeString(): string {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getTomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDateToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr === getTodayString();
}

export function isDateTomorrow(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr === getTomorrowString();
}

export function isReminderOverdue(dueDate?: string, dueTime?: string): boolean {
  if (!dueDate) return false;
  const today = getTodayString();
  if (dueDate < today) return true;
  if (dueDate === today && dueTime) {
    const currentTime = getCurrentTimeString();
    return dueTime < currentTime;
  }
  return false;
}

export function formatLithuanianDate(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return 'Nenurodyta';

  const todayStr = getTodayString();
  const tomorrowStr = getTomorrowString();

  let timeSuffix = timeStr ? ` ${timeStr}` : '';

  if (dateStr === todayStr) {
    return `Šiandien${timeSuffix ? `, ${timeSuffix.trim()}` : ''}`;
  }

  if (dateStr === tomorrowStr) {
    return `Rytoj${timeSuffix ? `, ${timeSuffix.trim()}` : ''}`;
  }

  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const currentYear = new Date().getFullYear();
  const monthName = LT_MONTHS[monthIdx] || '';

  if (year === currentYear) {
    return `${monthName} ${day} d.${timeSuffix ? `, ${timeSuffix.trim()}` : ''}`;
  }

  return `${year} m. ${monthName} ${day} d.${timeSuffix ? `, ${timeSuffix.trim()}` : ''}`;
}

export function getFormattedCurrentDate(): { weekday: string; date: string } {
  const d = new Date();
  const weekday = LT_WEEKDAYS[d.getDay()];
  const monthName = LT_MONTHS[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  return {
    weekday,
    date: `${year} m. ${monthName} ${day} d.`,
  };
}
