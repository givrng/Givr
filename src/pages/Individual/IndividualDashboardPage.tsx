import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Clock3, CreditCard, Fingerprint, HandHeart, Inbox, LockKeyhole, Plus, ShieldCheck, Trash2, UserRound, UsersRound } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboardHeader";
import useAuthFetch from "../../components/hooks/useAuthFetch";
import { useConfirmAsk } from "../../components/hooks/useConfirm";
import { getVerificationState, VERIFY_IDENTITY_PATH } from "../../utils/verification";
import type { IndividualApplicationProps, IndividualDonationProps, IndividualDonationStatus, IndividualInitiativeProps, IndividualParticipationProps, PagedResponse, ParticipationStatus } from "../../interface/interfaces";

const tabs = ["Overview", "My initiatives", "Applications", "Participants", "Contributions"] as const;
type DashboardTab = typeof tabs[number];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown } | undefined;
    if (typeof data?.message === "string") return data.message;
    if (error.response?.status === 403) {
      return "Your account may need identity verification before this action is available.";
    }
  }
  return error instanceof Error ? error.message : fallback;
};

// /individual/* requires the INDIVIDUAL authority, which is granted once verification succeeds.
// Before that the backend answers 403 (or 404 for a missing individual record). That's an empty state, not an error.
const isMissingIndividualAccount = (error: unknown) =>
  axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 404);

// Statuses that can't have the INDIVIDUAL authority yet. For these we skip the /individual/* calls entirely,
// which avoids a burst of 403s and token refresh attempts. Any other status still loads and handles 403 as empty.
const NOT_YET_INDIVIDUAL = new Set<string | null>([null, "UNVERIFIED", "AUTOMATIC_VERIFICATION_FAILED"]);

const DELETABLE_STATUSES = new Set(["DRAFT", "OPEN"]);

export interface InitiativesOutletContext {
  verificationStatus: string | null;
  verificationLoaded: boolean;
  onInitiativeCreated: () => void;
}

const donationStatusLabel: Record<IndividualDonationStatus, string> = {
  Pending_acceptance: "Pending acceptance",
  Promised_Accepted: "Pledge accepted",
  Promise_Fulfilled: "Fulfilled",
  Promise_Rejected: "Rejected",
};

const formatDate = (dateValue: string) => {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString();
};

export const IndividualDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("Overview");
  const [initiatives, setInitiatives] = useState<IndividualInitiativeProps[]>([]);
  const [initiativeTotal, setInitiativeTotal] = useState(0);
  const [initiativePage, setInitiativePage] = useState(0);
  const [initiativeTotalPages, setInitiativeTotalPages] = useState(0);
  const [initiativesLoading, setInitiativesLoading] = useState(true);
  const [initiativesError, setInitiativesError] = useState("");
  const [donations, setDonations] = useState<IndividualDonationProps[]>([]);
  const [donationPage, setDonationPage] = useState(0);
  const [donationTotalPages, setDonationTotalPages] = useState(0);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [donationsError, setDonationsError] = useState("");
  const [applications, setApplications] = useState<IndividualApplicationProps[]>([]);
  const [applicationPage, setApplicationPage] = useState(0);
  const [applicationTotalPages, setApplicationTotalPages] = useState(0);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState("");
  const [participants, setParticipants] = useState<IndividualParticipationProps[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [participantsError, setParticipantsError] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState("");
  const [verificationLoaded, setVerificationLoaded] = useState(false);
  const [actionError, setActionError] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const navigate = useNavigate();
  const { confirmAsk, ConfirmDialog } = useConfirmAsk({ isOrg: false });

  const { API: createIndividualApi } = useAuthFetch("individual");
  const { API: createVolunteerApi } = useAuthFetch("volunteer");
  const individualApi = useMemo(() => createIndividualApi(), [createIndividualApi]);
  const volunteerApi = useMemo(() => createVolunteerApi(), [createVolunteerApi]);

  const loadInitiatives = useCallback(async (pageNum = 0) => {
    setInitiativesLoading(true);
    setInitiativesError("");
    try {
      const response = await individualApi.get<PagedResponse<IndividualInitiativeProps>>("/initiative", {
        params: { status: "ALL", pageNum, pageSize: 20 },
      });
      if (!Array.isArray(response.data?.content)) {
        throw new Error("The initiatives response was not in the expected format.");
      }
      setInitiatives(response.data.content);
      setInitiativeTotal(response.data.page?.totalElements ?? response.data.content.length);
      setInitiativePage(response.data.page?.number ?? pageNum);
      setInitiativeTotalPages(response.data.page?.totalPages ?? 0);
    } catch (error) {
      if (isMissingIndividualAccount(error)) { setInitiatives([]); setInitiativeTotal(0); setInitiativeTotalPages(0); return; }
      setInitiativesError(getErrorMessage(error, "Could not load your initiatives."));
    } finally {
      setInitiativesLoading(false);
    }
  }, [individualApi]);

  const loadDonations = useCallback(async (pageNum = 0) => {
    setDonationsLoading(true);
    setDonationsError("");
    try {
      const response = await individualApi.get<PagedResponse<IndividualDonationProps>>("/initiative/donations", {
        params: { pageNum, pageSize: 30 },
      });
      if (!Array.isArray(response.data?.content)) {
        throw new Error("The donations response was not in the expected format.");
      }
      setDonations(response.data.content);
      setDonationPage(response.data.page?.number ?? pageNum);
      setDonationTotalPages(response.data.page?.totalPages ?? 0);
    } catch (error) {
      if (isMissingIndividualAccount(error)) { setDonations([]); setDonationTotalPages(0); return; }
      setDonationsError(getErrorMessage(error, "Could not load donations to your initiatives."));
    } finally {
      setDonationsLoading(false);
    }
  }, [individualApi]);

  const loadApplications = useCallback(async (pageNum = 0) => {
    setApplicationsLoading(true);
    setApplicationsError("");
    try {
      const response = await individualApi.get<PagedResponse<IndividualApplicationProps>>("/initiative/applications", {
        params: { pageNum, pageSize: 30 },
      });
      if (!Array.isArray(response.data?.content)) {
        throw new Error("The applications response was not in the expected format.");
      }
      setApplications(response.data.content);
      setApplicationPage(response.data.page?.number ?? pageNum);
      setApplicationTotalPages(response.data.page?.totalPages ?? 0);
    } catch (error) {
      if (isMissingIndividualAccount(error)) { setApplications([]); setApplicationTotalPages(0); return; }
      setApplicationsError(getErrorMessage(error, "Could not load initiative applications."));
    } finally {
      setApplicationsLoading(false);
    }
  }, [individualApi]);

  const loadParticipants = useCallback(async () => {
    setParticipantsLoading(true);
    setParticipantsError("");
    try {
      const response = await individualApi.get<IndividualParticipationProps[]>("/initiative/participants");
      if (!Array.isArray(response.data)) {
        throw new Error("The participants response was not in the expected format.");
      }
      setParticipants(response.data);
    } catch (error) {
      if (isMissingIndividualAccount(error)) { setParticipants([]); return; }
      setParticipantsError(getErrorMessage(error, "Could not load initiative participants."));
    } finally {
      setParticipantsLoading(false);
    }
  }, [individualApi]);

  useEffect(() => {
    void volunteerApi.get<{ verificationStatus?: string }>("/profile")
      .then((response) => setVerificationStatus(response.data.verificationStatus ?? null))
      .catch((error: unknown) => setVerificationError(getErrorMessage(error, "Could not check your verification status.")))
      .finally(() => setVerificationLoaded(true));
  }, [volunteerApi]);

  const identityState = getVerificationState(verificationStatus);
  // Until the status loads (or if it can't be loaded) don't claim the user is locked out
  const isLockedOut = verificationLoaded && !verificationError && identityState !== "verified";

  // If the profile check itself failed, still try the lists: the 403 handling keeps that safe
  const hasIndividualAccess = verificationLoaded && (Boolean(verificationError) || !NOT_YET_INDIVIDUAL.has(verificationStatus));

  useEffect(() => {
    if (!verificationLoaded) return;
    if (!hasIndividualAccess) {
      setInitiativesLoading(false);
      setDonationsLoading(false);
      return;
    }
    void loadInitiatives();
    void loadDonations();
  }, [hasIndividualAccess, loadDonations, loadInitiatives, verificationLoaded]);

  useEffect(() => {
    if (!hasIndividualAccess) return;
    if (activeTab === "Applications") void loadApplications();
    if (activeTab === "Participants") void loadParticipants();
  }, [activeTab, hasIndividualAccess, loadApplications, loadParticipants]);

  const updateInitiativeStatus = async (initiative: IndividualInitiativeProps, action: "publish" | "completed") => {
    setPendingAction(`initiative-${initiative.id}`);
    setActionError("");
    try {
      await individualApi.patch(`/initiative/${initiative.id}/${action}`);
      await loadInitiatives(initiativePage);
    } catch (error) {
      setActionError(getErrorMessage(error, "Could not update the initiative."));
    } finally {
      setPendingAction("");
    }
  };

  // DRAFT initiatives are removed permanently; OPEN ones are soft-deleted (hidden) by the backend
  const deleteInitiative = async (initiative: IndividualInitiativeProps) => {
    if (!DELETABLE_STATUSES.has(initiative.status)) return;
    const isDraft = initiative.status === "DRAFT";
    const confirmed = await confirmAsk({
      question: isDraft
        ? `Delete the draft "${initiative.title}"? This can't be undone.`
        : `Delete "${initiative.title}"? It will stop accepting volunteers and disappear from your list.`,
      trueAnswer: "Delete",
      falseAnswer: "Cancel",
    });
    if (!confirmed) return;

    setPendingAction(`initiative-${initiative.id}`);
    setActionError("");
    try {
      await individualApi.delete(`/initiative/${initiative.id}`);
      // Step back a page if this was the last item on it
      const nextPage = initiatives.length === 1 && initiativePage > 0 ? initiativePage - 1 : initiativePage;
      await loadInitiatives(nextPage);
    } catch (error) {
      setActionError(getErrorMessage(error, "Could not delete the initiative."));
    } finally {
      setPendingAction("");
    }
  };

  const updateDonationStatus = async (donation: IndividualDonationProps, status: IndividualDonationStatus) => {
    setPendingAction(`donation-${donation.id}`);
    setActionError("");
    try {
      await individualApi.patch(`/initiative/donations/${encodeURIComponent(donation.id)}`, {
        donationId: donation.id,
        status,
      });
      await loadDonations(donationPage);
    } catch (error) {
      setActionError(getErrorMessage(error, "Could not update the donation status."));
    } finally {
      setPendingAction("");
    }
  };

  const updateApplicationStatus = async (application: IndividualApplicationProps, status: "APPROVED" | "REJECTED") => {
    if (application.projectApplied.status !== "APPLIED") return;
    const confirmed = await confirmAsk({
      question: `Are you sure you want to ${status === "APPROVED" ? "accept" : "reject"} this application?`,
      trueAnswer: status === "APPROVED" ? "Accept" : "Reject",
      falseAnswer: "Cancel",
    });
    if (!confirmed) return;

    const id = application.projectApplied.id;
    setPendingAction(`application-${id}`);
    setActionError("");
    try {
      const endpoint = status === "APPROVED"
        ? `/initiative/applications/${id}/accept`
        : `/initiative/applications/${id}/reject`;
      await individualApi.patch(endpoint, null);
      await loadApplications(applicationPage);
    } catch (error) {
      setActionError(getErrorMessage(error, "Could not update the application."));
    } finally {
      setPendingAction("");
    }
  };

  const updateParticipantStatus = async (participant: IndividualParticipationProps, status: ParticipationStatus) => {
    if (status === "COMPLETED" && participant.reviewable !== true) {
      setActionError("The participant response does not include completion eligibility, so this action is unavailable.");
      return;
    }
    if (participant.status !== "IN_PROGRESS") return;

    const confirmed = await confirmAsk({
      question: `Are you sure you want to ${status === "COMPLETED" ? "mark this participation completed" : "reject this participant"}?`,
      trueAnswer: status === "COMPLETED" ? "Complete" : "Reject",
      falseAnswer: "Cancel",
    });
    if (!confirmed) return;

    setPendingAction(`participant-${participant.id}`);
    setActionError("");
    try {
      await individualApi.patch("/initiative/participant", { id: participant.id, status });
      await loadParticipants();
    } catch (error) {
      setActionError(getErrorMessage(error, "Could not update the participant status."));
    } finally {
      setPendingAction("");
    }
  };

  const participantGroups = useMemo(() => {
    const groups = new Map<number, { title: string; participants: IndividualParticipationProps[] }>();
    participants.forEach((participant) => {
      const group = groups.get(participant.project.id) ?? { title: participant.project.title, participants: [] };
      group.participants.push(participant);
      groups.set(participant.project.id, group);
    });
    return [...groups.entries()];
  }, [participants]);

  const totalSupporters = initiatives.reduce((total, initiative) => total + (initiative.totalApplicants ?? 0), 0);
  const totalItemsDonated = donations.reduce((total, donation) => total + donation.quantityDonated, 0);

  return (
    <main className="min-h-screen bg-[#F3FAFA] text-[#323338]">
      <DashboardHeader roleLabel="Individual" />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <button type="button" onClick={() => navigate("/volunteer")} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#676879] hover:text-[#1A73E8]">
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <header className="flex flex-col gap-5 border-b border-[#DDE3E8] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1A73E8]">INDIVIDUAL SPACE</p>
            <h1 className="mt-2 text-3xl font-bold">Your initiatives</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#676879]">Turn a concern into a community effort. Find people ready to contribute time, skills, or items.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isLockedOut ? (
              <>
                {(identityState === "unverified" || identityState === "failed") && (
                  <button type="button" onClick={() => navigate(VERIFY_IDENTITY_PATH)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#155FC0]">
                    <ShieldCheck size={17} /> {identityState === "failed" ? "Retry verification" : "Verify identity"}
                  </button>
                )}
                {/* Still clickable: the modal explains what's needed instead of failing silently */}
                <button type="button" onClick={() => navigate("/individual/create-initiative")} aria-haspopup="dialog" aria-describedby="verification-gate-title" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#C3C6D4] bg-white px-4 py-2.5 text-sm font-semibold text-[#676879] transition hover:bg-[#F8FAFC]">
                  <LockKeyhole size={16} /> Create initiative
                </button>
              </>
            ) : (
              <button type="button" onClick={() => navigate("/individual/create-initiative")} aria-haspopup="dialog" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#155FC0]">
                <Plus size={17} /> Create initiative
              </button>
            )}
          </div>
        </header>

        {isLockedOut && identityState === "in_review" && (
          <section className="mt-6 flex items-start gap-4 rounded-xl border border-blue-200 bg-blue-50 p-5" aria-labelledby="verification-gate-title">
            <span className="rounded-lg bg-white p-2 text-[#1A73E8]"><Clock3 size={22} /></span>
            <div>
              <h2 id="verification-gate-title" className="font-semibold text-blue-950">Your verification is in review</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-blue-900">We've received your payment and are checking your details. You'll be able to create initiatives as soon as it's approved. There's nothing else you need to do.</p>
            </div>
          </section>
        )}

        {isLockedOut && (identityState === "unverified" || identityState === "failed") && (
          <section
            className={`mt-6 overflow-hidden rounded-xl border bg-white shadow-sm ${identityState === "failed" ? "border-red-200" : "border-[#BFD7FB]"}`}
            aria-labelledby="verification-gate-title"
          >
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
              <div className="flex items-start gap-4">
                <span className={`rounded-xl p-3 ${identityState === "failed" ? "bg-red-50 text-red-600" : "bg-[#EAF2FE] text-[#1A73E8]"}`}>
                  {identityState === "failed" ? <AlertTriangle size={26} /> : <ShieldCheck size={26} />}
                </span>
                <div>
                  <h2 id="verification-gate-title" className="text-lg font-semibold">
                    {identityState === "failed" ? "We couldn't verify your identity" : "Verify your identity to create initiatives"}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#676879]">
                    {identityState === "failed"
                      ? "Your name or ID number didn't match official records. Check that they're exactly as they appear on your ID, then try again."
                      : "You can volunteer on projects right away. To start and publish your own initiative, we first confirm who you are, so volunteers and donors know there's a real, accountable person behind it."}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => navigate(VERIFY_IDENTITY_PATH)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#1A73E8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#155FC0]">
                {identityState === "failed" ? "Try again" : "Verify identity"} <ArrowRight size={16} />
              </button>
            </div>
            {identityState === "unverified" && (
              <ol className="grid gap-px border-t border-[#E7EAEE] bg-[#E7EAEE] sm:grid-cols-3" aria-label="How verification works">
                {[
                  { icon: Fingerprint, title: "Enter your ID and a photo", detail: "NIN, driver's licence, voter's card or passport" },
                  { icon: CreditCard, title: "Pay the verification fee", detail: "Securely on Paystack" },
                  { icon: BadgeCheck, title: "We review your details", detail: "Then you can create initiatives" },
                ].map(({ icon: Icon, title, detail }, index) => (
                  <li key={title} className="flex items-start gap-3 bg-[#F8FAFC] px-6 py-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#1A73E8] ring-1 ring-[#BFD7FB]">{index + 1}</span>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-medium"><Icon size={15} className="text-[#1A73E8]" /> {title}</p>
                      <p className="mt-0.5 text-xs text-[#676879]">{detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
        {verificationError && <p role="alert" className="mt-4 text-sm text-red-700">{verificationError}</p>}
        {actionError && <p role="alert" className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}

        <nav className="mt-7 flex gap-1 overflow-x-auto border-b border-[#DDE3E8]" aria-label="Individual dashboard sections">
          {tabs.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} aria-current={activeTab === tab ? "page" : undefined} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === tab ? "border-[#1A73E8] text-[#1A73E8]" : "border-transparent text-[#676879] hover:text-[#323338]"}`}>
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "Overview" && (
          <>
            <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Initiative activity">
              <article className="border border-[#DDE3E8] bg-white p-5">
                <div className="flex items-center justify-between text-sm text-[#676879]"><span>Initiatives</span><BriefcaseBusiness size={18} className="text-[#1A73E8]" /></div>
                <p className="mt-3 text-3xl font-bold">{initiativesLoading ? "…" : initiativeTotal}</p>
                <p className="mt-1 text-xs text-[#8A8D98]">Created by you</p>
              </article>
              <article className="border border-[#DDE3E8] bg-white p-5">
                <div className="flex items-center justify-between text-sm text-[#676879]"><span>People supporting</span><UsersRound size={18} className="text-[#34A853]" /></div>
                <p className="mt-3 text-3xl font-bold">{initiativesLoading ? "…" : totalSupporters}</p>
                <p className="mt-1 text-xs text-[#8A8D98]">Applicants on this page</p>
              </article>
              <article className="border border-[#DDE3E8] bg-white p-5">
                <div className="flex items-center justify-between text-sm text-[#676879]"><span>Items pledged</span><HandHeart size={18} className="text-[#B86705]" /></div>
                <p className="mt-3 text-3xl font-bold">{donationsLoading ? "…" : totalItemsDonated}</p>
                <p className="mt-1 text-xs text-[#8A8D98]">Across this donations page</p>
              </article>
            </section>
            {(initiativesError || donationsError) && (
              <div role="alert" className="mt-5 space-y-1 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {initiativesError && <p>{initiativesError}</p>}
                {donationsError && <p>{donationsError}</p>}
              </div>
            )}
            <section className="mt-8 border border-[#DDE3E8] bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Lead an initiative and coordinate support</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#676879]">Volunteers can pledge time, skills, or physical items. Monetary donations are not part of the initiative donation API.</p>
                </div>
                <BadgeCheck className="hidden shrink-0 text-[#34A853] sm:block" size={34} />
              </div>
            </section>
          </>
        )}

        {activeTab === "My initiatives" && (
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Initiatives you lead</h2>
              <button type="button" onClick={() => void loadInitiatives(initiativePage)} disabled={initiativesLoading} className="text-sm font-semibold text-[#1A73E8] hover:underline disabled:opacity-50">
                Refresh
              </button>
            </div>
            {initiativesError && <p role="alert" className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{initiativesError}</p>}
            {initiativesLoading ? (
              <p role="status" className="border border-[#DDE3E8] bg-white px-6 py-10 text-center text-sm text-[#676879]">Loading your initiatives…</p>
            ) : initiatives.length === 0 && !initiativesError ? (
              <div className="border border-dashed border-[#C3C6D4] bg-white px-6 py-12 text-center">
                <BriefcaseBusiness className="mx-auto text-[#1A73E8]" size={30} />
                <h3 className="mt-4 text-lg font-semibold">No initiatives yet</h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#676879]">
                  {isLockedOut
                    ? "Once your identity is verified, initiatives you create will appear here."
                    : "Create an initiative to recruit volunteers and coordinate item or service pledges."}
                </p>
                {isLockedOut ? (
                  identityState !== "in_review" && (
                    <button type="button" onClick={() => navigate(VERIFY_IDENTITY_PATH)} className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#155FC0]"><ShieldCheck size={16} /> Verify identity</button>
                  )
                ) : (
                  <button type="button" onClick={() => navigate("/individual/create-initiative")} className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#155FC0]"><Plus size={16} /> Create initiative</button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {initiatives.map((initiative) => (
                  <article key={initiative.id} className="border border-[#DDE3E8] bg-white p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{initiative.title}</h3>
                          <span className="rounded-full bg-[#F3FAFA] px-2.5 py-1 text-xs font-medium text-[#676879]">{initiative.status}</span>
                        </div>
                        <p className="mt-1 text-sm text-[#676879]">
                          {initiative.startDate || "Start date not set"} – {initiative.endDate || "End date not set"}
                          {" · "}{initiative.totalApplicants ?? 0} applicants
                        </p>
                        {((initiative.services?.length ?? 0) > 0 || (initiative.items?.length ?? 0) > 0) && (
                          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="What this initiative needs">
                            {initiative.services?.map((service) => (
                              <li key={`s-${service.resourceId ?? service.resource}`} className="rounded-full bg-[#EAF2FE] px-2.5 py-1 text-xs font-medium text-[#1A73E8]">
                                {service.resource}{service.quantity > 1 ? ` × ${service.quantity}` : ""}
                              </li>
                            ))}
                            {initiative.items?.map((item) => (
                              <li key={`i-${item.resourceId ?? item.resource}`} className="rounded-full bg-[#E8F5EC] px-2.5 py-1 text-xs font-medium text-[#287D3C]">
                                {item.resource} × {item.quantity}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {initiative.status === "DRAFT" && (
                          <button type="button" onClick={() => void updateInitiativeStatus(initiative, "publish")} disabled={pendingAction === `initiative-${initiative.id}`} className="rounded-md bg-[#1A73E8] px-3 py-2 text-sm font-semibold text-white hover:bg-[#155FC0] disabled:opacity-50">
                            Publish
                          </button>
                        )}
                        {(initiative.status === "OPEN" || initiative.status === "ONGOING") && (
                          <button type="button" onClick={() => void updateInitiativeStatus(initiative, "completed")} disabled={pendingAction === `initiative-${initiative.id}`} className="rounded-md border border-[#C3C6D4] px-3 py-2 text-sm font-semibold hover:bg-[#F8FAFC] disabled:opacity-50">
                            Mark completed
                          </button>
                        )}
                        {DELETABLE_STATUSES.has(initiative.status) && (
                          <button type="button" onClick={() => void deleteInitiative(initiative)} disabled={pendingAction === `initiative-${initiative.id}`} aria-label={`Delete ${initiative.title}`} className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">
                            <Trash2 size={15} /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
                {initiativeTotalPages > 1 && (
                  <div className="flex items-center justify-between border border-[#DDE3E8] bg-white px-4 py-3 text-sm">
                    <button type="button" onClick={() => void loadInitiatives(initiativePage - 1)} disabled={initiativesLoading || initiativePage === 0} className="font-semibold text-[#1A73E8] disabled:opacity-50">Previous</button>
                    <span>Page {initiativePage + 1} of {initiativeTotalPages}</span>
                    <button type="button" onClick={() => void loadInitiatives(initiativePage + 1)} disabled={initiativesLoading || initiativePage + 1 >= initiativeTotalPages} className="font-semibold text-[#1A73E8] disabled:opacity-50">Next</button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === "Applications" && (
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Volunteer applications</h2>
                <p className="mt-1 text-sm text-[#676879]">Review people applying to your initiatives.</p>
              </div>
              <button type="button" onClick={() => void loadApplications(applicationPage)} disabled={applicationsLoading} className="text-sm font-semibold text-[#1A73E8] hover:underline disabled:opacity-50">
                Refresh
              </button>
            </div>
            {applicationsError && <p role="alert" className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{applicationsError}</p>}
            {applicationsLoading ? (
              <p role="status" className="border border-[#DDE3E8] bg-white px-6 py-10 text-center text-sm text-[#676879]">Loading applications…</p>
            ) : applications.length === 0 && !applicationsError ? (
              <div className="border border-dashed border-[#C3C6D4] bg-white px-6 py-12 text-center">
                <Inbox className="mx-auto text-[#1A73E8]" size={30} />
                <h3 className="mt-4 text-lg font-semibold">No applications to show</h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#676879]">Volunteer applications for your initiatives will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((application) => (
                  <article key={application.projectApplied.id} className="border border-[#DDE3E8] bg-white p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        {application.profileUrl ? (
                          <img src={application.profileUrl} alt="" className="h-11 w-11 rounded-full border border-[#DDE3E8] object-cover" />
                        ) : (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF2FE] text-[#1A73E8]"><UserRound size={20} /></span>
                        )}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{application.firstname} {application.lastname}</h3>
                            <span className="rounded-full bg-[#F3FAFA] px-2.5 py-1 text-xs font-medium text-[#676879]">{application.projectApplied.status}</span>
                          </div>
                          <p className="mt-1 text-sm text-[#676879]">For {application.projectApplied.title} · Applied {formatDate(application.projectApplied.appliedAt)}</p>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#323338]">{application.reason}</p>
                          {application.aboutVolunteer && <p className="mt-2 text-sm leading-6 text-[#676879]">{application.aboutVolunteer}</p>}
                          {application.additionalInfo && <p className="mt-2 text-sm leading-6 text-[#676879]">{application.additionalInfo}</p>}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {application.skills.map((skill) => <span key={skill} className="rounded-full bg-[#F3FAFA] px-2.5 py-1 text-xs text-[#676879]">{skill}</span>)}
                            {application.specialSkills?.map((skill) => <span key={`special-${skill}`} className="rounded-full bg-[#EAF2FE] px-2.5 py-1 text-xs text-[#1A73E8]">{skill}</span>)}
                            {application.isAvailable && <span className="rounded-full bg-[#E7F4EA] px-2.5 py-1 text-xs text-[#287D3C]">Available</span>}
                          </div>
                        </div>
                      </div>
                      {application.projectApplied.status === "APPLIED" && (
                        <div className="flex shrink-0 gap-2 sm:justify-end">
                          <button type="button" onClick={() => void updateApplicationStatus(application, "REJECTED")} disabled={pendingAction === `application-${application.projectApplied.id}`} className="rounded-md border border-[#C3C6D4] px-3 py-2 text-sm font-semibold hover:bg-[#F8FAFC] disabled:opacity-50">Reject</button>
                          <button type="button" onClick={() => void updateApplicationStatus(application, "APPROVED")} disabled={pendingAction === `application-${application.projectApplied.id}`} className="rounded-md bg-[#1A73E8] px-3 py-2 text-sm font-semibold text-white hover:bg-[#155FC0] disabled:opacity-50">Accept</button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
                {applicationTotalPages > 1 && (
                  <div className="flex items-center justify-between border border-[#DDE3E8] bg-white px-4 py-3 text-sm">
                    <button type="button" onClick={() => void loadApplications(applicationPage - 1)} disabled={applicationsLoading || applicationPage === 0} className="font-semibold text-[#1A73E8] disabled:opacity-50">Previous</button>
                    <span>Page {applicationPage + 1} of {applicationTotalPages}</span>
                    <button type="button" onClick={() => void loadApplications(applicationPage + 1)} disabled={applicationsLoading || applicationPage + 1 >= applicationTotalPages} className="font-semibold text-[#1A73E8] disabled:opacity-50">Next</button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === "Participants" && (
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Initiative participants</h2>
                <p className="mt-1 text-sm text-[#676879]">Track people currently participating in your initiatives.</p>
              </div>
              <button type="button" onClick={() => void loadParticipants()} disabled={participantsLoading} className="text-sm font-semibold text-[#1A73E8] hover:underline disabled:opacity-50">
                Refresh
              </button>
            </div>
            {participantsError && <p role="alert" className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{participantsError}</p>}
            {participantsLoading ? (
              <p role="status" className="border border-[#DDE3E8] bg-white px-6 py-10 text-center text-sm text-[#676879]">Loading participants…</p>
            ) : participants.length === 0 && !participantsError ? (
              <div className="border border-dashed border-[#C3C6D4] bg-white px-6 py-12 text-center">
                <UsersRound className="mx-auto text-[#34A853]" size={30} />
                <h3 className="mt-4 text-lg font-semibold">No participants yet</h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#676879]">Approved volunteers participating in your initiatives will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {participantGroups.map(([projectId, group]) => (
                  <section key={projectId} aria-labelledby={`initiative-participants-${projectId}`}>
                    <h3 id={`initiative-participants-${projectId}`} className="mb-3 text-base font-semibold">{group.title}</h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {group.participants.map((participant) => {
                        const name = [participant.volunteer.firstname, participant.volunteer.middleName, participant.volunteer.lastname].filter(Boolean).join(" ");
                        return (
                          <article key={participant.id} className="border border-[#DDE3E8] bg-white p-5">
                            <div className="flex items-start gap-3">
                              {participant.volunteer.profileUrl ? (
                                <img src={participant.volunteer.profileUrl} alt="" className="h-10 w-10 rounded-full border border-[#DDE3E8] object-cover" />
                              ) : (
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F4EA] text-[#287D3C]"><UserRound size={19} /></span>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-semibold">{name || "Volunteer"}</h4>
                                  <span className="rounded-full bg-[#F3FAFA] px-2.5 py-1 text-xs font-medium text-[#676879]">{participant.status.replace("_", " ")}</span>
                                </div>
                                {participant.reason && <p className="mt-2 text-sm leading-5 text-[#676879]">{participant.reason}</p>}
                                {participant.volunteer.phoneNumber && <a className="mt-2 inline-block text-sm text-[#1A73E8] hover:underline" href={`tel:${participant.volunteer.phoneNumber}`}>{participant.volunteer.phoneNumber}</a>}
                              </div>
                            </div>
                            {participant.volunteer.skills && participant.volunteer.skills.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {participant.volunteer.skills.map((skill) => <span key={skill} className="rounded-full bg-[#F3FAFA] px-2.5 py-1 text-xs text-[#676879]">{skill}</span>)}
                              </div>
                            )}
                            {participant.status === "IN_PROGRESS" && (
                              <div className="mt-4 flex flex-wrap gap-2 border-t border-[#E7EAEE] pt-3">
                                <button type="button" onClick={() => void updateParticipantStatus(participant, "COMPLETED")} disabled={pendingAction === `participant-${participant.id}` || participant.reviewable !== true} title={participant.reviewable === true ? undefined : "The API response does not provide completion eligibility."} className="rounded-md bg-[#34A853] px-3 py-2 text-sm font-semibold text-white hover:bg-[#287D3C] disabled:cursor-not-allowed disabled:opacity-50">Mark completed</button>
                                <button type="button" onClick={() => void updateParticipantStatus(participant, "REJECTED")} disabled={pendingAction === `participant-${participant.id}`} className="rounded-md border border-[#C3C6D4] px-3 py-2 text-sm font-semibold hover:bg-[#F8FAFC] disabled:opacity-50">Reject participant</button>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "Contributions" && (
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Donations to your initiatives</h2>
                <p className="mt-1 text-sm text-[#676879]">Review volunteer pledges of physical items and update their status.</p>
              </div>
              <button type="button" onClick={() => void loadDonations(donationPage)} disabled={donationsLoading} className="text-sm font-semibold text-[#1A73E8] hover:underline disabled:opacity-50">
                Refresh
              </button>
            </div>
            {donationsError && <p role="alert" className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{donationsError}</p>}
            {donationsLoading ? (
              <p role="status" className="border border-[#DDE3E8] bg-white px-6 py-10 text-center text-sm text-[#676879]">Loading donations…</p>
            ) : donations.length === 0 && !donationsError ? (
              <div className="border border-dashed border-[#C3C6D4] bg-white px-6 py-12 text-center">
                <HandHeart className="mx-auto text-[#34A853]" size={30} />
                <h3 className="mt-4 text-lg font-semibold">No donations to show</h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#676879]">Volunteer item pledges will appear here when someone applies to support an initiative.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {donations.map((donation) => (
                  <article key={donation.id} className="border border-[#DDE3E8] bg-white p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        {/* Donor photo, so owners can tell pledges apart. Only Cloudinary URLs are rendered */}
                        {donation.profileUrl?.startsWith("https://res.cloudinary.com/") ? (
                          <img src={donation.profileUrl} alt="Donor" className="h-10 w-10 shrink-0 rounded-full object-cover" loading="lazy" />
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3FAFA] text-[#676879]" aria-hidden="true"><UserRound size={18} /></span>
                        )}
                        <div>
                          <h3 className="font-semibold">{donation.itemName} <span className="font-normal text-[#676879]">× {donation.quantityDonated}</span></h3>
                          <p className="mt-1 text-sm text-[#676879]">{donation.initiative?.title ?? "Initiative"} · {donationStatusLabel[donation.status] ?? donation.status}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {donation.status === "Pending_acceptance" && (
                          <>
                            <button type="button" onClick={() => void updateDonationStatus(donation, "Promised_Accepted")} disabled={pendingAction === `donation-${donation.id}`} className="rounded-md bg-[#1A73E8] px-3 py-2 text-sm font-semibold text-white hover:bg-[#155FC0] disabled:opacity-50">Accept pledge</button>
                            <button type="button" onClick={() => void updateDonationStatus(donation, "Promise_Rejected")} disabled={pendingAction === `donation-${donation.id}`} className="rounded-md border border-[#C3C6D4] px-3 py-2 text-sm font-semibold hover:bg-[#F8FAFC] disabled:opacity-50">Reject</button>
                          </>
                        )}
                        {donation.status === "Promised_Accepted" && (
                          <>
                            <button type="button" onClick={() => void updateDonationStatus(donation, "Promise_Fulfilled")} disabled={pendingAction === `donation-${donation.id}`} className="rounded-md bg-[#34A853] px-3 py-2 text-sm font-semibold text-white hover:bg-[#287D3C] disabled:opacity-50">Mark fulfilled</button>
                            <button type="button" onClick={() => void updateDonationStatus(donation, "Promise_Rejected")} disabled={pendingAction === `donation-${donation.id}`} className="rounded-md border border-[#C3C6D4] px-3 py-2 text-sm font-semibold hover:bg-[#F8FAFC] disabled:opacity-50">Reject</button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
                {donationTotalPages > 1 && (
                  <div className="flex items-center justify-between border border-[#DDE3E8] bg-white px-4 py-3 text-sm">
                    <button type="button" onClick={() => void loadDonations(donationPage - 1)} disabled={donationsLoading || donationPage === 0} className="font-semibold text-[#1A73E8] disabled:opacity-50">Previous</button>
                    <span>Page {donationPage + 1} of {donationTotalPages}</span>
                    <button type="button" onClick={() => void loadDonations(donationPage + 1)} disabled={donationsLoading || donationPage + 1 >= donationTotalPages} className="font-semibold text-[#1A73E8] disabled:opacity-50">Next</button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>

      <ConfirmDialog />
      <Outlet context={{
        verificationStatus,
        verificationLoaded,
        onInitiativeCreated: () => { setActiveTab("My initiatives"); void loadInitiatives(0); },
      } satisfies InitiativesOutletContext} />
    </main>
  );
};
