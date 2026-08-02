import { useEffect, useState, useCallback } from "react";
import type {
  ParticipantProps,
  PagedModelParticipationDto,
  BatchCertificateRequest,
} from "../../interface/interfaces";
import useAuthFetch from "../hooks/useAuthFetch";
import { useConfirmAsk } from "../hooks/useConfirm";
import { useAlert } from "../hooks/useAlert";
import { PageLoader } from "../icons";
import {
  Award,
  CheckCircle,
  CheckSquare,
  Square,
  User,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Search,
  X,
} from "lucide-react";
import { parseZonedDateTime } from "../hooks/ParseDate";

const PAGE_SIZE = 30;

export const CertificateManagement: React.FC = () => {
  const { API } = useAuthFetch("organization");
  const { confirmAsk, ConfirmDialog } = useConfirmAsk({ isOrg: true });
  const { alertMessage, AlertDialog } = useAlert({ isOrg: true });

  const [participants, setParticipants] = useState<ParticipantProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [pageMeta, setPageMeta] = useState({
    number: 0,
    totalElements: 0,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPendingCertificates = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        const response = await API().get<PagedModelParticipationDto>(
          `/admin/certificate/pending?page=${page}&size=${PAGE_SIZE}`
        );
        const data = response.data;
        setParticipants(data.content);
        setPageMeta(data.page);
        // Clear selections when page changes
        setSelectedIds(new Set());
      } catch {
        alertMessage("Failed to load pending certificates.");
      } finally {
        setIsLoading(false);
      }
    },
    [API, alertMessage]
  );

  useEffect(() => {
    fetchPendingCertificates(currentPage);
  }, [currentPage, fetchPendingCertificates]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    const filtered = getFilteredParticipants();
    if (filtered.every((p) => selectedIds.has(p.id))) {
      // Deselect all filtered
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      // Select all filtered
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const approveSingle = async (participantId: number) => {
    const confirmed = await confirmAsk({
      question: "Issue certificate to this volunteer? This action cannot be undone.",
      trueAnswer: "Approve",
      falseAnswer: "Cancel",
    });
    if (!confirmed) return;

    try {
      setIsApproving(true);
      await API().patch(`/admin/certificate/${participantId}/approve`);
      setParticipants((prev) => prev.filter((p) => p.id !== participantId));
      setPageMeta((prev) => ({
        ...prev,
        totalElements: prev.totalElements - 1,
      }));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(participantId);
        return next;
      });
      alertMessage("Certificate issued successfully.");
    } catch {
      alertMessage("Failed to approve certificate.");
    } finally {
      setIsApproving(false);
    }
  };

  const approveBatch = async () => {
    if (selectedIds.size === 0) return;

    const confirmed = await confirmAsk({
      question: `Issue certificates to ${selectedIds.size} volunteer${selectedIds.size > 1 ? "s" : ""}? This action cannot be undone.`,
      trueAnswer: "Approve All",
      falseAnswer: "Cancel",
    });
    if (!confirmed) return;

    try {
      setIsApproving(true);
      const body: BatchCertificateRequest = {
        participants: Array.from(selectedIds),
      };

      // Use the batch endpoint if multiple, single if only 1
      if (selectedIds.size === 1) {
        await API().patch(`/admin/certificate/${body.participants[0]}/approve`);
      } else {
        await API().patch("/admin/certificate/approve", body);
      }

      setParticipants((prev) =>
        prev.filter((p) => !selectedIds.has(p.id))
      );
      setPageMeta((prev) => ({
        ...prev,
        totalElements: prev.totalElements - selectedIds.size,
      }));
      setSelectedIds(new Set());
      alertMessage(
        `${selectedIds.size} certificate${selectedIds.size > 1 ? "s" : ""} issued successfully.`
      );
    } catch {
      alertMessage("Failed to approve certificates in batch.");
    } finally {
      setIsApproving(false);
    }
  };

  const getFilteredParticipants = () => {
    if (!searchQuery.trim()) return participants;
    const q = searchQuery.toLowerCase();
    return participants.filter(
      (p) =>
        `${p.volunteer.firstname} ${p.volunteer.lastname}`
          .toLowerCase()
          .includes(q) ||
        p.project.title.toLowerCase().includes(q) ||
        (p.volunteer.email || "").toLowerCase().includes(q)
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      return parseZonedDateTime(dateStr);
    } catch {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const filtered = getFilteredParticipants();
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      {(isLoading || isApproving) && (
        <PageLoader message={isApproving ? "Processing..." : undefined} />
      )}
      <ConfirmDialog />
      <AlertDialog />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Award size={22} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Certificate Management
              </h1>
              <p className="text-sm text-gray-500">
                {pageMeta.totalElements} pending certificate
                {pageMeta.totalElements !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, project, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 pl-9 pr-8 py-2 bg-gray-100 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Batch action bar */}
        {selectedIds.size > 0 && (
          <div className="mb-4 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <CheckSquare size={18} />
              {selectedIds.size} volunteer
              {selectedIds.size > 1 ? "s" : ""} selected
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-white/60 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={approveBatch}
                disabled={isApproving}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                <FileCheck size={16} />
                Approve {selectedIds.size > 1 ? "All" : ""}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1 flex items-center">
              <button
                onClick={toggleSelectAll}
                className="p-0.5 rounded hover:bg-gray-200 transition-colors"
                title={allFilteredSelected ? "Deselect all" : "Select all"}
              >
                {allFilteredSelected ? (
                  <CheckSquare
                    size={18}
                    className="text-amber-600"
                    fill="currentColor"
                  />
                ) : (
                  <Square size={18} className="text-gray-400" />
                )}
              </button>
            </div>
            <div className="col-span-3">Volunteer</div>
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Applied</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {/* Table body */}
          {filtered.length === 0 && !isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Award size={48} className="mb-3 opacity-20" />
              <p className="text-sm font-medium">
                {searchQuery
                  ? "No matching pending certificates."
                  : "All caught up! No pending certificates."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((participant) => {
                const isSelected = selectedIds.has(participant.id);
                const volunteerName = `${participant.volunteer.firstname || ""} ${participant.volunteer.middleName || ""} ${participant.volunteer.lastname || ""}`
                  .trim()
                  .replace(/\s+/g, " ");
                const formattedDate = participant.endDate
                  ? formatDate(participant.endDate)
                  : formatDate(participant.project.endDate);

                return (
                  <div
                    key={participant.id}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center transition-colors ${
                      isSelected ? "bg-amber-50/50" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="md:col-span-1 flex items-center">
                      <button
                        onClick={() => toggleSelect(participant.id)}
                        className="p-0.5 rounded hover:bg-gray-200 transition-colors"
                        title={isSelected ? "Deselect" : "Select"}
                      >
                        {isSelected ? (
                          <CheckSquare
                            size={18}
                            className="text-amber-600"
                            fill="currentColor"
                          />
                        ) : (
                          <Square size={18} className="text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Volunteer info */}
                    <div className="md:col-span-3 flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {participant.volunteer.profileUrl ? (
                          <img
                            src={participant.volunteer.profileUrl}
                            alt={volunteerName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={18} className="text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {volunteerName || "Unknown"}
                        </p>
                        {participant.volunteer.location?.state && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} />
                            {participant.volunteer.location.state}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Project */}
                    <div className="md:col-span-3 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {participant.project.title}
                      </p>
                      {participant.project.organization?.name && (
                        <p className="text-xs text-gray-500 truncate">
                          {participant.project.organization.name}
                        </p>
                      )}
                    </div>

                    {/* Status badge */}
                    <div className="md:col-span-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                        <Calendar size={12} />
                        {participant.status === "COMPLETED"
                          ? "Completed"
                          : participant.status}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="md:col-span-1 text-xs text-gray-500">
                      {formattedDate}
                    </div>

                    {/* Action */}
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        onClick={() => approveSingle(participant.id)}
                        disabled={isApproving}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-200 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={16} />
                        Issue Certificate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pageMeta.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {currentPage * PAGE_SIZE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-700">
                {Math.min(
                  (currentPage + 1) * PAGE_SIZE,
                  pageMeta.totalElements
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {pageMeta.totalElements}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(pageMeta.totalPages, 7) }, (_, i) => {
                  // Show pagination window around current page
                  let pageNum: number;
                  if (pageMeta.totalPages <= 7) {
                    pageNum = i;
                  } else if (currentPage < 4) {
                    pageNum = i;
                  } else if (currentPage > pageMeta.totalPages - 5) {
                    pageNum = pageMeta.totalPages - 7 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                        currentPage === pageNum
                          ? "bg-amber-500 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(pageMeta.totalPages - 1, p + 1)
                  )
                }
                disabled={currentPage >= pageMeta.totalPages - 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateManagement;