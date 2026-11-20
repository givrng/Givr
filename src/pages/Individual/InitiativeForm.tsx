import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { CalendarDays, Clock, Film, HandHeart, ImagePlus, Loader2, MapPin, Package, Plus, Send, Trash2, UsersRound, X } from "lucide-react";
import type { location } from "../../interface/interfaces";
import { interestCategories } from "../../components/interest";
import LocationSelect from "../../components/form/LocationSelect";
import DropdownSelect from "../../components/form/DropdownSelect";
import { ItemNeedsEditor } from "../../components/form/ItemNeedsEditor";
import { CloudinaryUpload } from "../../components/CloudinaryWidget";
import useAuthFetch from "../../components/hooks/useAuthFetch";
import { ITEM_NAME_MAX, ITEM_QUANTITY_MAX, MAX_ITEM_ROWS, parseQuantity, sanitizeItemNeeds, validateItemNeeds } from "../../utils/items";

/**
 * Create-initiative form, mapped onto the backend's InitiativeRequestDto (POST /individual/initiative).
 * Initiatives are created as drafts and published from the initiatives page, mirroring organization projects.
 */

// A skill/service or physical item the initiative needs; `quantity` is people for services
type ResourceNeed = { name: string; quantity: number };

type InitiativeFields = {
  title: string;
  description: string;
  category: string;
  location: location;
  address: string;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  attendanceFrom: string;
  attendanceTo: string;
  maxVolunteers: number;
  requiredSkills: string[];
  specialRequirements: string;
  serviceNeeds: ResourceNeed[];
  itemNeeds: ResourceNeed[];
  videoUrl: string;
  flierUrl: string;
};

type InitiativeErrors = Partial<Record<keyof InitiativeFields | "supportNeeds", string>>;

const inputClassName = "w-full rounded-md border border-[#C3C6D4] bg-white px-3.5 py-3 text-sm text-[#323338] outline-none transition focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15";
const labelClassName = "mb-1.5 block text-sm font-medium text-[#323338]";
const sectionClassName = "border-b border-[#E7EAEE] px-5 py-6 sm:px-8";
const MAX_SKILLS = 10;
const SKILL_MAX_LENGTH = 40;
const VIDEO_MAX_MB = 50;

const emptyInitiative: InitiativeFields = {
  title: "",
  description: "",
  category: "",
  location: { state: "", lga: "" },
  address: "",
  startDate: "",
  endDate: "",
  applicationDeadline: "",
  attendanceFrom: "",
  attendanceTo: "",
  maxVolunteers: 0,
  requiredSkills: [],
  specialRequirements: "",
  serviceNeeds: [],
  itemNeeds: [],
  videoUrl: "",
  flierUrl: "",
};

// Drafts survive closing the modal or a refresh, so a long form is never lost by accident.
// v2: the form now matches the backend contract; older drafts used a different shape.
const DRAFT_KEY = "initiative_draft_v2";

const loadDraft = (): InitiativeFields => {
  try {
    const data = sessionStorage.getItem(DRAFT_KEY);
    return data ? { ...emptyInitiative, ...(JSON.parse(data) as Partial<InitiativeFields>) } : emptyInitiative;
  } catch {
    return emptyInitiative;
  }
};

const todayISO = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

const toResources = (needs: ResourceNeed[]) =>
  sanitizeItemNeeds(needs).map(({ name, quantity }) => ({ resource: name, quantity }));

const validate = (form: InitiativeFields): InitiativeErrors => {
  const errors: InitiativeErrors = {};
  const today = todayISO();

  if (!form.title.trim()) errors.title = "Add a title for your initiative.";
  if (!form.description.trim()) errors.description = "Tell people what this initiative is about.";
  if (!form.category) errors.category = "Choose the cause that best fits.";
  if (!form.location.state || !form.location.lga) errors.location = "Choose a state and LGA.";
  if (!form.address.trim()) errors.address = "Add the address where people should go.";

  if (!form.startDate) errors.startDate = "Choose a start date.";
  else if (form.startDate < today) errors.startDate = "The start date can't be in the past.";
  if (!form.endDate) errors.endDate = "Choose an end date.";
  else if (form.startDate && form.endDate < form.startDate) errors.endDate = "The end date must be on or after the start date.";
  if (!form.applicationDeadline) errors.applicationDeadline = "Choose when applications close.";
  else if (form.applicationDeadline < today) errors.applicationDeadline = "The deadline can't be in the past.";
  else if (form.startDate && form.applicationDeadline > form.startDate) errors.applicationDeadline = "Applications should close on or before the start date.";

  if (!form.attendanceFrom || !form.attendanceTo) errors.attendanceFrom = "Set the daily start and finish times.";
  else if (form.attendanceTo <= form.attendanceFrom) errors.attendanceFrom = "The finish time must be after the start time.";

  if (form.maxVolunteers < 1) errors.maxVolunteers = "Enter how many volunteers you can take (at least 1).";

  const serviceError = validateItemNeeds(form.serviceNeeds, { noun: "service", quantityLabel: "a number of people" });
  if (serviceError) errors.serviceNeeds = serviceError;
  const itemError = validateItemNeeds(form.itemNeeds);
  if (itemError) errors.itemNeeds = itemError;
  if (!serviceError && !itemError && toResources(form.serviceNeeds).length + toResources(form.itemNeeds).length === 0) {
    errors.supportNeeds = "Add at least one skill/service or item you need.";
  }

  if (!form.videoUrl) errors.videoUrl = "Add a short video introducing your initiative.";
  return errors;
};

interface InitiativeFormProps {
  onCancel: () => void;
  onCreated: () => void;
  /** False until the individual is identity-verified; the backend rejects creation before then */
  canSubmit: boolean;
  onVerify: () => void;
}

export const InitiativeForm: React.FC<InitiativeFormProps> = ({ onCancel, onCreated, canSubmit, onVerify }) => {
  const [form, setForm] = useState<InitiativeFields>(loadDraft);
  const [errors, setErrors] = useState<InitiativeErrors>({});
  const [notice, setNotice] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { API } = useAuthFetch("individual");

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

  const updateSupportNeeds = (key: "serviceNeeds" | "itemNeeds", value: ResourceNeed[]) => {
    updateField(key, value);
    setErrors((current) => ({ ...current, supportNeeds: "" }));
  };

  const addSkill = () => {
    const skill = skillInput.trim().slice(0, SKILL_MAX_LENGTH);
    if (skill && form.requiredSkills.length < MAX_SKILLS && !form.requiredSkills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      updateField("requiredSkills", [...form.requiredSkills, skill]);
    }
    setSkillInput("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setNotice("Please complete the highlighted fields to continue.");
      // Take the user straight to the first field that needs attention
      requestAnimationFrame(() => {
        const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
        firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid?.focus({ preventScroll: true });
      });
      return;
    }
    if (!canSubmit) return;

    setIsSubmitting(true);
    setNotice("");
    try {
      await API().post("/initiative", {
        title: form.title.trim(),
        description: form.description.trim(),
        categories: [form.category],
        maxVolunteers: form.maxVolunteers,
        location: form.location,
        address: form.address.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        applicationDeadline: form.applicationDeadline,
        attendanceHours: { from: form.attendanceFrom, to: form.attendanceTo },
        requiredSkills: form.requiredSkills,
        specialRequirements: form.specialRequirements.trim(),
        projectFlierUrl: form.flierUrl || undefined,
        status: "DRAFT",
        initiativeServiceList: toResources(form.serviceNeeds),
        initiativeItemList: toResources(form.itemNeeds),
        media: { mediaType: "Video", mediaUrl: form.videoUrl },
      });
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      onCreated();
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const message = axios.isAxiosError(error) ? (error.response?.data as { message?: unknown } | undefined)?.message : undefined;
      if (status === 403 || status === 404) setNotice("Your identity verification isn't complete yet, so this initiative can't be saved. Your draft is kept on this device.");
      else setNotice(typeof message === "string" ? message : "We couldn't save your initiative. Please check the details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = interestCategories.map(({ title }) => title.replace(/^CHealth/, "Health"));
  const fieldError = (key: keyof InitiativeErrors) => errors[key] && <p role="alert" className="mt-1 text-xs text-red-600">{errors[key]}</p>;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className={sectionClassName}>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#323338]">Basic information</h2>
            <p className="mt-1 text-sm text-[#676879]">Give your initiative a clear identity.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className={labelClassName} htmlFor="initiative-title">Initiative title <span className="text-[#1A73E8]">*</span></label>
              <input id="initiative-title" className={inputClassName} placeholder="e.g. Books for Every Child" value={form.title} maxLength={100} onChange={(event) => updateField("title", event.target.value)} aria-invalid={Boolean(errors.title)} />
              {fieldError("title")}
            </div>

            <div>
              <label className={labelClassName} htmlFor="initiative-description">Description <span className="text-[#1A73E8]">*</span></label>
              <textarea id="initiative-description" className={`${inputClassName} min-h-32 resize-y`} placeholder="What are you working to change, who is it for, and how will supporters help?" value={form.description} maxLength={2000} onChange={(event) => updateField("description", event.target.value)} aria-invalid={Boolean(errors.description)} />
              <div className="mt-1 flex items-start justify-between gap-3">
                {errors.description
                  ? <p role="alert" className="text-xs text-red-600">{errors.description}</p>
                  : <span className="text-xs text-[#8A8D98]">A specific goal helps people decide how to get involved.</span>}
                <span className="shrink-0 text-xs text-[#8A8D98]">{form.description.length}/2000</span>
              </div>
            </div>

            <div>
              <label className={labelClassName} htmlFor="initiative-category">Cause / category <span className="text-[#1A73E8]">*</span></label>
              <DropdownSelect id="initiative-category" className={`${inputClassName} min-h-11`} value={form.category} options={categories} placeholder="Choose a cause" onChange={(value) => updateField("category", value)} invalid={Boolean(errors.category)} />
              {fieldError("category")}
            </div>
          </div>
        </section>

        <section className={sectionClassName}>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF2FE] text-[#1A73E8]"><MapPin size={18} /></span>
            <div>
              <h2 className="text-lg font-semibold text-[#323338]">When and where</h2>
              <p className="text-sm text-[#676879]">Set the location, timeline and daily hours.</p>
            </div>
          </div>

          <div className="mb-5">
            <p className={labelClassName}>Location <span className="text-[#1A73E8]">*</span></p>
            <LocationSelect onChange={handleLocationChange} state={form.location.state} lga={form.location.lga} mobileFriendly />
            {fieldError("location")}
          </div>

          <div className="mb-5">
            <label className={labelClassName} htmlFor="initiative-address">Address <span className="text-[#1A73E8]">*</span></label>
            <input id="initiative-address" className={inputClassName} placeholder="Where should volunteers go?" value={form.address} maxLength={200} autoComplete="street-address" onChange={(event) => updateField("address", event.target.value)} aria-invalid={Boolean(errors.address)} />
            {fieldError("address")}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClassName} htmlFor="initiative-start-date"><CalendarDays className="mr-1 inline-block text-[#1A73E8]" size={15} /> Start date <span className="text-[#1A73E8]">*</span></label>
              <input id="initiative-start-date" type="date" min={todayISO()} className={inputClassName} value={form.startDate} onChange={(event) => updateField("startDate", event.target.value)} aria-invalid={Boolean(errors.startDate)} />
              {fieldError("startDate")}
            </div>
            <div>
              <label className={labelClassName} htmlFor="initiative-end-date"><CalendarDays className="mr-1 inline-block text-[#1A73E8]" size={15} /> End date <span className="text-[#1A73E8]">*</span></label>
              <input id="initiative-end-date" type="date" min={form.startDate || todayISO()} className={inputClassName} value={form.endDate} onChange={(event) => updateField("endDate", event.target.value)} aria-invalid={Boolean(errors.endDate)} />
              {fieldError("endDate")}
            </div>
            <div>
              <label className={labelClassName} htmlFor="initiative-deadline"><CalendarDays className="mr-1 inline-block text-[#1A73E8]" size={15} /> Applications close <span className="text-[#1A73E8]">*</span></label>
              <input id="initiative-deadline" type="date" min={todayISO()} max={form.startDate || undefined} className={inputClassName} value={form.applicationDeadline} onChange={(event) => updateField("applicationDeadline", event.target.value)} aria-invalid={Boolean(errors.applicationDeadline)} />
              {fieldError("applicationDeadline")}
            </div>
          </div>

          <div className="mt-5">
            <p className={labelClassName}><Clock className="mr-1 inline-block text-[#1A73E8]" size={15} /> Daily hours <span className="text-[#1A73E8]">*</span></p>
            <div className="flex max-w-sm items-center gap-2">
              <label className="sr-only" htmlFor="initiative-from">Start time</label>
              <input id="initiative-from" type="time" className={inputClassName} value={form.attendanceFrom} onChange={(event) => updateField("attendanceFrom", event.target.value)} aria-invalid={Boolean(errors.attendanceFrom)} />
              <span className="text-sm text-[#676879]">to</span>
              <label className="sr-only" htmlFor="initiative-to">Finish time</label>
              <input id="initiative-to" type="time" className={inputClassName} value={form.attendanceTo} onChange={(event) => { updateField("attendanceTo", event.target.value); setErrors((current) => ({ ...current, attendanceFrom: "" })); }} aria-invalid={Boolean(errors.attendanceFrom)} />
            </div>
            {fieldError("attendanceFrom")}
          </div>
        </section>

        <section className={sectionClassName}>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#323338]">What support do you need? <span className="text-[#1A73E8]">*</span></h2>
            <p className="mt-1 text-sm text-[#676879]">Add the skills, services and items your initiative needs. Fill in either or both. Monetary donations aren’t supported.</p>
            {errors.supportNeeds && <p role="alert" className="mt-2 text-xs text-red-600">{errors.supportNeeds}</p>}
          </div>

          <div className="mb-6 max-w-xs">
            <label className={labelClassName} htmlFor="initiative-max-volunteers"><UsersRound className="mr-1 inline-block text-[#1A73E8]" size={15} /> Maximum volunteers <span className="text-[#1A73E8]">*</span></label>
            <div className="relative">
              <input id="initiative-max-volunteers" type="text" inputMode="numeric" className={`${inputClassName} pr-20`} placeholder="e.g. 25" value={form.maxVolunteers || ""} onChange={(event) => updateField("maxVolunteers", parseQuantity(event.target.value, ITEM_QUANTITY_MAX))} aria-invalid={Boolean(errors.maxVolunteers)} />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-[#8A8D98]">people</span>
            </div>
            {fieldError("maxVolunteers")}
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
            {fieldError("serviceNeeds")}
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
              showDescription={false}
              onChange={(itemNeeds) => updateSupportNeeds("itemNeeds", itemNeeds)}
            />
          </div>

          <div className="mt-6 border-t border-[#E7EAEE] pt-5">
            <label className={labelClassName} htmlFor="initiative-skill">Skills volunteers should have <span className="font-normal text-[#8A8D98]">(optional)</span></label>
            <div className="flex max-w-md gap-2">
              <input id="initiative-skill" className={inputClassName} placeholder="e.g. First aid" value={skillInput} maxLength={SKILL_MAX_LENGTH} disabled={form.requiredSkills.length >= MAX_SKILLS} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addSkill(); } }} />
              <button type="button" onClick={addSkill} disabled={!skillInput.trim() || form.requiredSkills.length >= MAX_SKILLS} className="rounded-md border border-[#1A73E8] px-3 text-sm font-semibold text-[#1A73E8] hover:bg-[#EAF2FE] disabled:opacity-50">Add</button>
            </div>
            {form.requiredSkills.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {form.requiredSkills.map((skill) => (
                  <li key={skill} className="inline-flex items-center gap-1 rounded-full bg-[#EAF2FE] px-3 py-1 text-xs font-medium text-[#1A73E8]">
                    {skill}
                    <button type="button" aria-label={`Remove ${skill}`} onClick={() => updateField("requiredSkills", form.requiredSkills.filter((s) => s !== skill))} className="hover:text-red-600"><X size={12} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-5">
            <label className={labelClassName} htmlFor="initiative-requirements">Special requirements <span className="font-normal text-[#8A8D98]">(optional)</span></label>
            <textarea id="initiative-requirements" className={`${inputClassName} min-h-20 resize-y`} placeholder="Anything volunteers should bring, know or prepare" value={form.specialRequirements} maxLength={300} onChange={(event) => updateField("specialRequirements", event.target.value)} />
          </div>
        </section>

        <section className="px-5 py-6 sm:px-8">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#323338]">Video and flier</h2>
            <p className="mt-1 text-sm text-[#676879]">A short video helps volunteers trust you and understand the cause.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className={labelClassName}><Film className="mr-1 inline-block text-[#1A73E8]" size={15} /> Introduction video <span className="text-[#1A73E8]">*</span></p>
              <div className={`rounded-lg border border-dashed p-4 ${errors.videoUrl ? "border-red-400 bg-red-50/40" : "border-[#C3C6D4] bg-[#F8FAFC]"}`} aria-invalid={Boolean(errors.videoUrl)} tabIndex={errors.videoUrl ? -1 : undefined}>
                {form.videoUrl
                  ? <video src={form.videoUrl} controls preload="metadata" className="mb-3 aspect-video w-full rounded-md bg-black" />
                  : <div className="mb-3 flex aspect-video w-full items-center justify-center rounded-md bg-[#EAF2FE] text-[#1A73E8]"><Film size={30} strokeWidth={1.6} /></div>}
                <CloudinaryUpload role="volunteer" purpose="INITIATIVE_VIDEO" max_size_MB={VIDEO_MAX_MB} buttonText={form.videoUrl ? "Replace video" : "Upload video"} onUploadSuccess={(url) => updateField("videoUrl", url)} className="border border-[#1A73E8] bg-white text-[#1A73E8] hover:bg-[#EAF2FE]" />
                <p className="mt-2 text-xs text-[#8A8D98]">MP4, WEBM or MOV, up to {VIDEO_MAX_MB} MB.</p>
              </div>
              {fieldError("videoUrl")}
            </div>

            <div>
              <p className={labelClassName}><ImagePlus className="mr-1 inline-block text-[#1A73E8]" size={15} /> Flier <span className="font-normal text-[#8A8D98]">(optional)</span></p>
              <div className="rounded-lg border border-dashed border-[#C3C6D4] bg-[#F8FAFC] p-4">
                {form.flierUrl
                  ? <img src={form.flierUrl} alt="Initiative flier preview" className="mb-3 aspect-video w-full rounded-md object-cover" />
                  : <div className="mb-3 flex aspect-video w-full items-center justify-center rounded-md bg-[#EAF2FE] text-[#1A73E8]"><ImagePlus size={30} strokeWidth={1.6} /></div>}
                <div className="flex items-center gap-3">
                  <CloudinaryUpload role="volunteer" purpose="INITIATIVE_FLIER" max_size_MB={2} buttonText={form.flierUrl ? "Change flier" : "Upload flier"} onUploadSuccess={(url) => updateField("flierUrl", url)} className="border border-[#1A73E8] bg-white text-[#1A73E8] hover:bg-[#EAF2FE]" />
                  {form.flierUrl && <button type="button" onClick={() => updateField("flierUrl", "")} className="text-xs font-medium text-[#676879] hover:text-red-600">Remove</button>}
                </div>
                <p className="mt-2 text-xs text-[#8A8D98]">JPG, PNG or WEBP, up to 2 MB.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pinned footer keeps the actions reachable however far the user has scrolled */}
      <footer className="shrink-0 border-t border-[#E7EAEE] bg-[#FAFCFD] px-5 py-4 sm:px-8">
        {/* Success closes the modal, so any notice shown here is a problem to fix */}
        {notice && <p role="alert" className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{notice}</p>}
        {!canSubmit && (
          <p className="mb-3 rounded-md bg-[#FFF7DF] px-3 py-2 text-sm text-[#805B00]">
            You can prepare your initiative now, but you need to verify your identity before you can submit it.{" "}
            <button type="button" onClick={onVerify} className="font-semibold underline">Verify now</button>
          </p>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <p className="text-xs text-[#8A8D98] sm:mr-auto">Saved as a draft. Publish it from My initiatives when you're ready.</p>
          <button type="button" onClick={onCancel} className="rounded-md border border-[#C3C6D4] bg-white px-4 py-2.5 text-sm font-semibold text-[#323338] transition hover:bg-[#F8FAFC]">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || !canSubmit} className="flex items-center justify-center gap-2 rounded-md bg-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#155FC0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/40 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <><Send size={16} /> Submit</>}
          </button>
        </div>
      </footer>
    </form>
  );
};
