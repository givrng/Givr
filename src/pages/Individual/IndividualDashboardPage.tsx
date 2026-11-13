import { useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, CircleHelp, HandHeart, LockKeyhole, Plus, UsersRound } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboardHeader";

const tabs = ["Overview", "My initiatives", "Contributions"] as const;
type DashboardTab = typeof tabs[number];

export const IndividualDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("Overview");
  const navigate = useNavigate();

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
            <button type="button" onClick={() => navigate("/individual/create-initiative")} aria-haspopup="dialog" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#155FC0]">
              <Plus size={17} /> Create initiative
            </button>
            <button type="button" onClick={() => navigate("/individual/verification")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#C3C6D4] bg-white px-4 py-2.5 text-sm font-semibold text-[#323338] transition hover:bg-[#F8FAFC]">
              <LockKeyhole size={17} /> Verification steps
            </button>
          </div>
        </header>

        <section className="mt-6 border-l-4 border-[#FBBC05] bg-white px-5 py-4 shadow-sm" aria-labelledby="verification-status-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-md bg-[#FFF7DF] p-2 text-[#9A6B00]"><CircleHelp size={19} /></span>
              <div>
                <h2 id="verification-status-title" className="font-semibold">Identity verification required</h2>
                <p className="mt-1 max-w-3xl text-sm leading-5 text-[#676879]">Unverified individuals can browse, but must be verified before creating or joining an individual-led initiative.</p>
              </div>
            </div>
            <button type="button" onClick={() => navigate("/individual/verification")} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#1A73E8] hover:underline">
              View verification steps <ArrowRight size={16} />
            </button>
          </div>
        </section>

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
                <p className="mt-3 text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-[#8A8D98]">Created by you</p>
              </article>
              <article className="border border-[#DDE3E8] bg-white p-5">
                <div className="flex items-center justify-between text-sm text-[#676879]"><span>People supporting</span><UsersRound size={18} className="text-[#34A853]" /></div>
                <p className="mt-3 text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-[#8A8D98]">Across your initiatives</p>
              </article>
              <article className="border border-[#DDE3E8] bg-white p-5">
                <div className="flex items-center justify-between text-sm text-[#676879]"><span>Contributions tracked</span><HandHeart size={18} className="text-[#B86705]" /></div>
                <p className="mt-3 text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-[#8A8D98]">Time, services, and items</p>
              </article>
            </section>

            <section className="mt-8 border border-[#DDE3E8] bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Your first initiative starts with verification</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#676879]">Once verified, you can publish an initiative, recruit contributors, and track volunteer, service, and item commitments. Givr does not support monetary donations.</p>
                </div>
                <BadgeCheck className="hidden shrink-0 text-[#34A853] sm:block" size={34} />
              </div>
            </section>
          </>
        )}

        {activeTab === "My initiatives" && (
          <section className="mt-6 border border-dashed border-[#C3C6D4] bg-white px-6 py-12 text-center">
            <BriefcaseBusiness className="mx-auto text-[#1A73E8]" size={30} />
            <h2 className="mt-4 text-lg font-semibold">No initiatives yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#676879]">Complete identity verification to create and manage your own initiatives.</p>
            <button type="button" onClick={() => navigate("/individual/verification")} className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-[#1A73E8] hover:bg-[#EAF2FE]">Review verification <ArrowRight size={16} /></button>
          </section>
        )}

        {activeTab === "Contributions" && (
          <section className="mt-6 border border-dashed border-[#C3C6D4] bg-white px-6 py-12 text-center">
            <HandHeart className="mx-auto text-[#34A853]" size={30} />
            <h2 className="mt-4 text-lg font-semibold">No contributions to show</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#676879]">Your commitments to initiatives will appear here, including services and item contributions.</p>
          </section>
        )}

      </div>

      {/* Renders the create-initiative modal when its route is active */}
      <Outlet />
    </main>
  );
};