/** A takrir session the teacher creates on a day when takrir happens; not every day has one. */
export type TakrirDay = {
  id: string;
  date: string;
  /** studentId -> gave takrir? Students present at creation start as "vermedi". */
  results: Record<string, boolean>;
};

export function createTakrirDay(days: TakrirDay[], id: string, date: string, studentIds: string[]): TakrirDay[] {
  if (days.some((d) => d.date === date)) return days;
  return [...days, { id, date, results: Object.fromEntries(studentIds.map((s) => [s, false])) }];
}

export function setTakrir(days: TakrirDay[], date: string, studentId: string, verdi: boolean): TakrirDay[] {
  return days.map((d) => (d.date === date ? { ...d, results: { ...d.results, [studentId]: verdi } } : d));
}

/** Counts only takrir days where the student is listed, so days without takrir never count. */
export function takrirStats(days: TakrirDay[], studentId: string): { verdi: number; vermedi: number } {
  let verdi = 0, vermedi = 0;
  for (const d of days) {
    if (!(studentId in d.results)) continue;
    if (d.results[studentId]) verdi++;
    else vermedi++;
  }
  return { verdi, vermedi };
}
