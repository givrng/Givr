import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin, Plus, Trash2, UsersRound } from "lucide-react";
import type { BasicNatigationProps, location } from "../../interface/interfaces";
import { interestCategories } from "../../components/interest";
import LocationSelect from "../../components/form/LocationSelect";
import DropdownSelect from "../../components/form/DropdownSelect";

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
  supportTypes: SupportType[];
  volunteersNeeded: string;
  serviceNeeds: ServiceNeed[];
  itemNeeds: ItemNeed[];
};

type SupportType = "volunteer" | "service" | "item";
type ServiceNeed = { name: string; quantity: string };
type ItemNeed = { name: string; quantity: string; description: string };
type InitiativeErrors = Partial<Record<keyof InitiativeFields | "location", string>>;

const inputClassName = "w-full rounded-md border border-[#C3C6D4] bg-white px-3.5 py-3 text-sm text-[#323338] outline-none transition focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15";
const labelClassName = "mb-1.5 block text-sm font-medium text-[#323338]";

export const IndividualSignup: React.FC<BasicNatigationProps> = () => {
  const routeLocation = useLocation();
  const initialDraft = (routeLocation.state as { initiative?: InitiativeFields } | null)?.initiative;
  const [form, setForm] = useState<InitiativeFields>(() => initialDraft ?? ({
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
    supportTypes: [],
    volunteersNeeded: "",
    serviceNeeds: [],
    itemNeeds: [],
  }));
  const [errors, setErrors] = useState<InitiativeErrors>({});
  const [notice, setNotice] = useState("");

  const handleLocationChange = useCallback((nextLocation: location) => {
    setForm((current) => ({ ...current, location: nextLocation }));
    setErrors((current) => ({ ...current, location: "" }));
  }, []);

  const updateField = <Key extends keyof InitiativeFields>(key: Key, value: InitiativeFields[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setNotice("");
  };

  const toggleSupportType = (supportType: SupportType) => {
    setForm((current) => ({
      ...current,
      supportTypes: current.supportTypes.includes(supportType)
        ? current.supportTypes.filter((item) => item !== supportType)
        : [...current.supportTypes, supportType],
    }));
    setNotice("");
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
    if (form.supportTypes.length === 0) nextErrors.supportTypes = "Choose at least one type of support.";
    if (form.supportTypes.includes("volunteer") && (!form.volunteersNeeded || Number(form.volunteersNeeded) < 1)) {
      nextErrors.volunteersNeeded = "Enter the number of volunteers needed.";
    }
    if (form.supportTypes.includes("service") && (!form.serviceNeeds.length || form.serviceNeeds.some((need) => !need.name.trim() || Number(need.quantity) < 1))) {
      nextErrors.serviceNeeds = "Add a service and the number of people needed for each.";
    }
    if (form.supportTypes.includes("item") && (!form.itemNeeds.length || form.itemNeeds.some((need) => !need.name.trim() || Number(need.quantity) < 1))) {
      nextErrors.itemNeeds = "Add an item and the quantity needed for each.";
    }
    // if (!form.coverImage) nextErrors.coverImage = "Add a cover image for your initiative.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setNotice("Please complete the required fields to continue.");
      return;
    }

    setNotice("");
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
    <div className="bg-[#F3FAFA] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-7 text-center sm:mb-9">
          <p className="mb-3 text-3xl font-bold text-blue-700">
            INDIVIDUAL INITIATIVE
          </p>
          
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#676879] sm:text-base">
            Share the initiative you want to lead and help people understand how they can support it.
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-[#DDE3E8] bg-white shadow-sm">
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
                <label className={labelClassName} font-bold text-lg htmlFor="initiative-sdg">Which Sustainable Development Goal does your initiative address? <span className="text-[#1A73E8]">*</span></label>
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
              <h2 className="text-lg font-semibold text-[#323338]">What support do you need?</h2>
              <p className="mt-1 text-sm text-[#676879]">Select one or more ways people can contribute. Monetary donations aren’t supported.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {([
                ["volunteer", "Volunteers", "People to participate directly"],
                ["service", "Skills / services", "Specific skills or professional help"],
                ["item", "Physical items", "Supplies or materials needed"],
              ] as const).map(([type, title, description]) => (
                <label key={type} className={`flex cursor-pointer items-start gap-3 border p-4 transition ${form.supportTypes.includes(type) ? "border-[#1A73E8] bg-[#EAF2FE]" : "border-[#DDE3E8] hover:border-[#9BBDEB]"}`}>
                  <input type="checkbox" className="mt-1 accent-[#1A73E8]" checked={form.supportTypes.includes(type)} onChange={() => toggleSupportType(type)} />
                  <span><span className="block text-sm font-semibold text-[#323338]">{title}</span><span className="mt-1 block text-xs leading-5 text-[#676879]">{description}</span></span>
                </label>
              ))}
            </div>
            {errors.supportTypes && <p className="mt-2 text-xs text-red-600">{errors.supportTypes}</p>}

            {form.supportTypes.includes("volunteer") && (
              <div className="mt-5 max-w-xs">
                <label className={labelClassName} htmlFor="volunteers-needed">Number of volunteers needed <span className="text-[#1A73E8]">*</span></label>
                <input id="volunteers-needed" type="number" min="1" className={inputClassName} value={form.volunteersNeeded} onChange={(event) => updateField("volunteersNeeded", event.target.value)} aria-invalid={Boolean(errors.volunteersNeeded)} />
                {errors.volunteersNeeded && <p className="mt-1 text-xs text-red-600">{errors.volunteersNeeded}</p>}
              </div>
            )}

            {form.supportTypes.includes("service") && (
              <div className="mt-6 border-t border-[#E7EAEE] pt-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div><h3 className="font-semibold">Skills and services</h3><p className="text-xs text-[#676879]">Add each service and the number of contributors needed.</p></div>
                  <button type="button" onClick={() => updateField("serviceNeeds", [...form.serviceNeeds, { name: "", quantity: "" }])} className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A73E8]"><Plus size={16} /> Add service</button>
                </div>
                {form.serviceNeeds.map((need, index) => (
                  <div key={index} className="mb-3 grid grid-cols-1 gap-3 border border-[#E7EAEE] p-3 sm:grid-cols-[1fr_10rem_auto]">
                    <label className="sr-only" htmlFor={`service-name-${index}`}>Service or skill</label>
                    <input id={`service-name-${index}`} className={inputClassName} placeholder="e.g. Graphic design" value={need.name} onChange={(event) => updateField("serviceNeeds", form.serviceNeeds.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} />
                    <label className="sr-only" htmlFor={`service-quantity-${index}`}>Number of people needed</label>
                    <input id={`service-quantity-${index}`} type="number" min="1" className={inputClassName} placeholder="People needed" value={need.quantity} onChange={(event) => updateField("serviceNeeds", form.serviceNeeds.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: event.target.value } : item))} />
                    <button type="button" aria-label={`Remove service ${index + 1}`} onClick={() => updateField("serviceNeeds", form.serviceNeeds.filter((_, itemIndex) => itemIndex !== index))} className="flex h-11 w-11 items-center justify-center text-[#676879] hover:text-red-600"><Trash2 size={17} /></button>
                  </div>
                ))}
                {errors.serviceNeeds && <p className="text-xs text-red-600">{errors.serviceNeeds}</p>}
              </div>
            )}

            {form.supportTypes.includes("item") && (
              <div className="mt-6 border-t border-[#E7EAEE] pt-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div><h3 className="font-semibold">Physical items</h3><p className="text-xs text-[#676879]">List each item and the quantity required.</p></div>
                  <button type="button" onClick={() => updateField("itemNeeds", [...form.itemNeeds, { name: "", quantity: "", description: "" }])} className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A73E8]"><Plus size={16} /> Add item</button>
                </div>
                {form.itemNeeds.map((need, index) => (
                  <div key={index} className="mb-3 grid grid-cols-1 gap-3 border border-[#E7EAEE] p-3 sm:grid-cols-[1fr_10rem_auto]">
                    <label className="sr-only" htmlFor={`item-name-${index}`}>Item name</label>
                    <input id={`item-name-${index}`} className={inputClassName} placeholder="e.g. School bags" value={need.name} onChange={(event) => updateField("itemNeeds", form.itemNeeds.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} />
                    <label className="sr-only" htmlFor={`item-quantity-${index}`}>Quantity required</label>
                    <input id={`item-quantity-${index}`} type="number" min="1" className={inputClassName} placeholder="Quantity" value={need.quantity} onChange={(event) => updateField("itemNeeds", form.itemNeeds.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: event.target.value } : item))} />
                    <button type="button" aria-label={`Remove item ${index + 1}`} onClick={() => updateField("itemNeeds", form.itemNeeds.filter((_, itemIndex) => itemIndex !== index))} className="flex h-11 w-11 items-center justify-center text-[#676879] hover:text-red-600"><Trash2 size={17} /></button>
                    <label className="sr-only" htmlFor={`item-description-${index}`}>Item condition or details</label>
                    <input id={`item-description-${index}`} className={`${inputClassName} sm:col-span-2`} placeholder="Optional details or condition" value={need.description} onChange={(event) => updateField("itemNeeds", form.itemNeeds.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))} />
                  </div>
                ))}
                {errors.itemNeeds && <p className="text-xs text-red-600">{errors.itemNeeds}</p>}
              </div>
            )}
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

          <footer className="border-t border-[#E7EAEE] bg-[#FAFCFD] px-5 py-5 sm:px-8">
            {notice && <p role="status" className={`mb-4 rounded-md px-3 py-2 text-sm ${Object.keys(errors).length ? "bg-red-50 text-red-700" : "bg-[#E7F4EA] text-[#287D3C]"}`}>{notice}</p>}
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1A73E8] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#155FC0] focus:outline-none sm:ml-auto sm:w-auto">
              Sign Up <ArrowRight size={17} />
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};