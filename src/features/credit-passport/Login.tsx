import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export type User = { name: string; business: string; profile: "tiffin" | "tailor" | "bakery"; empty?: boolean };
type Account = User & { email: string; password: string; note: string };

const PASSWORD = "demo123";
const DEMO: Account[] = [
  { email: "asha@creditsakhi.demo", password: PASSWORD, name: "Asha", business: "Asha's Tiffin Service", profile: "tiffin", note: "Steady daily sales" },
  { email: "meena@creditsakhi.demo", password: PASSWORD, name: "Meena", business: "Meena Tailoring Works", profile: "tailor", note: "Irregular sales" },
  { email: "pooja@creditsakhi.demo", password: PASSWORD, name: "Pooja", business: "Pooja's Home Bakery", profile: "bakery", note: "Growing sales" },
];
const saved = (): Account[] => { try { return JSON.parse(localStorage.getItem("sakhi_accounts") ?? "[]"); } catch { return []; } };
const field = "mt-1 min-h-12 w-full rounded-md border border-input bg-background px-4 text-foreground outline-hidden focus:ring-3 focus:ring-ring";

export function Login({ onLogin }: { onLogin: (u: User) => Promise<void> | void }) {
  const [mode, setMode] = useState<"in" | "up">("in");
   const [email, setEmail] = useState(DEMO[0]!.email);
  const [password, setPassword] = useState(PASSWORD);
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

 const go = async (a: Account) => { setBusy(true); await onLogin({ name: a.name, business: a.business, profile: a.profile, empty: a.empty ?? false }); setBusy(false); };
  const signIn = () => {
    const a = [...DEMO, ...saved()].find((x) => x.email === email.trim().toLowerCase() && x.password === password);
    if (!a) return setError("Email or password is not right. Try a demo account below.");
    setError(""); void go(a);
  };
  const signUp = () => {
    const e = email.trim().toLowerCase();
    if (!name.trim() || !business.trim() || !e || password.length < 4) return setError("Fill in every box. Password needs 4 or more characters.");
    if ([...DEMO, ...saved()].some((x) => x.email === e)) return setError("This email already has an account. Sign in instead.");
    const a: Account = { email: e, password, name: name.trim(), business: business.trim(), profile: "tiffin", empty: true, note: "" };
    localStorage.setItem("sakhi_accounts", JSON.stringify([...saved(), a]));
    setError(""); void go(a);
  };

  return <main className="grid min-h-screen place-items-center bg-surface-subtle px-4 py-8">
    <div className="w-full max-w-md">
      <div className="mb-6 text-center"><span className="mx-auto grid size-14 place-items-center rounded-lg bg-primary text-primary-foreground"><ShieldCheck className="size-8" /></span><h1 className="mt-3 text-3xl font-bold">CreditSakhi</h1><p className="mt-1 text-muted-foreground">Your daily hustle, turned into proof a lender can trust.</p></div>
      <div className="rounded-lg border border-border bg-card p-5 shadow-card">
         <div className="mb-4 grid grid-cols-2 gap-2">{(["in", "up"] as const).map((m) => <button key={m} type="button" onClick={() => { setMode(m); setError(""); if (m === "up") { setEmail(""); setPassword(""); } else { setEmail(DEMO[0]!.email); setPassword(PASSWORD); } }} className={`min-h-12 rounded-md border text-sm font-bold ${mode === m ? "border-primary bg-primary-soft text-primary" : "border-border bg-background"}`}>{m === "in" ? "Sign in" : "Create account"}</button>)}</div>
        {mode === "up" && <><label className="text-sm font-bold">Your name<input value={name} onChange={(e) => setName(e.target.value)} className={field} /></label><label className="mt-3 block text-sm font-bold">Business name<input value={business} onChange={(e) => setBusiness(e.target.value)} className={field} /></label></>}
        <label className="mt-3 block text-sm font-bold">Email<input value={email} onChange={(e) => setEmail(e.target.value)} className={field} /></label>
        <label className="mt-3 block text-sm font-bold">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} /></label>
        {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}
        <Button className="mt-4 w-full" disabled={busy} onClick={mode === "in" ? signIn : signUp}>{busy ? "Loading..." : mode === "in" ? "Sign in" : "Create account"}</Button>
        {mode === "up" && <p className="mt-3 text-xs text-muted-foreground">A new account starts empty. Upload a CSV from the sample files to see a score.</p>}
      </div>
      {mode === "in" && <div className="mt-4 rounded-lg border border-border bg-card p-4"><p className="text-xs font-bold uppercase text-muted-foreground">Demo accounts (password {PASSWORD})</p><div className="mt-2 grid gap-2">{DEMO.map((a) => <button key={a.email} type="button" disabled={busy} onClick={() => void go(a)} className="flex min-h-12 items-center justify-between rounded-md border border-border bg-background px-3 text-left text-sm hover:bg-muted"><span><strong>{a.business}</strong><span className="block text-xs text-muted-foreground">{a.note}</span></span><span className="text-xs font-bold text-primary">Open</span></button>)}</div></div>}
      <p className="mt-4 text-center text-xs text-muted-foreground">Prototype with demo data only. Passwords here are not secured. <a className="font-semibold text-primary underline" href="/help">Help guide</a></p>
    </div>
  </main>;
}
