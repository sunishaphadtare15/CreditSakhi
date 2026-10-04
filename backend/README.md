# CreditSakhi backend

```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Interactive docs: http://localhost:8000/docs

Env vars: `PUBLIC_URL` (frontend origin used in share links, default http://localhost:5173), `CORS_ORIGINS` (default `*`), `DB_PATH`.

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| POST | /api/demo/seed | load sample tiffin-business data |
| POST | /api/transactions/upload | CSV upload (date YYYY-MM-DD, description, amount, party) |
| POST | /api/transactions | manual sale, or kind = shg / emi / chit |
| GET | /api/score | 0-100 score, 6 factors with tiers, tips, chart data |
| POST | /api/shares | create share link (lenderLabel, sections, durationLabel) |
| GET | /api/shares | list shares with status, open count, last opened |
| POST | /api/shares/{id}/revoke | revoke instantly |
| GET | /api/public/{token} | lender view; 404 unknown, 410 revoked or expired |

## How authenticity works
Creating a share saves a frozen snapshot of the score and its SHA-256 hash. Only a hash of the link token is stored. The lender endpoint recomputes the snapshot hash and returns `authentic`, filters fields by the sections the borrower allowed, and never returns raw transactions.

## Known limits
Single demo user (no login), SQLite file storage, no rate limiting. Weights are uncalibrated.
