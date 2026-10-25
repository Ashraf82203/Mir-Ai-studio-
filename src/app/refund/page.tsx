import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, RotateCcw, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy — Mir AI Studio",
  description: "Refund policy for credits, subscription plans, and failed render guarantee at Mir AI Studio.",
};

export default function RefundPage() {
  return (
    <div className="app-shell theme-dark min-h-screen relative py-12 px-4 md:px-8">
      <div className="ambient" />
      <div className="relative z-10 max-w-4xl mx-auto card p-6 md:p-10">
        <Link href="/" className="btn btn-ghost px-4 py-2 text-xs mb-6 w-fit">
          <ArrowLeft size={14} /> Back to Studio
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "var(--teal)", color: "#04211c" }}>
            <RotateCcw size={22} />
          </span>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl">Refund & Credit Policy</h1>
            <p className="text-xs muted">Mir AI Studio · Clear & Fair Consumer Protection</p>
          </div>
        </div>

        <div className="panel2 rounded-2xl p-4 my-6 border hairline">
          <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--teal)" }}>
            <ShieldCheck size={14} /> Failed Render Guarantee (خراب رینڈر کی گارنٹی)
          </p>
          <p className="text-xs muted mt-1 leading-relaxed">
            Agar technical kharabi ya browser crash ki wajah se aapka video render complete na ho sake, toh us video ke credits foran aur automatically aapke wallet mein wapas daal diye jaate hain.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed muted">
          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: "var(--teal)" }} /> 1. Failed Render Protection
            </h2>
            <p>
              Every video render attempt is monitored. If a render fails due to memory exhaustion, browser timeout, or database communication error, the credits deducted for that specific generation are automatically restored to your account ledger.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2 flex items-center gap-2">
              <CreditCard size={16} style={{ color: "var(--accent)" }} /> 2. 7-Day Money-Back Guarantee (Subscriptions)
            </h2>
            <p>
              If you purchase a paid plan (Basic, Pro, or Business) and are unsatisfied with the video output quality, you may request a full monetary refund within 7 days of purchase, provided you have used fewer than 20% of the plan&apos;s allocated credits.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2">3. JazzCash & EasyPaisa Transactions</h2>
            <p>
              For payments made through JazzCash or EasyPaisa in Pakistan:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Refunds approved by support are routed back to the sending wallet number within 24 to 48 hours.</li>
              <li>Always retain your 10 to 12-digit Transaction ID (TRX ID) from your SMS receipt as proof of payment.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2">4. Credit Top-Ups</h2>
            <p>
              One-time credit pack purchases (500, 2000, 10000 credits) are digital goods. Unused credit packs are eligible for a refund within 3 days of purchase upon written request to our billing desk.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[var(--text)] mb-2">5. How to Request a Refund</h2>
            <p>
              Submit your request through our in-app <b>Support Ticket</b> form under Admin/Help, or email <b className="text-[var(--text)]">billing@mirai.app</b> with your account email and transaction receipt. Our average resolution time is under 2 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
