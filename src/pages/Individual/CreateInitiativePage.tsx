import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboardHeader";
import { IndividualSignup } from "./IndividualSignupPage";

export const CreateInitiativePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#F3FAFA] text-[#323338]">
      <DashboardHeader roleLabel="Individual" />
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <button type="button" onClick={() => navigate("/individual")} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#676879] hover:text-[#1A73E8]">
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <section className="mb-5 flex items-start gap-3 border-l-4 border-[#FBBC05] bg-white px-4 py-4" aria-label="Verification requirement">
          <ShieldCheck className="mt-0.5 shrink-0 text-[#9A6B00]" size={19} />
          <div>
            <h1 className="font-semibold">Verification is required before publishing</h1>
            <p className="mt-1 text-sm leading-5 text-[#676879]">You can prepare initiative details here. Givr requires identity verification before an initiative can be published. This form currently previews the creation flow and does not save or publish data.</p>
          </div>
        </section>

        <IndividualSignup />
      </div>
    </main>
  );
};