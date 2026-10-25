import Link from "next/link";
import { Clapperboard, Home, Sparkles, Smartphone, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="app-shell theme-dark min-h-screen relative grid place-items-center p-6 text-center">
      <div className="ambient" />
      <div className="relative z-10 max-w-md card p-8 reveal">
        <span className="w-16 h-16 rounded-2xl mx-auto grid place-items-center mb-4" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
          <Clapperboard size={32} />
        </span>
        <span className="chip chip-on !text-[10px] mb-2">404 Error</span>
        <h1 className="font-display font-bold text-3xl mt-1">Scene Not Found</h1>
        <p className="text-xs muted mt-2 leading-relaxed">
          Yeh page mojood nahi hai ya move ho chuka hai. Mir AI Studio ya Mobile App par wapas jayein.
        </p>

        <div className="flex flex-col gap-2 mt-6">
          <Link href="/" className="btn btn-primary py-2.5 text-xs">
            <Home size={14} /> Go to Mir AI Studio
          </Link>
          <Link href="/mobile" className="btn btn-teal py-2.5 text-xs">
            <Smartphone size={14} /> Open Mobile App
          </Link>
          <Link href="/mobile-preview" className="btn btn-ghost py-2.5 text-xs">
            <Sparkles size={14} /> Mobile App Preview &amp; Install
          </Link>
        </div>

        <p className="text-[10px] muted mt-6">Mir AI Studio · AI Video Generator · Urdu / Hindi</p>
      </div>
    </div>
  );
}
