// Drop this file into src/lib/api.ts. Set VITE_API_URL in .env (e.g. http://localhost:8000).
const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export type Sections = { score: boolean; charts: boolean; confidence: boolean };
export type Share = {
  id: string;
  lenderLabel: string;
  sections: Sections;
  durationLabel: "24 hours" | "7 days" | "30 days";
  createdAt: string;
  expiresAt: string;
  status: "active" | "expired" | "revoked";
  link: string | null; // only set right after creation
  openCount: number;
  lastOpenedAt: string | null; // ISO time, format it in the UI
};

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.detail ?? res.statusText), { status: res.status });
  }
  return res.json();
}
const json = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const api = {
  seedDemo: () => call("/api/demo/seed", { method: "POST" }),
  addSale: (amount: number, kind: "sale" | "shg" | "emi" | "chit" = "sale") =>
    call("/api/transactions", json({ amount, kind })),
  uploadCsv: (file: File) => {
    const f = new FormData();
    f.append("file", file);
    return call<{ imported: number }>("/api/transactions/upload", { method: "POST", body: f });
  },
  getScore: () => call<any>("/api/score"),
  // wire these to your stubs:
  onCreateLink: (lenderLabel: string, sections: Sections, durationLabel: Share["durationLabel"]) =>
    call<Share>("/api/shares", json({ lenderLabel, sections, durationLabel })),
  listShares: () => call<Share[]>("/api/shares"),
  onRevokeShare: (id: string) => call<Share>(`/api/shares/${id}/revoke`, { method: "POST" }),
  // lender page at /p/$token:
  getPublicPassport: (token: string) => call<any>(`/api/public/${token}`),
};

// onCopyLink needs no backend: navigator.clipboard.writeText(share.link)
