import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Mir AI Studio",
  description: "Privacy policy, data collection terms, and user rights for Mir AI Studio.",
};

export default function PrivacyPage() {
  return (
    <div className="app-shell theme-dark min-h-screen relative py-12 px-4 md:px-8">
      <div className="ambient" />
      <div className="relative z-10 max-w-4xl mx-auto card p-6 md:p-10">
        <Link href="/" className="btn btn-ghost px-4 py-2 text-xs mb-6 w-fit">
          <ArrowLeft size={14} /> Back to Studio
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "var(--teal)", color: "#04211c" }}>
            <ShieldCheck size={22} />
          </span>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl">Privacy Policy</h1>
            <p className="text-xs muted">Last Updated: October 2026 · Mir AI Studio</p>
          </div>
        </div>

        <div className="panel2 rounded-2xl p-4 my-6 border hairline">
          <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--teal)" }}>
            <CheckCircle2 size={14} /> Urdu Summary (خلاصہ)
          </p>
          <p className="text-xs muted mt-1 leading-relaxed">
            Mir AI Studio aapka data kisi teesray fard ko sell nahi karta. Aapke prompts, images aur videos sirf aapke account ke andar safe rehte hain. Aap jab chahein apna data aur account delete kar sakte hain.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed muted">
          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2 flex items-center gap-2">
              <Eye size={16} style={{ color: "var(--accent)" }} /> 1. Information We Collect
            </h2>
            <p>
              When you use Mir AI Studio, we collect information necessary to provide and enhance our video creation services:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><b>Account Information:</b> Name, email address, password hash, and plan tier.</li>
              <li><b>Creation Inputs:</b> Prompts, text scripts, uploaded images, audio preferences, and rendering settings.</li>
              <li><b>Generated Media:</b> Output videos, procedural audio tracks, and generated thumbnails stored in your workspace.</li>
              <li><b>Usage & Payment Data:</b> Credit consumption logs, transaction references (JazzCash, EasyPaisa, Stripe), and timestamp logs. We never store raw credit card numbers or banking MPINs.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2 flex items-center gap-2">
              <Lock size={16} style={{ color: "var(--teal)" }} /> 2. How We Use Your Data
            </h2>
            <p>We process your information solely for the following purposes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Processing video generation requests and delivering finished renders to your devices.</li>
              <li>Maintaining your project version history, comments, and collaborative brand assets.</li>
              <li>Facilitating credit additions and billing history.</li>
              <li>Diagnosing technical issues, rate limiting abuse prevention, and platform security.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2 flex items-center gap-2">
              <FileText size={16} style={{ color: "var(--accent)" }} /> 3. Ownership & AI Rights
            </h2>
            <p>
              You own all intellectual property rights in the videos and assets you generate with Mir AI Studio, subject to our Acceptable Use Policy. We do not claim ownership of your generated content or sell your creative works.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2">4. Data Retention & Deletion</h2>
            <p>
              You may delete any project, video render, or API key at any time from your dashboard. Projects moved to Trash can be permanently purged immediately. If you request account closure, all associated records are permanently erased within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2">5. Contact Privacy Team</h2>
            <p>
              For privacy inquiries, GDPR data requests, or content removal, email us at <b className="text-[var(--text)]">privacy@mirai.app</b> or submit a support ticket directly from your studio dashboard.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
