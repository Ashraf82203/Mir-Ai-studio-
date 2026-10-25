import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Mir AI Studio",
  description: "Terms of service, usage licenses, and commercial guidelines for Mir AI Studio.",
};

export default function TermsPage() {
  return (
    <div className="app-shell theme-dark min-h-screen relative py-12 px-4 md:px-8">
      <div className="ambient" />
      <div className="relative z-10 max-w-4xl mx-auto card p-6 md:p-10">
        <Link href="/" className="btn btn-ghost px-4 py-2 text-xs mb-6 w-fit">
          <ArrowLeft size={14} /> Back to Studio
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
            <FileText size={22} />
          </span>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl">Terms of Service</h1>
            <p className="text-xs muted">Effective: October 2026 · Mir AI Studio</p>
          </div>
        </div>

        <div className="panel2 rounded-2xl p-4 my-6 border hairline">
          <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
            <CheckCircle2 size={14} /> Commercial License (کمرشل استعمال)
          </p>
          <p className="text-xs muted mt-1 leading-relaxed">
            Mir AI Studio se banaye gaye videos aap YouTube, Facebook, TikTok, Instagram, client projects aur ads mein azaadi se commercial maqsad ke liye use kar sakte hain. Paid plans par koi watermark nahi hota.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed muted">
          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using Mir AI Studio (web, mobile app, or developer APIs), you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2">2. Commercial Use & Licensing</h2>
            <p>
              Subscribers on Basic, Pro, and Business plans receive full commercial exploitation rights for all exported videos, audio tracks, and thumbnails without attribution. Users on the Free tier may use outputs for non-commercial and personal projects with the standard platform watermark.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2 flex items-center gap-2">
              <AlertTriangle size={16} style={{ color: "var(--danger)" }} /> 3. Acceptable Use Policy
            </h2>
            <p>You agree not to use Mir AI Studio to generate or disseminate:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Illegal, defamatory, sexually explicit, or hateful content.</li>
              <li>Non-consensual deepfakes of real individuals, impersonation, or political misinformation.</li>
              <li>Content that infringes upon third-party trademarks or copyrights.</li>
              <li>Automated abusive requests that attempt to circumvent rate limits (60 req/min).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2">4. Credit Balances & Expiration</h2>
            <p>
              Credits represent the digital computation units required for video rendering, procedural music, and AI operations. Purchased credits remain valid for 90 days from the purchase date. Daily login credits and bonus referral credits are non-transferable.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2">5. Service Availability & SLA</h2>
            <p>
              We strive for 99.9% platform availability. Maintenance windows and rendering load adjustments are communicated via dashboard banners. In case of unexpected server disruptions, renders that fail will automatically have their credits refunded to your balance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
