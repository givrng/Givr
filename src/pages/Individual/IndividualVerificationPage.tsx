import { ArrowLeft, BadgeCheck, CreditCard, Fingerprint, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboardHeader";

const verificationSteps = [
  { number: "01", title: "Request verification", detail: "Start an identity verification request with Givr." },
  { number: "02", title: "Pay the verification fee", detail: "The fee will be shown before payment. Amount to be confirmed." },
  { number: "03", title: "Verify your identity", detail: "Givr will provide the approved verification method." },
];

export const IndividualVerificationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#F3FAFA] text-[#323338]">
      <DashboardHeader roleLabel="Individual" />
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <button type="button" onClick={() => navigate("/individual")} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#676879] hover:text-[#1A73E8]">
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <header className="border-b border-[#DDE3E8] pb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-[#FFF7DF] px-3 py-1.5 text-xs font-semibold text-[#805B00]">
            <ShieldCheck size={15} /> VERIFICATION REQUIRED
          </div>
          <h1 className="text-3xl font-bold">Verify your identity</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#676879]">Verification helps keep individual-led initiatives and the people supporting them accountable. You’ll need to be verified before creating or joining an initiative.</p>
        </header>

        <section className="mt-7" aria-labelledby="verification-process-title">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#EAF2FE] text-[#1A73E8]"><Fingerprint size={20} /></span>
            <div>
              <h2 id="verification-process-title" className="font-semibold">Verification process</h2>
              <p className="text-sm text-[#676879]">Three steps before you can lead or join initiatives</p>
            </div>
          </div>

          <ol className="divide-y divide-[#E7EAEE] border-y border-[#E7EAEE] bg-white">
            {verificationSteps.map((step, index) => (
              <li key={step.number} className="flex gap-4 px-5 py-5 sm:px-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3FAFA] text-sm font-semibold text-[#1A73E8]">{step.number}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-[#676879]">{step.detail}</p>
                </div>
                {index === 1 && <CreditCard className="mt-1 shrink-0 text-[#8A8D98]" size={18} />}
                {index === 2 && <BadgeCheck className="mt-1 shrink-0 text-[#8A8D98]" size={18} />}
              </li>
            ))}
          </ol>
        </section>

        <aside className="mt-6 border-l-4 border-[#1A73E8] bg-white px-5 py-4">
          <h2 className="font-semibold">Verification setup is being finalized</h2>
          <p className="mt-1 text-sm leading-6 text-[#676879]">The identity-check provider and fee have not been confirmed yet. No payment is requested here. You can still use Givr to browse while verification is unavailable.</p>
        </aside>
      </div>
    </main>
  );
};