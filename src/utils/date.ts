const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface DateParts {
  year: number;
  month: number;
  day: number;
}

/**
 * Parses an ISO date/datetime (e.g. "2026-10-05" or "2026-09-10T08:51:38.014939Z")
 * or a "DD/MM/YYYY" string into its year/month/day parts.
 *
 * Parsing the components directly (instead of using `new Date(...)`) avoids the
 * off-by-one-day bug that occurs when the browser treats a date-only string as
 * UTC and shifts it into a negative-offset local timezone.
 */
function parseDateParts(value?: string): DateParts | null {
  if (!value) return null;

  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return { year: Number(iso[1]), month: Number(iso[2]), day: Number(iso[3]) };
  }

  const slash = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slash) {
    return { year: Number(slash[3]), month: Number(slash[2]), day: Number(slash[1]) };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return { year: parsed.getFullYear(), month: parsed.getMonth() + 1, day: parsed.getDate() };
}

/** Formats a date string into a human-readable "Oct 5, 2026" style label. */
export function formatDisplayDate(value?: string): string {
  const parts = parseDateParts(value);
  if (!parts) return "—";
  const monthName = MONTHS[parts.month - 1] ?? "";
  return `${monthName} ${parts.day}, ${parts.year}`;
}

/** Converts a date string into an "YYYY-MM-DD" value suitable for <input type="date">. */
export function toISODateInput(value?: string): string {
  const parts = parseDateParts(value);
  if (!parts) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}
