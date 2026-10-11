import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type DropdownSelectProps = {
  id?: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
  invalid?: boolean;
  disabled?: boolean;
};

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  id,
  value,
  options,
  placeholder,
  onChange,
  className = "",
  invalid = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const listId = `dropdown-options-${generatedId}`;
  const filteredOptions = options.filter((option) =>
    option.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  );

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const selectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full min-w-0 max-w-full">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        onClick={() => setIsOpen((open) => !open)}
        className={`${className} flex w-full min-w-0 max-w-full items-center justify-between gap-3 text-left ${
          invalid ? "border-red-500" : ""
        } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500`}
      >
        <span className={value ? "min-w-0 truncate" : "min-w-0 truncate text-[#8A8D98]"}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1 flex w-full min-w-0 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-md border border-[#DDE3E8] bg-white p-1 shadow-lg"
          style={{ maxHeight: "min(18rem, 40dvh)" }}
        >
          <input
            type="search"
            aria-label={`Search ${placeholder.toLowerCase()}`}
            placeholder="Search options"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mb-1 w-full shrink-0 rounded border border-[#E7EAEE] px-3 py-2 text-sm text-[#323338] outline-none focus:border-[#1A73E8]"
          />
          <div id={listId} role="listbox" aria-label={placeholder} className="min-h-0 overflow-y-auto overscroll-contain">
            {filteredOptions.length > 0 ? filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={value === option}
                onClick={() => selectOption(option)}
                className="flex min-h-10 w-full items-start gap-2 rounded px-3 py-2 text-left text-sm text-[#323338] hover:bg-[#F3F7FC] focus:bg-[#F3F7FC] focus:outline-none"
              >
                <span className="min-w-0 flex-1 whitespace-normal break-words">{option}</span>
                {value === option && <Check size={16} className="mt-0.5 shrink-0 text-[#1A73E8]" />}
              </button>
            )) : (
              <p className="px-3 py-2 text-sm text-[#676879]">No matching options</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;