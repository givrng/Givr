import { PackageOpen, Plus, Trash2 } from "lucide-react";
import type { ItemNeed } from "../../interface/interfaces";
import { ITEM_DESCRIPTION_MAX, ITEM_NAME_MAX, MAX_ITEM_ROWS, parseQuantity } from "../../utils/items";

interface ItemNeedsEditorProps {
  items: ItemNeed[];
  onChange: (items: ItemNeed[]) => void;
  /** Prefix for element ids, so two editors on one page never collide */
  idPrefix: string;
  error?: string;
  inputClassName?: string;
  accentClassName?: string;
}

const defaultInputClassName = "w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15";

/**
 * Editable list of physical items being requested (name, quantity, optional details).
 * Shared by organization projects and individual initiatives.
 */
export const ItemNeedsEditor: React.FC<ItemNeedsEditorProps> = ({
  items,
  onChange,
  idPrefix,
  error,
  inputClassName = defaultInputClassName,
  accentClassName = "text-blue-600",
}) => {
  const updateItem = (index: number, patch: Partial<ItemNeed>) =>
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));

  const canAddMore = items.length < MAX_ITEM_ROWS;

  return (
    <div>
      {items.length === 0 && (
        <div className="flex items-center gap-3 rounded-md border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          <PackageOpen size={18} className="shrink-0 text-gray-400" />
          No items requested yet. Add any supplies or materials people can contribute.
        </div>
      )}

      {items.map((item, index) => (
        <div key={index} className="mb-3 grid grid-cols-[1fr_6.5rem_auto] gap-2 rounded-md border border-gray-200 p-3 sm:grid-cols-[1fr_8rem_auto]">
          <label className="sr-only" htmlFor={`${idPrefix}-name-${index}`}>Item name</label>
          <input
            id={`${idPrefix}-name-${index}`}
            className={inputClassName}
            placeholder="e.g. School bags"
            value={item.name}
            maxLength={ITEM_NAME_MAX}
            onChange={(event) => updateItem(index, { name: event.target.value })}
            aria-invalid={Boolean(error) && !item.name.trim()}
          />
          <label className="sr-only" htmlFor={`${idPrefix}-quantity-${index}`}>Quantity needed</label>
          <input
            id={`${idPrefix}-quantity-${index}`}
            type="text"
            inputMode="numeric"
            className={inputClassName}
            placeholder="Qty"
            value={item.quantity || ""}
            onChange={(event) => updateItem(index, { quantity: parseQuantity(event.target.value) })}
            aria-invalid={Boolean(error) && !item.quantity}
          />
          <button
            type="button"
            aria-label={`Remove ${item.name.trim() || `item ${index + 1}`}`}
            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            className="flex h-10 w-10 items-center justify-center self-center rounded-md text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={17} />
          </button>
          <label className="sr-only" htmlFor={`${idPrefix}-description-${index}`}>Item details</label>
          <input
            id={`${idPrefix}-description-${index}`}
            className={`${inputClassName} col-span-2`}
            placeholder="Optional details, e.g. size, condition or brand"
            value={item.description ?? ""}
            maxLength={ITEM_DESCRIPTION_MAX}
            onChange={(event) => updateItem(index, { description: event.target.value })}
          />
        </div>
      ))}

      {error && <p role="alert" className="mb-2 text-xs text-red-600">{error}</p>}

      <button
        type="button"
        disabled={!canAddMore}
        onClick={() => onChange([...items, { name: "", quantity: 0, description: "" }])}
        className={`mt-1 inline-flex items-center gap-1 text-sm font-semibold ${accentClassName} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <Plus size={16} /> {canAddMore ? "Add item" : `Maximum of ${MAX_ITEM_ROWS} items`}
      </button>
    </div>
  );
};

/** Read-only chips such as "School bags × 20", for showing requested or pledged items */
export const ItemChips: React.FC<{ items?: { name: string; quantity: number }[]; className?: string }> = ({ items, className = "bg-amber-50 text-amber-800" }) => {
  if (!items?.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item.name} className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>
          {item.name} <span className="opacity-70">× {item.quantity.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
};
