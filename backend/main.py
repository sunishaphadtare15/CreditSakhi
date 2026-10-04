"""CreditSakhi API. Run: uvicorn main:app --reload --port 8000
Single demo user (no login, per the frontend spec). SQLite file: credit.db"""
import csv, hashlib, io, json, os, random, re, secrets, sqlite3, statistics
from datetime import date, datetime, timedelta, timezone

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB = os.getenv("DB_PATH", "credit.db")
PUBLIC_URL = os.getenv("PUBLIC_URL", "http://localhost:8081")  # frontend origin used in share links
DUR = {"24 hours": 1, "7 days": 7, "30 days": 30}

app = FastAPI(title="CreditSakhi API")
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
                   allow_methods=["*"], allow_headers=["*"])


def db():
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    return c


with db() as _c:
    _c.executescript("""
    CREATE TABLE IF NOT EXISTS tx(id INTEGER PRIMARY KEY, date TEXT, descr TEXT, amt REAL, party TEXT, src TEXT, kind TEXT);
    CREATE TABLE IF NOT EXISTS shares(id TEXT PRIMARY KEY, token_hash TEXT UNIQUE, lender TEXT, sections TEXT,
      duration TEXT, created TEXT, expires TEXT, revoked INTEGER DEFAULT 0, snapshot TEXT, snap_hash TEXT,
      opens INTEGER DEFAULT 0, last_opened TEXT);""")

now = lambda: datetime.now(timezone.utc)
iso = lambda d: d.isoformat(timespec="seconds").replace("+00:00", "Z")
parse = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))
sha = lambda s: hashlib.sha256(s.encode()).hexdigest()
clamp = lambda x: max(0.0, min(1.0, x))


# ---------------- data intake ----------------
class SaleIn(BaseModel):
    amount: float
    kind: str = "sale"  # sale | shg | emi | chit
    date: str | None = None


@app.post("/api/transactions")
def add_tx(b: SaleIn):
    if b.kind not in ("sale", "shg", "emi", "chit") or b.amount <= 0:
        raise HTTPException(400, "kind must be sale/shg/emi/chit and amount > 0")
    d = b.date or date.today().isoformat()
    with db() as c:
        c.execute("INSERT INTO tx(date,descr,amt,party,src,kind) VALUES(?,?,?,?,?,?)",
                  (d, f"Manual {b.kind}", b.amount, "Walk-in", "manual", b.kind))
    return {"ok": True}


@app.post("/api/transactions/upload")
async def upload(file: UploadFile = File(...)):
    text = (await file.read()).decode("utf-8-sig", errors="replace")
    rd = csv.DictReader(io.StringIO(text))
    col = lambda r, *names: next((v for k, v in r.items() if k and any(n in k.lower() for n in names)), "")
    n = 0
    with db() as c:
        for r in rd:
            try:
                d, a = col(r, "date")[:10], float(col(r, "amount").replace(",", ""))
                date.fromisoformat(d)
            except ValueError:
                continue
            desc = col(r, "desc", "narr").strip()
            c.execute("INSERT INTO tx(date,descr,amt,party,src,kind) VALUES(?,?,?,?,?,?)",
                      (d, desc, a, (col(r, "party") or desc).strip(), "csv", "sale"))
            n += 1
    if n == 0:
        raise HTTPException(400, "No valid rows. Need columns: date (YYYY-MM-DD), description, amount, party (optional)")
    return {"imported": n}


@app.post("/api/demo/seed")
def seed():
    r, rows = random.Random(7), []
    names = ["Sunita", "Meena", "Raju", "Anil", "Pooja", "Vikas", "Asha", "Kiran", "Deepak", "Nisha", "Ravi", "Sana"]
    for m in range(4, 10):
        for d in range(1, 29):
            ds = f"2026-{m:02d}-{d:02d}"
            if r.random() < (0.45 if d >= 24 else 0.88):
                for _ in range(r.randint(1, 3)):
                    p = r.choice(names[: 6 + m - 3])
                    rows.append((ds, f"UPI/{p}/{r.randint(1, 999999)}", round((90 + r.random() * 140) * (1 + (m - 4) * .04)), p, "csv", "sale"))
            if d % 7 == 2: rows.append((ds, "Vegetable mandi", -round(2000 + r.random() * 700), "mandi", "csv", "sale"))
            if d == 12: rows.append((ds, "School fees", -2000, "school", "csv", "sale"))
            if d == 5:
                rows.append((ds, "EMI payment", 1500, "bank", "manual", "emi"))
                rows.append((ds, "SHG contribution", 500, "shg", "manual", "shg"))
    with db() as c:
        c.execute("DELETE FROM tx")
        c.executemany("INSERT INTO tx(date,descr,amt,party,src,kind) VALUES(?,?,?,?,?,?)", rows)
    return {"seeded": len(rows)}


@app.delete("/api/transactions")
def reset():
    with db() as c:
        c.execute("DELETE FROM tx")
    return {"ok": True}


# ---------------- scoring ----------------
PERS = re.compile(r"rent|school|grocer|recharge|family|brother|sister|self|salary|medical", re.I)


def compute() -> dict:
    with db() as c:
        rows = [dict(r) for r in c.execute("SELECT * FROM tx")]
    seen, clean, dup, pers = set(), [], 0, 0
    for r in rows:
        k = (r["date"], r["descr"], r["amt"])
        if r["src"] == "csv":
            if k in seen: dup += 1; continue
            seen.add(k)
        if r["kind"] == "sale" and PERS.search(r["descr"] or ""): pers += 1; continue
        clean.append(r)
    cash = [r for r in clean if r["kind"] == "sale"]
    inf, out = [r for r in cash if r["amt"] > 0], [r for r in cash if r["amt"] < 0]
    ms = sorted({r["date"][:7] for r in cash})[-6:]
    if len(ms) < 2:
        raise HTTPException(400, "Need at least 2 months of sales data to score.")
    inf = [r for r in inf if r["date"][:7] in ms]
    m = [{"month": k, "inflow": sum(r["amt"] for r in inf if r["date"][:7] == k),
          "outflow": -sum(r["amt"] for r in out if r["date"][:7] == k)} for k in ms]
    iv, n = [x["inflow"] for x in m], len(m)
    mean = statistics.fmean(iv)
    cv = statistics.pstdev(iv) / mean if mean else 1
    xm = (n - 1) / 2
    slope = sum((j - xm) * (v - mean) for j, v in enumerate(iv)) / sum((j - xm) ** 2 for j in range(n))
    gr = slope / mean if mean else 0
    days = sorted({r["date"] for r in inf})
    weeks = len({date.fromisoformat(d).toordinal() // 7 for d in days})
    act = clamp(weeks / (n * 4.35))
    parties = len({r["party"] for r in inf})
    pos = sum(1 for x in m if x["inflow"] > x["outflow"])
    rep_months = len({r["date"][:7] for r in clean if r["kind"] in ("shg", "emi", "chit") and r["date"][:7] in ms})
    ver = "verified" if sum(r["src"] == "csv" for r in inf) >= len(inf) / 2 else "self-reported"
    spec = [("consistency", "Revenue consistency", 20, clamp(1 - cv / .5), ver, f"Income varied {cv*100:.0f}% month to month."),
            ("growth", "Growth trend", 15, clamp(.5 + gr * 5), ver, f"Sales moved {gr*100:.1f}% per month on average."),
            ("activity", "Activity regularity", 15, act, ver, f"You had sales in about {act*100:.0f}% of weeks."),
            ("diversity", "Customer diversity", 15, clamp(parties / 12), ver, f"{parties} different people paid you."),
            ("repayment", "Repayment and saving", 20, clamp(rep_months / n), "self-reported", f"You recorded SHG/EMI/chit payments in {rep_months} of {n} months."),
            ("buffer", "Cash-flow buffer", 15, pos / n, ver, f"Inflows beat outflows in {pos} of {n} months.")]
    tips = {"consistency": "Sales swing between months. Regular customers or advance orders could steady them.",
            "growth": "Sales are flat or falling. Try one new product or a bulk customer nearby.",
            "activity": "Some weeks have no sales. Record sales every day, even small ones.",
            "diversity": "Few people pay you. Ask customers to pay by UPI and widen your regular buyers.",
            "repayment": "Pay SHG, EMI or chit on time and record it every month.",
            "buffer": "Money out is close to money in. Cut or delay one cost to build a buffer."}
    F = [{"key": k, "name": nm, "points": round(w * s), "max": w, "tier": t,
          "note": f"{d} {'This helped' if s >= .65 else 'This held you back'}: {round(w*s)} of {w} points.", "_s": s}
         for k, nm, w, s, t, d in spec]
    low = [f["key"] for f in sorted(F, key=lambda f: f["_s"])[:2]]
    for f in F: del f["_s"]
    return {"score": sum(f["points"] for f in F), "factors": F, "months": m, "activeDays": days,
            "tips": [tips[k] for k in low], "cleaning": {"duplicates": dup, "personal": pers}}


@app.get("/api/score")
def score():
    return compute()


# ---------------- share links ----------------
class ShareIn(BaseModel):
    lenderLabel: str
    sections: dict[str, bool] = {"score": True, "charts": True, "confidence": True}
    durationLabel: str = "7 days"


def shape(r, link=None):
    st = "revoked" if r["revoked"] else ("expired" if now() > parse(r["expires"]) else "active")
    return {"id": r["id"], "lenderLabel": r["lender"], "sections": json.loads(r["sections"]),
            "durationLabel": r["duration"], "createdAt": r["created"], "expiresAt": r["expires"], "status": st,
            "link": link, "openCount": r["opens"], "lastOpenedAt": r["last_opened"]}


@app.post("/api/shares")
def create_share(b: ShareIn):
    if not b.lenderLabel.strip() or b.durationLabel not in DUR:
        raise HTTPException(400, f"lenderLabel required; durationLabel one of {list(DUR)}")
    snap = compute()
    sid, token = "share-" + secrets.token_hex(3), secrets.token_urlsafe(16)
    snap.update(business=f"Business #{secrets.token_hex(2).upper()}", generatedAt=iso(now()))
    sj = json.dumps(snap, sort_keys=True, separators=(",", ":"))
    with db() as c:
        c.execute("INSERT INTO shares(id,token_hash,lender,sections,duration,created,expires,snapshot,snap_hash) VALUES(?,?,?,?,?,?,?,?,?)",
                  (sid, sha(token), b.lenderLabel.strip()[:80], json.dumps(b.sections), b.durationLabel, iso(now()),
                   iso(now() + timedelta(days=DUR[b.durationLabel])), sj, sha(sj)))
        r = c.execute("SELECT * FROM shares WHERE id=?", (sid,)).fetchone()
    return shape(r, f"{PUBLIC_URL}/p/{token}")  # raw token is returned once; only its hash is stored


@app.get("/api/shares")
def list_shares():
    with db() as c:
        return [shape(r) for r in c.execute("SELECT * FROM shares ORDER BY created DESC")]


@app.post("/api/shares/{sid}/revoke")
def revoke(sid: str):
    with db() as c:
        if not c.execute("UPDATE shares SET revoked=1 WHERE id=?", (sid,)).rowcount:
            raise HTTPException(404, "Share not found")
        return shape(c.execute("SELECT * FROM shares WHERE id=?", (sid,)).fetchone())


@app.get("/api/public/{token}")
def public(token: str):
    with db() as c:
        r = c.execute("SELECT * FROM shares WHERE token_hash=?", (sha(token),)).fetchone()
        if not r: raise HTTPException(404, "Link not found")
        st = shape(r)["status"]
        if st != "active": raise HTTPException(410, f"This link is {st}.")
        c.execute("UPDATE shares SET opens=opens+1,last_opened=? WHERE id=?", (iso(now()), r["id"]))
    snap, sec = json.loads(r["snapshot"]), json.loads(r["sections"])
    authentic = sha(r["snapshot"]) == r["snap_hash"]  # snapshot untouched since generation
    vmax = sum(f["max"] for f in snap["factors"] if f["tier"] == "verified")
    res = {"authentic": authentic, "hash": r["snap_hash"], "generatedAt": snap["generatedAt"],
           "expiresAt": r["expires"], "business": snap["business"], "sections": sec}
    if sec.get("score"):
        res["score"] = snap["score"]
        res["factors"] = [{k: v for k, v in f.items() if sec.get("confidence") or k != "tier"} for f in snap["factors"]]
    if sec.get("charts"): res["months"], res["activeDays"] = snap["months"], snap["activeDays"]
    if sec.get("confidence"):
        tot = sum(f["max"] for f in snap["factors"])
        res["confidence"] = {"verifiedPct": round(100 * vmax / tot), "selfReportedPct": 100 - round(100 * vmax / tot)}
    return res  # never includes raw transactions, names or phone numbers
