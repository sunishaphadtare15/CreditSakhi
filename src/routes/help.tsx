import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/help")({ component: HelpGuide });

const steps = [
  ["Add your sales", "Upload a bank or UPI file (CSV), or type your sales in by hand. You can also record SHG, EMI and chit payments."],
  ["See your score", "CreditSakhi turns your records into a score out of 100 and tells you what helped or hurt it."],
  ["Follow the tips", "Each tip is a small step, such as recording savings every month, that can raise your score."],
  ["Share with a lender", "Choose who it is for, what they can see, and for how long. You get a private link."],
  ["Stop sharing any time", "Use Revoke on a link and the lender can no longer open it."],
];

const words: [string, string][] = [
  ["Credit score", "A number from 0 to 100 built from your own sales records. It supports a loan decision; it does not make one."],
  ["Credit Passport", "A report of your score and its reasons that you can share with a lender through a link."],
  ["Verified data", "Records that came from a bank or UPI file. Lenders trust these more."],
  ["Self-reported data", "Sales you typed in yourself. They count, but they are labelled so the lender knows."],
  ["Revenue consistency", "How steady your income is from month to month."],
  ["Growth trend", "Whether your sales are going up, flat or down over time."],
  ["Activity regularity", "How many weeks you had at least one sale."],
  ["Customer diversity", "How many different customers pay you, so you do not depend on one buyer."],
  ["Repayment and saving", "Regular SHG, EMI, chit or savings payments."],
  ["Cash-flow buffer", "Whether more money comes in than goes out."],
  ["Share link", "A private web address for your passport. It stops working when it expires or you revoke it."],
  ["Snapshot", "The passport shows your score as it was when you made the link. Later changes appear only on a new link."],
  ["Authentic", "A check that the report has not been edited since it was created."],
];

function HelpGuide() {
  return (
    <main className="min-h-screen bg-surface-subtle px-4 py-8 md:px-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="flex items-center gap-3">
          <BookOpen className="size-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">CreditSakhi help</h1>
            <p className="text-sm text-muted-foreground">How to use the app, and what each word means.</p>
          </div>
        </header>

        <section className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="mb-3 text-lg font-bold">How it works</h2>
          <ol className="space-y-3">
            {steps.map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                <p><span className="font-semibold">{t}.</span> <span className="text-muted-foreground">{d}</span></p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="mb-3 text-lg font-bold">Your file (CSV)</h2>
          <p className="text-sm text-muted-foreground">One row per sale, with these four columns in the first row:</p>
          <pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-xs">{`date,description,amount,party\n2026-09-01,Tiffin order,120,Customer 4`}</pre>
          <p className="mt-2 text-sm text-muted-foreground">Dates look like 2026-09-01 (year-month-day). Amount is a number in rupees. Party is who paid you.</p>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="mb-3 text-lg font-bold">Words you will see</h2>
          <dl className="divide-y divide-border">
            {words.map(([w, d]) => (
              <div key={w} className="py-2">
                <dt className="font-semibold">{w}</dt>
                <dd className="text-sm text-muted-foreground">{d}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="text-center text-sm"><a href="/" className="font-semibold text-primary underline">Back to the app</a></p>
      </div>
    </main>
  );
}
