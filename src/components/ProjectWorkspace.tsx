"use client";
import { useEffect, useState } from "react";
import { X, MessageSquare, History, Send, CheckCircle2, Trash2, RotateCcw, Loader2, ShieldCheck } from "lucide-react";

export default function ProjectWorkspace({ project, onClose, onToast, onChange }: { project: any; onClose: () => void; onToast: (m: string) => void; onChange: () => void }) {
  const [tab, setTab] = useState<"comments" | "versions">("comments");
  const [list, setList] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [approved, setApproved] = useState(project?.status === "completed" && project?.folder === "Approved");

  async function load() {
    const c = await (await fetch(`/api/comments?projectId=${project.id}`)).json();
    setList(c.comments || []);
    const v = await (await fetch(`/api/versions?projectId=${project.id}`)).json();
    setVersions(v.versions || []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [project.id]);

  async function add() {
    if (!body.trim()) return onToast("Comment likhein");
    setBusy(true);
    await fetch("/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: project.id, body, timecode: "0:0" + Math.floor(Math.random() * 9) }) });
    setBody(""); setBusy(false); load(); onToast("Comment added");
  }
  async function resolve(id: number, resolved: boolean) {
    await fetch("/api/comments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, resolved }) });
    load();
  }
  async function remove(id: number) {
    await fetch(`/api/comments?id=${id}`, { method: "DELETE" }); load();
  }
  async function restore(versionId: number) {
    const r = await fetch("/api/versions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ versionId }) });
    if (r.ok) { onToast("Version restored"); onChange(); await load(); }
  }
  async function approve() {
    const next = !approved; setApproved(next);
    await fetch(`/api/projects/${project.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ folder: next ? "Approved" : "All Projects", note: next ? "Approved by client" : "Approval revoked" }) });
    onToast(next ? "Approved — folder 'Approved' mein chala gaya" : "Approval revoked"); onChange();
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm grid place-items-center p-3 md:p-6" onClick={onClose}>
      <div className="w-full max-w-xl rounded-3xl border hairline overflow-hidden reveal" style={{ background: "var(--panel)", color: "var(--text)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b hairline">
          <span className="w-8 h-8 rounded-lg grid place-items-center shrink-0" style={{ background: "var(--teal)", color: "#04211c" }}><MessageSquare size={15} /></span>
          <div className="min-w-0 flex-1"><p className="font-display font-bold text-sm truncate">{project.title}</p><p className="text-[10px] muted truncate">Team review · comments · version history</p></div>
          <button onClick={onClose} className="btn btn-ghost w-8 h-8 !p-0 shrink-0"><X size={15} /></button>
        </div>
        <div className="flex gap-1.5 px-4 pt-3">
          <button onClick={() => setTab("comments")} className={`chip ${tab === "comments" ? "chip-on" : ""}`}><MessageSquare size={11} /> Comments ({list.length})</button>
          <button onClick={() => setTab("versions")} className={`chip ${tab === "versions" ? "chip-on" : ""}`}><History size={11} /> Versions ({versions.length})</button>
          <button onClick={approve} className={`chip ml-auto ${approved ? "chip-teal" : ""}`}><ShieldCheck size={11} /> {approved ? "Approved" : "Approve"}</button>
        </div>

        {tab === "comments" ? (
          <div className="p-4">
            <div className="space-y-2 max-h-[46vh] overflow-auto pr-1">
              {list.map(c => (
                <div key={c.id} className="panel2 rounded-xl p-2.5" style={{ opacity: c.resolved ? 0.55 : 1 }}>
                  <div className="flex justify-between text-[11px]"><b>{c.author}</b><span className="muted">{c.timecode && "@" + c.timecode} · {new Date(c.createdAt).toLocaleString()}</span></div>
                  <p className="text-xs mt-1 leading-relaxed">{c.body}</p>
                  <div className="flex gap-2 mt-1.5">
                    <button onClick={() => resolve(c.id, !c.resolved)} className="text-[10px] font-bold flex items-center gap-1" style={{ color: c.resolved ? "var(--muted)" : "var(--teal)" }}><CheckCircle2 size={11} /> {c.resolved ? "Resolved" : "Mark resolved"}</button>
                    <button onClick={() => remove(c.id)} className="text-[10px] font-bold flex items-center gap-1" style={{ color: "var(--danger)" }}><Trash2 size={11} /> Delete</button>
                  </div>
                </div>
              ))}
              {list.length === 0 && <p className="text-xs muted py-6 text-center">Koi comment nahi — pehla feedback likho.</p>}
            </div>
            <div className="flex gap-2 mt-3">
              <input value={body} onChange={e => setBody(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Feedback / @mention likho…" className="input !py-2 text-sm" />
              <button onClick={add} disabled={busy} className="btn btn-primary px-4 text-xs shrink-0">{busy ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}</button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-2 max-h-[52vh] overflow-auto pr-1">
              {versions.map(v => (
                <div key={v.id} className="panel2 rounded-xl p-2.5 flex gap-2 items-center">
                  {v.snapshot?.thumbnail ? <img src={v.snapshot.thumbnail} alt="" className="w-14 h-9 object-cover rounded-md" /> : <span className="w-14 h-9 rounded-md bg-black/40" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{v.note}</p>
                    <p className="text-[10px] muted truncate">{v.title} · {v.status} · {new Date(v.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => restore(v.id)} className="btn btn-ghost px-2.5 py-1 text-[10px] shrink-0"><RotateCcw size={11} /> Restore</button>
                </div>
              ))}
              {versions.length === 0 && <p className="text-xs muted py-6 text-center">Abhi koi version nahi. Har edit/render par version save hota hai.</p>}
            </div>
            <p className="text-[10px] muted mt-3">Version history real hai — project edits/render hone par snapshot ban jata hai, kisi bhi point par restore karo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
