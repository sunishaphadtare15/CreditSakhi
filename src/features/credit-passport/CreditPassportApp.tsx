import { useEffect, useMemo, useState } from "react";
import { BarChart3, ChevronDown, Headphones, LayoutDashboard, Link2, Menu, ShieldCheck, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, type Share } from "@/lib/api";
import { Dashboard } from "./Dashboard";
import { LenderView } from "./LenderView";
import { ConsentForm, LinkCreated, SharedLinksList } from "./SharingFlow";
import { translations, type Language, type ShareRecord } from "./data";

type View = "dashboard" | "consent" | "created" | "shares" | "lender";

const toRecord = (s: Share): ShareRecord => ({
  ...s,
  link: s.link ?? "",
  lastOpenedAt: s.lastOpenedAt ? new Date(s.lastOpenedAt).toLocaleString() : "Not opened yet",
});

export function CreditPassportApp() {
  const [language,setLanguage]=useState<Language>("en");
  const [view,setView]=useState<View>("dashboard");
  const [menuOpen,setMenuOpen]=useState(false);
  const [shares,setShares]=useState<ShareRecord[]>([]);
  const [created,setCreated]=useState<ShareRecord | null>(null);
  const t=translations[language];
  const nav=useMemo(()=>[{id:"dashboard" as const,label:t.borrower,icon:LayoutDashboard},{id:"shares" as const,label:t.shares,icon:Link2},{id:"lender" as const,label:t.lender,icon:ShieldCheck}], [t]);

  useEffect(() => {
    api.listShares().then(list => setShares(list.map(toRecord))).catch(() => {});
  }, []);

  const onCreateLink = async (recipient: string, duration: string, sections: ShareRecord["sections"]) => {
    try {
      const share = toRecord(await api.onCreateLink(recipient, sections, duration as Share["durationLabel"]));
      setCreated(share);
      setShares(current => [share, ...current]);
      setView("created");
    } catch (e) {
      alert("Could not create link: " + (e as Error).message + ". Is the backend running on port 8000?");
    }
  };
  const onCopyLink=(link:string)=>{void navigator.clipboard?.writeText(link)};
  const onRevokeShare = async (id: string) => {
    try {
      await api.onRevokeShare(id);
      setShares(current => current.map(s => s.id === id ? { ...s, status: "revoked" } : s));
    } catch (e) {
      alert("Could not revoke: " + (e as Error).message);
    }
  };
  const listen=()=>{ if("speechSynthesis" in window){ window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${t.creditHealth}. 74 ${t.outOf}. ${t.tip}`)); } };
  const navigate=(next:View)=>{setView(next);setMenuOpen(false);window.scrollTo({top:0,behavior:"smooth"})};

  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur"><div className="mx-auto grid min-h-[72px] max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 md:px-6"><button className="flex min-w-0 items-center gap-3 text-left" onClick={()=>navigate("dashboard")}><span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground"><ShieldCheck className="size-6"/></span><span className="min-w-0"><strong className="block truncate text-base">{t.appName}</strong><span className="block truncate text-xs text-muted-foreground">{t.business}</span></span></button>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">{nav.map(({id,label,icon:Icon})=><Button key={id} size="sm" variant={view===id?"soft":"ghost"} onClick={()=>navigate(id)}><Icon className="size-4"/>{label}</Button>)}</nav>
      <div className="flex shrink-0 items-center gap-2"><Button size="icon" variant="secondary" aria-label={t.listen} title={t.listen} onClick={listen}><Headphones className="size-5"/></Button><label className="relative hidden sm:block"><span className="sr-only">{t.language}</span><select value={language} onChange={e=>setLanguage(e.target.value as Language)} className="min-h-12 appearance-none rounded-md border border-input bg-card pl-3 pr-9 text-sm font-semibold outline-hidden focus:ring-3 focus:ring-ring"><option value="en">English</option><option value="mr">मराठी</option><option value="hi">हिंदी</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2"/></label><Button size="icon" variant="ghost" className="lg:hidden" aria-label={menuOpen?t.close:t.menu} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</Button></div>
    </div>{menuOpen&&<div className="border-t border-border bg-card px-4 py-3 lg:hidden"><div className="mb-3 sm:hidden"><label className="text-xs font-bold text-muted-foreground">{t.language}</label><select value={language} onChange={e=>setLanguage(e.target.value as Language)} className="mt-1 min-h-12 w-full rounded-md border border-input bg-card px-3"><option value="en">English</option><option value="mr">मराठी</option><option value="hi">हिंदी</option></select></div>{nav.map(({id,label,icon:Icon})=><Button key={id} variant={view===id?"soft":"ghost"} className="w-full justify-start" onClick={()=>navigate(id)}><Icon className="size-5"/>{label}</Button>)}</div>}</header>

    {view==="dashboard"&&<><section className="border-b border-border bg-surface-subtle"><div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 md:px-6"><div className="flex min-w-0 items-center gap-3"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-terracotta-soft text-terracotta"><UserRound/></span><div className="min-w-0"><p className="truncate text-lg font-bold">{t.hello}</p><p className="truncate text-sm text-muted-foreground">{t.business} · {t.updated}</p></div></div><span className="hidden rounded-full bg-verified-soft px-3 py-1.5 text-xs font-bold text-verified sm:block">Evidence growing</span></div></section><Dashboard t={t} onShare={()=>navigate("consent")}/><section className="bg-primary px-4 py-10 text-primary-foreground"><blockquote className="mx-auto max-w-4xl text-center text-xl font-semibold leading-9 md:text-2xl">“{t.pitch}”</blockquote></section></>}
    {view==="consent"&&<ConsentForm t={t} onBack={()=>navigate("dashboard")} onCreateLink={onCreateLink}/>}
    {view==="created"&&created&&<LinkCreated t={t} share={created} onCopyLink={onCopyLink} onDone={()=>navigate("dashboard")} onViewLinks={()=>navigate("shares")}/>}
    {view==="shares"&&<SharedLinksList t={t} shares={shares} onBack={()=>navigate("dashboard")} onSharePassport={()=>navigate("consent")} onRevokeShare={onRevokeShare}/>}
    {view==="lender"&&<LenderView t={t}/>}
  </div>;
}

