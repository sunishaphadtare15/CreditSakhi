# Credit Passport frontend prototype

## Build
- Replace the blank page with a mobile-first borrower dashboard using the specified teal, terracotta, gold, sage, and warm-neutral visual system.
- Add reusable controls and data visualizations for business data entry, the 0–100 score, six explainable factors, coaching, sales trends, activity, and cash flow.
- Implement the full three-step sharing flow with `ConsentForm`, `LinkCreated`, and `SharedLinksList`, including copy, WhatsApp sharing, expiry selection, and working revoke confirmation.
- Add a read-only lender passport view with authenticity, confidence, factor summaries, and limitations.

## Product behavior
- Keep all sample sharing records in one exported `mockShares` data model.
- Keep all visible interface copy in one `translations` dictionary for English, Marathi, and Hindi.
- Use named `onCreateLink`, `onCopyLink`, and `onRevokeShare` handlers so future service integration is straightforward.
- Make language switching, data-entry dialogs, tab navigation, sharing, copying, and revocation interactive without adding accounts or backend storage.

## Quality checks
- Preserve accessible labels, keyboard operation, contrast, and 48px primary touch targets.
- Verify the primary dashboard-to-share flow and lender view on desktop and mobile.
- Add app-specific page metadata and confirm the preview builds without errors.

## Technical details
- Build within the existing TanStack Start route structure and Tailwind v4 design tokens.
- Use Recharts for charts, Radix primitives for accessible dialogs/switches/selects, and Lucide for icons.
- Keep structural product components in focused source modules, with the home route composing the full experience.
