import type { ItemContribution, ItemNeed } from "../interface/interfaces";

/**
 * Limits for item requests and pledges. Enforced client-side for UX;
 * the backend must apply the same limits since client checks can be bypassed.
 */
export const ITEM_NAME_MAX = 80;
export const ITEM_DESCRIPTION_MAX = 200;
export const ITEM_QUANTITY_MAX = 10000;
export const MAX_ITEM_ROWS = 20;

/**
 * Keeps digits only and caps the value, so quantity inputs never hold "1e5", "-3" or "2.5".
 * Returns 0 for an empty input, which validation reports as missing.
 *
 * @example parseQuantity("12")   // 12
 * @example parseQuantity("1,200") // 1200
 * @example parseQuantity("")     // 0
 */
export function parseQuantity(value: string, max: number = ITEM_QUANTITY_MAX): number {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  return digits ? Math.min(Number(digits), max) : 0;
}

const isBlankItem = (item: ItemNeed) => !item.name.trim() && !item.quantity && !item.description?.trim();

/** Trims values and drops rows the user left completely empty, ready to send to the API. */
export function sanitizeItemNeeds(items: ItemNeed[] = []): ItemNeed[] {
  return items
    .filter((item) => !isBlankItem(item))
    .map((item) => ({
      name: item.name.trim().slice(0, ITEM_NAME_MAX),
      quantity: Math.trunc(Number(item.quantity)) || 0,
      ...(item.description?.trim() ? { description: item.description.trim().slice(0, ITEM_DESCRIPTION_MAX) } : {}),
    }));
}

/**
 * Returns an error message for the first problem found, or undefined when the list is valid.
 * `noun` and `quantityLabel` let the same rules word errors for other needs, e.g. services and people.
 */
export function validateItemNeeds(
  items: ItemNeed[] = [],
  { noun = "item", quantityLabel = "a quantity" }: { noun?: string; quantityLabel?: string } = {}
): string | undefined {
  const cleaned = sanitizeItemNeeds(items);
  if (cleaned.length > MAX_ITEM_ROWS) return `You can list up to ${MAX_ITEM_ROWS} ${noun}s.`;
  if (cleaned.some((item) => !item.name)) return `Give each ${noun} a name, or remove the empty row.`;
  if (cleaned.some((item) => item.quantity < 1 || item.quantity > ITEM_QUANTITY_MAX)) {
    return `Each ${noun} needs ${quantityLabel} between 1 and ${ITEM_QUANTITY_MAX.toLocaleString()}.`;
  }
  const names = cleaned.map((item) => item.name.toLowerCase());
  if (new Set(names).size !== names.length) return `Each ${noun} should only be listed once. Combine duplicates into one row.`;
  return undefined;
}

/**
 * Keeps only pledges that match an item the project still asks for, with quantities
 * clamped to what is needed. Guards against stale drafts after a project's needs change.
 */
export function sanitizeItemContributions(contributions: ItemContribution[] = [], itemsNeeded: ItemNeed[] = []): ItemContribution[] {
  return contributions.flatMap((contribution) => {
    const need = itemsNeeded.find((item) => item.name === contribution.name);
    if (!need) return [];
    const quantity = Math.min(Math.trunc(Number(contribution.quantity)) || 0, need.quantity);
    return quantity >= 1 ? [{ name: need.name, quantity }] : [];
  });
}
