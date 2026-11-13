import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, HandHeart, MapPin, Package, Plus, Send, Trash2, UsersRound } from "lucide-react";
import type { ItemNeed, location } from "../../interface/interfaces";
import { interestCategories } from "../../components/interest";
import LocationSelect from "../../components/form/LocationSelect";
import DropdownSelect from "../../components/form/DropdownSelect";
import { ItemNeedsEditor } from "../../components/form/ItemNeedsEditor";
import { ITEM_NAME_MAX, MAX_ITEM_ROWS, parseQuantity, sanitizeItemNeeds, validateItemNeeds } from "../../utils/items";

type InitiativeFields = {
  title: string;
  description: string;
  category: string;
  location: location;
  startDate: string;
  endDate: string;
  expectedSupporters: string;
  coverImage: string;
  sdg: string;
  plannedApproach: string;
  beneficiaries: string;
  motivation: string;
  serviceNeeds: ServiceNeed[];
  itemNeeds: ItemNeed[];
};

// A skill or service the initiative needs, and how many people should provide it
type ServiceNeed = { name: string; quantity: number };
type InitiativeErrors = Partial<Record<keyof InitiativeFields | "location" | "supportNeeds", string>>;

const inputClassName = "w-full rounded-md border border-[#C3C6D4] bg-white px-3.5 py-3 text-sm text-[#323338] outline-none transition focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15";
const labelClassName = "mb-1.5 block text-sm font-medium text-[#323338]";

const emptyInitiative: InitiativeFields = {
  title: "",
  description: "",
  category: "",
  location: { state: "", lga: "" },
  startDate: "",
  endDate: "",
  expectedSupporters: "",
  coverImage: "",
  sdg: "",
  plannedApproach: "",
  beneficiaries: "",
  motivation: "",
  serviceNeeds: [],
  itemNeeds: [],
};

// Drafts survive closing the modal or a refresh, so a long form is never lost by accident
const DRAFT_KEY = "initiative_draft";

const loadDraft = (): InitiativeFields => {
  try {
    const data = sessionStorage.getItem(DRAFT_KEY);
    if (!data) return emptyInitiative;
    const draft = JSON.parse(data) as Partial<InitiativeFields>;
    // Merge over defaults so older drafts still load; older drafts stored quantities as strings
    return {
      ...emptyInitiative,
      ...draft,
      serviceNeeds: (draft.serviceNeeds ?? []).map((need) => ({ ...need, quantity: Number(need.quantity) || 0 })),
      itemNeeds: (draft.itemNeeds ?? []).map((need) => ({ ...need, quantity: Number(need.quantity) || 0 })),
    };
  } catch {
    return emptyInitiative;
  }
};

export const InitiativeForm: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const [form, setForm] = useState<InitiativeFields>(loadDraft);
  const [errors, setErrors] = useState<InitiativeErrors>({});
  const [notice, setNotice] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // Storage can be unavailable (e.g. private mode); the form still works without drafts
    }
  }, [form]);

  const handleLocationChange = useCallback((nextLocation: location) => {
    setForm((current) => ({ ...current, location: nextLocation }));
    setErrors((current) => ({ ...current, location: "" }));
  }, []);

  const updateField = <Key extends keyof InitiativeFields>(key: Key, value: InitiativeFields[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setNotice("");
  };

  const updateSupportNeeds = <Key extends "serviceNeeds" | "itemNeeds">(key: Key, value: InitiativeFields[Key]) => {
    updateField(key, value);
    setErrors((current) => ({ ...current, supportNeeds: "" }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: InitiativeErrors = {};

    if (!form.title.trim()) nextErrors.title = "Add a title for your initiative.";
    if (!form.description.trim()) nextErrors.description = "Tell people what this initiative is about.";
    if (!form.category) nextErrors.category = "Choose the cause that best fits.";
    if (!form.location.state || !form.location.lga) nextErrors.location = "Choose a state and LGA.";
    if (!form.startDate) nextErrors.startDate = "Choose a start date.";
    if (!form.endDate) nextErrors.endDate = "Choose an end date.";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      nextErrors.endDate = "The end date must be on or after the start date.";
    }
    if (!form.expectedSupporters || Number(form.expectedSupporters) < 1) {
      nextErrors.expectedSupporters = "Enter a target of at least one person.";
    }
    if (!form.sdg) nextErrors.sdg = "Choose the Sustainable Development Goal that best fits.";
    if (!form.plannedApproach.trim()) nextErrors.plannedApproach = "Explain how you plan to carry this out.";
    if (!form.beneficiaries.trim()) nextErrors.beneficiaries = "Say who this initiative is for.";
    if (!form.motivation.trim()) nextErrors.motivation = "Tell people why this matters to you.";
    // Services and items are both optional individually, but an initiative must ask for at least one of them.
    // Services share the item rules (name, quantity, no duplicates); "quantity" is the number of people.
    const serviceError = validateItemNeeds(form.serviceNeeds, { noun: "service", quantityLabel: "a number of people" });
    if (serviceError) nextErrors.serviceNeeds = serviceError;
    const itemError = validateItemNeeds(form.itemNeeds);
    if (itemError) nextErrors.itemNeeds = itemError;
    if (!serviceError && !itemError && sanitizeItemNeeds(form.serviceNeeds).length + sanitizeItemNeeds(form.itemNeeds).length === 0) {
      nextErrors.supportNeeds = "Add at least one skill/service or item you need.";
    }
    // if (!form.coverImage) nextErrors.coverImage = "Add a cover image for your initiative.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setNotice("Please complete the required fields to continue.");
      // Take the user straight to the first field that needs attention
      requestAnimationFrame(() => {
        const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
        firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid?.focus({ preventScroll: true });
      });
      return;
    }

    setNotice("Initiative details are complete and ready for publishing by a verified individual.");
  };

  const categories = interestCategories.map(({ title }) => title.replace(/^CHealth/, "Health"));
  const sdgGoals = [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals",
  ];

  return (
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="min-h-0 flex-1 overflow-y-auto">
          <section className="border-b border-[#E7EAEE] px-5 py-6 sm:px-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#323338]">Basic information</h2>
              <p className="mt-1 text-sm text-[#676879]">Give your initiative a clear identity.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClassName} htmlFor="initiative-title">Initiative title <span className="text-[#1A73E8]">*</span></label>
                <input
                  id="initiative-title"
                  className={inputClassName}
                  placeholder="e.g. Books for Every Child"
                  value={form.title}
                  maxLength={100}
                  onChange={(event) => updateField("title", event.target.value)}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? "initiative-title-error" : undefined}
                />
                {errors.title && <p id="initiative-title-error" className="mt-1 text-xs text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className={labelClassName} htmlFor="initiative-description">Description <span className="text-[#1A73E8]">*</span></label>
                <textarea
                  id="initiative-description"
                  className={`${inputClassName} min-h-32 resize-y`}
                  placeholder="What are you working to change, and what will supporters help you do?"
                  value={form.description}
                  maxLength={2000}
                  onChange={(event) => updateField("description", event.target.value)}
                  aria-invalid={Boolean(errors.description)}
                />
                <div className="mt-1 flex items-start justify-between gap-3">
                  {errors.description
                    ? <p className="text-xs text-red-600">{errors.description}</p>
                    : <span className="text-xs text-[#8A8D98]">A specific goal helps people decide how to get involved.</span>}
                  <span className="shrink-0 text-xs text-[#8A8D98]">{form.description.length}/2000</span>
                </div>
              </div>

              <div>
                <label className={labelClassName} htmlFor="initiative-category">Cause / category <span className="text-[#1A73E8]">*</span></label>
                <DropdownSelect
                  id="initiative-category"
                  className={`${inputClassName} min-h-11`}
                  value={form.category}
                  options={categories}
                  placeholder="Choose a cause"
                  onChange={(value) => updateField("category", value)}
                  invalid={Boolean(errors.category)}
                />
                {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
              </div>
            </div>
          </section>

          <section className="border-b border-[#E7EAEE] px-5 py-6 sm:px-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF2FE] text-[#1A73E8]"><MapPin size={18} /></span>
              <div>
                <h2 className="text-lg font-semibold text-[#323338]">When and where</h2>
                <p className="text-sm text-[#676879]">Set the initiative’s location and timeline.</p>
              </div>
            </div>

            <div className="mb-5">
              <p className={labelClassName}>Location <span className="text-[#1A73E8]">*</span></p>
              <LocationSelect onChange={handleLocationChange} state={form.location.state} lga={form.location.lga} mobileFriendly />
              {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName} htmlFor="initiative-start-date"><CalendarDays className="mr-1 inline-block text-[#1A73E8]" size={15} /> Start date <span className="text-[#1A73E8]">*</span></label>
                <input id="initiative-start-date" type="date" className={inputClassName} value={form.startDate} onChange={(event) => updateField("startDate", event.target.value)} aria-invalid={Boolean(errors.startDate)} />
                {errors.startDate && <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>}
              </div>
              <div>
                <label className={labelClassName} htmlFor="initiative-end-date"><CalendarDays className="mr-1 inline-block text-[#1A73E8]" size={15} /> End date <span className="text-[#1A73E8]">*</span></label>
                <input id="initiative-end-date" type="date" min={form.startDate || undefined} className={inputClassName} value={form.endDate} onChange={(event) => updateField("endDate", event.target.value)} aria-invalid={Boolean(errors.endDate)} />
                {errors.endDate && <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>}
              </div>
            </div>
          </section>

          <section className="border-b border-[#E7EAEE] px-5 py-6 sm:px-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#323338]">About the initiative</h2>
              <p className="mt-1 text-sm text-[#676879]">Choose the Sustainable Development Goal that best describes your initiative.</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className={labelClassName} htmlFor="initiative-sdg">Which Sustainable Development Goal does your initiative address? <span className="text-[#1A73E8]">*</span></label>
                <DropdownSelect id="initiative-sdg" className={`${inputClassName} min-h-11`} value={form.sdg} options={sdgGoals} placeholder="Choose an SDG" onChange={(value) => updateField("sdg", value)} invalid={Boolean(errors.sdg)} />
                {errors.sdg && <p className="mt-1 text-xs text-red-600">{errors.sdg}</p>}
              </div>
              <div>
                <label className={labelClassName} htmlFor="initiative-approach">How do you plan to carry it out? <span className="text-[#1A73E8]">*</span></label>
                <textarea id="initiative-approach" className={`${inputClassName} min-h-24 resize-y`} value={form.plannedApproach} onChange={(event) => updateField("plannedApproach", event.target.value)} aria-invalid={Boolean(errors.plannedApproach)} />
                {errors.plannedApproach && <p className="mt-1 text-xs text-red-600">{errors.plannedApproach}</p>}
              </div>
              <div>
                <label className={labelClassName} htmlFor="initiative-beneficiaries">Who is this initiative for? <span className="text-[#1A73E8]">*</span></label>
                <textarea id="initiative-beneficiaries" className={`${inputClassName} min-h-20 resize-y`} value={form.beneficiaries} onChange={(event) => updateField("beneficiaries", event.target.value)} aria-invalid={Boolean(errors.beneficiaries)} />
                {errors.beneficiaries && <p className="mt-1 text-xs text-red-600">{errors.beneficiaries}</p>}
              </div>
              <div>
                <label className={labelClassName} htmlFor="initiative-motivation">Why are you doing this? <span className="text-[#1A73E8]">*</span></label>
                <textarea id="initiative-motivation" className={`${inputClassName} min-h-20 resize-y`} value={form.motivation} onChange={(event) => updateField("motivation", event.target.value)} aria-invalid={Boolean(errors.motivation)} />
                {errors.motivation && <p className="mt-1 text-xs text-red-600">{errors.motivation}</p>}
              </div>
            </div>
          </section>

          <section className="border-b border-[#E7EAEE] px-5 py-6 sm:px-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#323338]">What support do you need? <span className="text-[#1A73E8]">*</span></h2>
              <p className="mt-1 text-sm text-[#676879]">Add the skills, services and items your initiative needs. Fill in either or both. Monetary donations aren’t supported.</p>
              {errors.supportNeeds && <p role="alert" className="mt-2 text-xs text-red-600">{errors.supportNeeds}</p>}
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF2FE] text-[#1A73E8]"><HandHeart size={18} /></span>
                <div><h3 className="font-semibold">Skills and services</h3><p className="text-xs text-[#676879]">Time or expertise people can give, and how many people you need for each.</p></div>
              </div>
              {form.serviceNeeds.length === 0 && (
                <p className="rounded-md border border-dashed border-[#C3C6D4] px-4 py-3 text-sm text-[#8A8D98]">No skills or services added yet.</p>
              )}
              {form.serviceNeeds.map((need, index) => (
                <div key={index} className="mb-3 grid grid-cols-[1fr_6.5rem_auto] gap-2 border border-[#E7EAEE] p-3 sm:grid-cols-[1fr_8rem_auto]">
                  <label className="sr-only" htmlFor={`service-name-${index}`}>Service or skill</label>
                  <input id={`service-name-${index}`} className={inputClassName} placeholder="e.g. Graphic design" value={need.name} maxLength={ITEM_NAME_MAX} aria-invalid={Boolean(errors.serviceNeeds) && !need.name.trim()} onChange={(event) => updateSupportNeeds("serviceNeeds", form.serviceNeeds.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} />
                  <label className="sr-only" htmlFor={`service-quantity-${index}`}>Number of people needed</label>
                  <input id={`service-quantity-${index}`} type="text" inputMode="numeric" className={inputClassName} placeholder="People" value={need.quantity || ""} aria-invalid={Boolean(errors.serviceNeeds) && !need.quantity} onChange={(event) => updateSupportNeeds("serviceNeeds", form.serviceNeeds.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: parseQuantity(event.target.value) } : item))} />
                  <button type="button" aria-label={`Remove ${need.name.trim() || `service ${index + 1}`}`} onClick={() => updateSupportNeeds("serviceNeeds", form.serviceNeeds.filter((_, itemIndex) => itemIndex !== index))} className="flex h-11 w-11 items-center justify-center text-[#676879] hover:text-red-600"><Trash2 size={17} /></button>
                </div>
              ))}
              {errors.serviceNeeds && <p role="alert" className="mb-2 text-xs text-red-600">{errors.serviceNeeds}</p>}
              <button type="button" disabled={form.serviceNeeds.length >= MAX_ITEM_ROWS} onClick={() => updateSupportNeeds("serviceNeeds", [...form.serviceNeeds, { name: "", quantity: 0 }])} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#1A73E8] disabled:cursor-not-allowed disabled:opacity-50"><Plus size={16} /> Add skill or service</button>
            </div>

            <div className="mt-6 border-t border-[#E7EAEE] pt-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF4E5] text-[#B86705]"><Package size={18} /></span>
                <div><h3 className="font-semibold">Physical items</h3><p className="text-xs text-[#676879]">Supplies or materials people can donate, and the quantity required.</p></div>
              </div>
              <ItemNeedsEditor
                idPrefix="initiative-item"
                items={form.itemNeeds}
                error={errors.itemNeeds}
                inputClassName={inputClassName}
                accentClassName="text-[#1A73E8]"
                onChange={(itemNeeds) => updateSupportNeeds("itemNeeds", itemNeeds)}
              />
            </div>
          </section>

          <section className="px-5 py-6 sm:px-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#323338]">Support and cover</h2>
              <p className="mt-1 text-sm text-[#676879]">Set a people target and choose an image that represents your cause.</p>
            </div>

            <div className="mb-6">
              <label className={labelClassName} htmlFor="initiative-supporters"><UsersRound className="mr-1 inline-block text-[#1A73E8]" size={15} /> Expected volunteers / supporters <span className="text-[#1A73E8]">*</span></label>
              <div className="relative max-w-xs">
                <input
                  id="initiative-supporters"
                  type="number"
                  min="1"
                  step="1"
                  className={`${inputClassName} pr-24`}
                  placeholder="e.g. 25"
                  value={form.expectedSupporters}
                  onChange={(event) => updateField("expectedSupporters", event.target.value)}
                  aria-invalid={Boolean(errors.expectedSupporters)}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-[#8A8D98]">people</span>
              </div>
              {errors.expectedSupporters && <p className="mt-1 text-xs text-red-600">{errors.expectedSupporters}</p>}
            </div>

            {/* <div>
              <p className={labelClassName}>Initiative cover <span className="text-[#1A73E8]">*</span></p>
              <div className="flex flex-col gap-4 rounded-lg border border-dashed border-[#C3C6D4] bg-[#F8FAFC] p-4 sm:flex-row sm:items-center">
                {form.coverImage ? (
                  <img src={form.coverImage} alt="Initiative cover preview" className="h-28 w-full rounded-md object-cover sm:w-44" />
                ) : (
                  <div className="flex h-28 w-full items-center justify-center rounded-md bg-[#EAF2FE] text-[#1A73E8] sm:w-44">
                    <ImagePlus size={30} strokeWidth={1.6} />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#323338]">{form.coverImage ? "Cover image added" : "Add a cover image"}</p>
                  <p className="mb-3 mt-1 text-xs leading-5 text-[#676879]">Use a clear image that helps people recognise your initiative. JPG, PNG or WEBP, up to 2 MB.</p>
                  <CloudinaryUpload
                    folder="individual-initiatives"
                    buttonText={form.coverImage ? "Change image" : "Upload image"}
                    onUploadSuccess={(url) => updateField("coverImage", url)}
                    className="border border-[#1A73E8] bg-white text-[#1A73E8] hover:bg-[#EAF2FE]"
                  />
                </div>
              </div>
              {errors.coverImage && <p className="mt-1 text-xs text-red-600">{errors.coverImage}</p>}
            </div> */}
          </section>
          </div>

          {/* Pinned footer keeps the actions reachable however far the user has scrolled */}
          <footer className="shrink-0 border-t border-[#E7EAEE] bg-[#FAFCFD] px-5 py-4 sm:px-8">
            {notice && <p role="status" className={`mb-3 rounded-md px-3 py-2 text-sm ${Object.values(errors).some(Boolean) ? "bg-red-50 text-red-700" : "bg-[#E7F4EA] text-[#287D3C]"}`}>{notice}</p>}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={onCancel} className="rounded-md border border-[#C3C6D4] bg-white px-4 py-2.5 text-sm font-semibold text-[#323338] transition hover:bg-[#F8FAFC]">
                Cancel
              </button>
              <button type="submit" className="flex items-center justify-center gap-2 rounded-md bg-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#155FC0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/40">
                <Send size={16} /> Submit
              </button>
            </div>
          </footer>
        </form>
  );
};