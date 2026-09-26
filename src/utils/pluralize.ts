/**
 * Returns a count followed by its correctly pluralized noun.
 *
 * @example pluralize(1, "application")              // "1 application"
 * @example pluralize(3, "application")              // "3 applications"
 * @example pluralize(0, "volunteer")                // "0 volunteers"
 * @example pluralize(2, "category", "categories")   // "2 categories"
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${word}`;
}
