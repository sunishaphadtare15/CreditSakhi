import { useRef, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Banknote, CalendarDays, ChevronRight, FileCheck2, Landmark, Lightbulb, PiggyBank, Plus, ReceiptIndianRupee, ShieldCheck, Sparkles, TrendingUp, Upload, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mapFactors, type Translation } from "./data";
import { api } from "@/lib/api";

type Props = { t: Translation; data: any; onChanged: () => void; onShare: () => void };

export function Dashboard({ t, data, onChanged, onShare }: Props) {
  const months: any[] = data?.months ?? [];
  const factors = mapFactors(data?.factors);
  const cash = months.map((m: any) => ({ name: m.month.slice(5), in: Math.round(m.inflow / 1000), out: Math.round(m.outflow / 1000) }));
  const act = new Set<string>(data?.activeDays ?? []);
  const lastDay = data?.activeDays?.length ? new Date(data.activeDays[data.activeDays.length - 1]) : new Date();
  const heat = Array.from({ length: 28 }, (_, i) => { const d = new Date(lastDay); d.setUTCDate(d.getUTCDate() - (27 - i)); return act.has(d.toISOString().slice(0, 10)) ? 3 : 0; });
  const [saleOpen, setSaleOpen] = useState(false);
  const [sale, setSale] = useState("500");
  const [saved, setSaved] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const saveSale = async () => { try { await api.addSale(Number(sale || 0)); setSaved(true); onChanged(); } catch (e) { alert("Could not save: " + (e as Error).message); return; } setTimeout(() => { setSaleOpen(false); setSaved(false); }, 800); };
  return <div className="pb-28">{!data && <div className="mx-auto max-w-6xl px-4 pt-5 md:px-6"><p className="rounded-lg border border-gold-border bg-coach px-4 py-3 text-sm text-foreground">Add at least two months of sales (upload a CSV from the sample files) to see your score.</p></div>}
    <section className="mx-auto grid max-w-6xl gap-5 px-4 py-5 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-8">
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div><p className="text-sm font-semibold text-primary">{t.addData}</p><p className="mt-1 text-sm text-muted-foreground">Build stronger proof in a few taps</p></div>
            <span className="rounded-full bg-verified-soft px-3 py-1 text-xs font-bold text-verified">{t.stronger}</span>
          </div>
          <button type="button" onClick={() => fileRef.current?.click()} className="grid min-h-20 w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border border-verified-border bg-verified-soft p-3 text-left focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-ring">
            <span className="grid size-12 place-items-center rounded-md bg-verified text-primary-foreground"><Upload className="size-5" /></span>
            <span className="min-w-0"><span className="block text-xs font-bold uppercase text-verified">{t.verifiedData}</span><span className="mt-0.5 block text-sm font-semibold text-foreground">{fileName || t.upload}</span><span className="block text-xs text-muted-foreground">{fileName ? t.fileReady : t.uploadHint}</span></span>
            <ChevronRight className="size-5 shrink-0 text-verified" />
          </button>
          <input ref={fileRef} className="sr-only" type="file" accept=".csv" aria-label={t.selectFile} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setFileName(f.name); try { const r = await api.uploadCsv(f); alert("Imported " + r.imported + " rows"); onChanged(); } catch (err) { alert((err as Error).message); } }} />
          <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase text-muted-foreground"><span className="h-px grow bg-border" />or<span className="h-px grow bg-border" /></div>
          <Button className="w-full" onClick={() => setSaleOpen(true)}><Plus className="size-5" />{t.recordSales}</Button>
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-3 text-xs font-bold uppercase text-muted-foreground">{t.optionalRecords}</p>
            <div className="grid grid-cols-3 gap-2">
              {([
      { icon: PiggyBank, label: t.shg },
      { icon: Landmark, label: t.emi },
      { icon: ReceiptIndianRupee, label: t.chit },
    ] as { icon: LucideIcon; label: string }[]).map(({ icon: Icon, label }) => <button key={label} className="min-h-20 rounded-md border border-border bg-background p-2 text-center text-xs font-semibold text-foreground hover:bg-muted"><Icon className="mx-auto mb-1.5 size-5 text-terracotta" />{label}</button>)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gold-border bg-coach p-5">
          <div className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-gold text-foreground"><Lightbulb className="size-5" /></span><div><h2 className="font-bold text-foreground">{t.coach}</h2><p className="mt-1 text-sm leading-6 text-foreground">{data?.tips?.length ? data.tips.join(" ") : t.tip}</p></div></div>
        </div>
      </div>

      <div className="space-y-5">
        <ScoreCard t={t} score={data?.score ?? 0} months={months.length} removed={data?.cleaning?.duplicates ?? 0} />
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-foreground">{t.factors}</h2><span className="text-xs font-semibold text-muted-foreground">6 factors</span></div>
          <div className="divide-y divide-border">
            {factors.map((item: any) => <div key={item.key} className="grid grid-cols-[1fr_auto] gap-3 py-4 first:pt-0 last:pb-0">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-foreground">{t[item.key as keyof typeof t]}</h3><span className={item.confidence === "verified" ? "badge-verified" : "badge-reported"}>{item.confidence === "verified" ? <ShieldCheck className="size-3" /> : null}{item.confidence === "verified" ? t.verified : t.reported}</span></div><p className="mt-1 text-sm text-muted-foreground">{item.note}</p></div>
              <div className="text-right"><p className="font-bold text-primary">+{item.score}</p><p className="text-xs text-muted-foreground">/ {item.max} {t.points}</p></div>
            </div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-border bg-surface-subtle py-8"><div className="mx-auto max-w-6xl px-4 md:px-6"><div className="mb-5"><p className="text-sm font-semibold text-primary">{t.insights}</p><h2 className="mt-1 text-2xl font-bold text-foreground">Simple patterns, clear progress</h2></div><div className="grid gap-4 lg:grid-cols-3">
      <ChartCard title={t.salesTrend} icon={<TrendingUp className="size-5" />}><ResponsiveContainer width="100%" height={190}><AreaChart data={months.map((m: any) => ({ month: m.month.slice(5), sales: Math.round(m.inflow / 1000) }))} margin={{top:10,right:5,left:-20,bottom:0}}><defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28}/><stop offset="100%" stopColor="var(--primary)" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="var(--border)" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:"var(--muted-foreground)",fontSize:12}}/><YAxis axisLine={false} tickLine={false} tick={{fill:"var(--muted-foreground)",fontSize:12}}/><Tooltip/><Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} fill="url(#salesFill)"/></AreaChart></ResponsiveContainer></ChartCard>
      <ChartCard title={t.weeklyActivity} icon={<CalendarDays className="size-5" />}><div className="grid grid-cols-7 gap-2 pt-3">{heat.map((v: number, i: number)=><span key={i} aria-label={`Day ${i+1}: ${v ? "active" : "inactive"}`} className={`aspect-square rounded-sm ${v===3?"bg-verified":v===2?"bg-verified-medium":v===1?"bg-verified-light":"bg-muted"}`}/>)}</div><div className="mt-5 flex items-center justify-between text-sm"><span className="text-muted-foreground">Last 28 days</span><strong className="text-foreground">{heat.filter(Boolean).length} {t.activeDays.toLowerCase()}</strong></div></ChartCard>
      <ChartCard title={t.cashFlow} icon={<Banknote className="size-5" />}><ResponsiveContainer width="100%" height={190}><BarChart data={cash} margin={{top:10,right:5,left:-20,bottom:0}}><CartesianGrid stroke="var(--border)" vertical={false}/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:"var(--muted-foreground)",fontSize:12}}/><YAxis axisLine={false} tickLine={false} tick={{fill:"var(--muted-foreground)",fontSize:12}}/><Tooltip/><Bar dataKey="in" fill="var(--verified)" radius={[3,3,0,0]}/><Bar dataKey="out" fill="var(--terracotta)" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></ChartCard>
    </div></div></section>

    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-3 backdrop-blur"><div className="mx-auto max-w-6xl"><Button className="w-full shadow-button md:ml-auto md:flex md:w-auto md:min-w-80" onClick={onShare}><ShieldCheck className="size-5" />{t.generate}</Button></div></div>

    {saleOpen && <div className="fixed inset-0 z-50 grid place-items-end bg-overlay p-0 sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="sale-title"><div className="w-full rounded-t-lg bg-card p-5 shadow-modal sm:max-w-md sm:rounded-lg"><div className="mb-5 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-md bg-primary-soft text-primary"><ReceiptIndianRupee /></span><div><h2 id="sale-title" className="text-lg font-bold">{t.addAmount}</h2><p className="text-sm text-muted-foreground">{t.today}</p></div></div><label className="text-sm font-semibold" htmlFor="sale-amount">{t.amount}</label><div className="mt-2 flex h-16 items-center rounded-md border border-input bg-background px-4 text-2xl font-bold"><span>₹</span><input id="sale-amount" inputMode="numeric" value={sale} onChange={(e)=>setSale(e.target.value.replace(/\D/g,""))} className="min-w-0 grow bg-transparent px-2 outline-hidden" /></div><div className="mt-3 grid grid-cols-3 gap-2">{[100,500,1000].map(v=><Button key={v} variant="secondary" onClick={()=>setSale(String(Number(sale||0)+v))}>+₹{v.toLocaleString("en-IN")}</Button>)}</div><div className="mt-6 grid grid-cols-2 gap-3"><Button variant="secondary" onClick={()=>setSaleOpen(false)}>{t.cancel}</Button><Button onClick={saveSale}>{saved ? <><FileCheck2 className="size-5"/>{t.salesSaved}</> : t.saveSale}</Button></div></div></div>}
  </div>;
}

function ScoreCard({ t, score, months, removed }: { t: Translation; score: number; months: number; removed: number }) { return <div className="overflow-hidden rounded-lg border border-primary-border bg-primary shadow-score"><div className="grid gap-6 p-6 text-primary-foreground sm:grid-cols-[auto_1fr] sm:items-center"><div className="relative grid size-44 place-items-center rounded-full score-ring" style={{ background: `conic-gradient(var(--gold) 0 ${score}%, var(--primary-foreground-soft) ${score}% 100%)` }}><div className="grid size-32 place-items-center rounded-full bg-primary text-center"><div><span className="block text-5xl font-bold">{score}</span><span className="text-sm text-primary-foreground-muted">{t.outOf}</span></div></div></div><div><div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground-soft px-3 py-1 text-sm font-bold"><Sparkles className="size-4" />{t.good}</div><h1 className="text-3xl font-bold">{t.creditHealth}</h1><p className="mt-2 text-sm leading-6 text-primary-foreground-muted">{`Based on ${months} months of business activity`}</p><div className="mt-4 inline-flex items-center gap-2 border-l-2 border-gold pl-3 text-sm font-semibold"><TrendingUp className="size-4 text-gold" />{`${removed} duplicate rows removed`}</div></div></div></div> }
function ChartCard({title,icon,children}:{title:string;icon:React.ReactNode;children:React.ReactNode}) { return <div className="rounded-lg border border-border bg-card p-5 shadow-card"><div className="mb-2 flex items-center gap-2 font-bold text-foreground"><span className="text-primary">{icon}</span>{title}</div>{children}</div> }
