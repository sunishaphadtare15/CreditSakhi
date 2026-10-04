import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/p/$token")({ component: PublicPassport });

const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

function PublicPassport() {
  const { token } = Route.useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getPublicPassport(token).then(setData).catch((e: Error) => setError(e.message));
  }, [token]);

  if (error)
    return (
      <main className="min-h-screen bg-surface-subtle px-4 py-10">
        <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-6 text-center shadow-card">
          <ShieldAlert className="mx-auto size-10 text-destructive" />
          <h1 className="mt-3 text-2xl font-bold">This passport can't be shown</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  if (!data) return <main className="grid min-h-screen place-items-center">Loading passport…</main>;

  const maxMonth = Math.max(1, ...(data.months ?? []).map((m: any) => Math.max(m.inflow, m.outflow)));

  return (
    <main className="min-h-screen bg-surface-subtle px-4 py-8 md:px-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className={`flex items-center gap-3 rounded-lg border p-4 font-semibold ${data.authentic ? "border-verified bg-verified-soft text-verified" : "border-destructive text-destructive"}`}>
          {data.authentic ? <ShieldCheck className="size-6 shrink-0" /> : <ShieldAlert className="size-6 shrink-0" />}
          <span>{data.authentic ? `Verified authentic: unchanged since generation on ${fmt(data.generatedAt)}` : "Warning: this report does not match its original fingerprint. Do not rely on it."}</span>
        </div>

        <section className="rounded-lg border border-border bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">{data.business} · access ends {fmt(data.expiresAt)}</p>
          {data.score !== undefined && <p className="mt-2 text-5xl font-bold text-primary">{data.score}<span className="text-xl text-muted-foreground"> / 100</span></p>}
          {data.confidence && <p className="mt-2 text-sm font-semibold">{data.confidence.verifiedPct}% verified data · {data.confidence.selfReportedPct}% self-reported</p>}
        </section>

        {data.factors && (
          <section className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h2 className="mb-3 text-lg font-bold">What shaped the score</h2>
            <div className="space-y-4">
              {data.factors.map((f: any) => (
                <div key={f.key}>
                  <div className="flex items-center justify-between gap-2 font-semibold">
                    <span>{f.name}</span>
                    <span>{f.points}/{f.max}{f.tier && <span className={`ml-2 rounded-full border px-2 py-0.5 text-xs ${f.tier === "verified" ? "text-verified" : "text-muted-foreground"}`}>{f.tier === "verified" ? "Verified" : "Self-reported"}</span>}</span>
                  </div>
                  <div className="mt-1 h-2.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(f.points / f.max) * 100}%` }} /></div>
                  <p className="mt-1 text-sm text-muted-foreground">{f.note}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.months && (
          <section className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h2 className="mb-3 text-lg font-bold">Money in and out by month</h2>
            <div className="flex h-40 items-end gap-3">
              {data.months.map((m: any) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-32 w-full items-end justify-center gap-1">
                    <div className="w-1/2 rounded-t bg-primary" style={{ height: `${(m.inflow / maxMonth) * 100}%` }} title={`In ₹${m.inflow}`} />
                    <div className="w-1/2 rounded-t bg-muted-foreground/50" style={{ height: `${(m.outflow / maxMonth) * 100}%` }} title={`Out ₹${m.outflow}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">{m.month.slice(5)}/{m.month.slice(2, 4)}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Green: money in. Grey: money out.</p>
          </section>
        )}

        <section className="rounded-lg border border-border bg-muted p-5 text-sm text-muted-foreground">
          <h2 className="mb-2 font-bold text-foreground">Honest limitations</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>The score is an explainable supporting document, not an automated lending decision.</li>
            <li>Self-reported entries are clearly separated from bank/UPI-verified data.</li>
            <li>Scoring weights still need calibration against real repayment data in a pilot.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
