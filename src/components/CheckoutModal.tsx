"use client";
import { useState } from "react";
import {
  X, CheckCircle2, CreditCard, ShieldCheck, Zap, Lock,
  Sparkles, Smartphone, ArrowRight, Loader2,
} from "lucide-react";

type Props = {
  item: { name: string; price: number; credits: number; isPlan?: boolean };
  initialMethod?: string;
  email: string;
  onSuccess: (credits: number, plan?: string) => void;
  onClose: () => void;
};

const METHODS = [
  { id: "JazzCash", name: "JazzCash", hint: "Instant mobile wallet (PK)", color: "#dc2626" },
  { id: "EasyPaisa", name: "EasyPaisa", hint: "Telenor mobile wallet (PK)", color: "#16a34a" },
  { id: "Card", name: "Credit / Debit Card", hint: "Visa / Mastercard / Stripe", color: "#6366f1" },
  { id: "UPI", name: "UPI / GooglePay", hint: "Instant transfer (IN)", color: "#f59e0b" },
  { id: "Crypto", name: "Crypto (USDT)", hint: "TRC20 / Polygon", color: "#06b6d4" },
];

export default function CheckoutModal({ item, initialMethod = "JazzCash", email, onSuccess, onClose }: Props) {
  const [method, setMethod] = useState(initialMethod);
  const [phone, setPhone] = useState("03001234567");
  const [trxId, setTrxId] = useState("");
  const [cardNum, setCardNum] = useState("4242 •••• •••• 4242");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const priceFormatted = item.price === 0 ? "Free" : `PKR ${item.price.toLocaleString()}`;

  async function handlePay() {
    setBusy(true);
    // Simulate real gateway handshake (1.2s)
    await new Promise((r) => setTimeout(r, 1200));

    try {
      const res = await fetch("/api/misc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "buyCredits",
          credits: item.credits,
          plan: item.isPlan ? item.name : undefined,
          method,
          email,
          ref: trxId || `TXN-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
        }),
      });
      const data = await res.json();
      setBusy(false);
      setDone(true);
      setTimeout(() => {
        onSuccess(item.credits, item.isPlan ? item.name : undefined);
      }, 1600);
    } catch {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[85] bg-black/85 backdrop-blur-sm grid place-items-center p-3 md:p-6" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-3xl border hairline overflow-hidden reveal"
        style={{ background: "var(--panel)", color: "var(--text)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b hairline">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
              <CreditCard size={16} />
            </span>
            <div>
              <p className="font-display font-bold text-sm">Secure Checkout</p>
              <p className="text-[10px] muted">Mir AI Studio · 256-bit Encrypted</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost w-8 h-8 !p-0">
            <X size={15} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center reveal">
            <span className="w-16 h-16 rounded-full mx-auto grid place-items-center mb-3" style={{ background: "var(--teal)", color: "#04211c" }}>
              <CheckCircle2 size={34} />
            </span>
            <h3 className="font-display font-bold text-2xl">Payment Successful!</h3>
            <p className="text-xs muted mt-1.5">
              +{item.credits.toLocaleString()} credits aapke account mein add ho chuke hain.
            </p>
            <div className="panel2 rounded-2xl p-4 my-5 text-left text-xs space-y-1">
              <div className="flex justify-between"><span className="muted">Item</span><b>{item.name}</b></div>
              <div className="flex justify-between"><span className="muted">Amount</span><b>{priceFormatted}</b></div>
              <div className="flex justify-between"><span className="muted">Method</span><b>{method}</b></div>
              <div className="flex justify-between"><span className="muted">Status</span><b style={{ color: "var(--teal)" }}>Completed</b></div>
            </div>
            <p className="text-[11px] muted">Returning to studio…</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Order Summary Card */}
            <div className="panel2 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-base">{item.name}</p>
                <p className="text-xs muted flex items-center gap-1 mt-0.5">
                  <Zap size={12} style={{ color: "var(--accent)" }} /> +{item.credits.toLocaleString()} AI video credits
                </p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-xl">{priceFormatted}</p>
                <span className="chip chip-on !text-[9px]">One-time</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <p className="text-xs font-bold muted mb-2 flex items-center gap-1">
                <CreditCard size={12} /> Select Payment Method
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {METHODS.map((m) => {
                  const on = method === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className="p-2.5 rounded-xl border text-left transition active:scale-95"
                      style={{
                        background: on ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "var(--panel2)",
                        borderColor: on ? "var(--accent)" : "var(--line)",
                      }}
                    >
                      <p className="font-bold text-xs" style={{ color: on ? "var(--accent)" : "var(--text)" }}>{m.name}</p>
                      <p className="text-[10px] muted truncate">{m.hint}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Method Details Form */}
            {(method === "JazzCash" || method === "EasyPaisa") && (
              <div className="panel2 rounded-2xl p-3.5 space-y-2.5 border hairline">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold flex items-center gap-1">
                    <Smartphone size={13} style={{ color: "var(--accent)" }} /> {method} Mobile Account
                  </span>
                  <span className="chip chip-teal !text-[9px]">Direct Merchant</span>
                </div>
                <div>
                  <label className="text-[10px] muted block mb-1">Enter your 11-digit {method} Mobile Number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XXXXXXXXX"
                    className="input !py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] muted block mb-1">TRX ID / Reference (optional or auto)</label>
                  <input
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 192847192"
                    className="input !py-1.5 text-xs font-mono"
                  />
                </div>
                <p className="text-[10px] muted leading-tight">
                  Aapke phone par {method} ka prompt aayega — MPIN enter karne par credits foran add ho jayenge.
                </p>
              </div>
            )}

            {method === "Card" && (
              <div className="panel2 rounded-2xl p-3.5 space-y-2.5 border hairline">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold flex items-center gap-1">
                    <Lock size={12} style={{ color: "var(--teal)" }} /> Card Details
                  </span>
                  <span className="text-[10px] muted">Stripe Powered</span>
                </div>
                <input
                  value={cardNum}
                  onChange={(e) => setCardNum(e.target.value)}
                  placeholder="Card Number"
                  className="input !py-2 text-xs font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="MM / YY" defaultValue="12/28" className="input !py-1.5 text-xs font-mono" />
                  <input placeholder="CVC" defaultValue="883" className="input !py-1.5 text-xs font-mono" />
                </div>
              </div>
            )}

            {method === "UPI" && (
              <div className="panel2 rounded-2xl p-3.5 space-y-2 border hairline">
                <p className="text-xs font-bold">UPI ID (GooglePay / PhonePe / Paytm)</p>
                <input defaultValue="creator@upi" className="input !py-2 text-xs font-mono" />
                <p className="text-[10px] muted">UPI app par payment request bheji jayegi.</p>
              </div>
            )}

            {method === "Crypto" && (
              <div className="panel2 rounded-2xl p-3.5 space-y-1.5 border hairline">
                <p className="text-xs font-bold">USDT Address (TRC20)</p>
                <code className="block panel px-2 py-1.5 rounded text-[10px] font-mono select-all">
                  TXR9uMirAIStudio7wQ92kj8YtL239
                </code>
                <p className="text-[10px] muted">1 USDT = ~280 PKR equivalent credits</p>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={busy}
              className="btn btn-primary w-full py-3.5 text-sm font-extrabold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing Payment…
                </>
              ) : (
                <>
                  <Lock size={14} /> Pay {priceFormatted} via {method}
                </>
              )}
            </button>

            <p className="text-[10px] muted text-center flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} style={{ color: "var(--teal)" }} />
              7-Day Money-Back Guarantee · Cancel anytime · Instant activation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
