# Credit Companion

Act as a Principal Product Designer and Lead UI/UX Engineer. Design and prototype a clean, accessible, mobile-first web app frontend for a hackathon project: "Credit Passport for Women Micro-Entrepreneurs".

================================================================================

1. CONTEXT & PROBLEM STATEMENT

================================================================================

Millions of women in India run steady micro-businesses (tiffin services, tailoring, home bakeries) with consistent earnings recorded in notebooks and UPI transactions. However, formal financial institutions meet only 27% of the financing demand of women-owned MSMEs in India (IFC study, 2014/2017). IFC estimates the financing gap at $158 billion (~49% of India's total MSME finance gap), and ~90% of women entrepreneurs have never availed formal finance due to lack of traditional collateral, unreadable non-standard records, and lender-side gender bias.

CORE INSIGHT: The gap is not creditworthiness—it is proof of creditworthiness in a form lenders trust. This app builds that evidence layer by taking data she already has and converting it into an explainable 0–100 score, coaching tips, and a shareable, tamper-proof "Credit Passport."

PITCH LINE TO INCLUDE: "She doesn't lack creditworthiness. She lacks proof. The Credit Passport turns her daily hustle into evidence a lender can trust, and into a plan she can act on."

================================================================================

2. DESIGN SYSTEM & VISUAL STYLE GUIDE

================================================================================

- Look & Feel: Ultra-clean, uncluttered, highly navigable, approachable, and trustworthy.

- Target Audience: Low-literacy to moderately tech-literate women micro-entrepreneurs. High contrast, large icons, voice labels, minimal prose, large touch targets (minimum 48px height).

- Color Palette:

  * Primary (Trust & Growth): Deep Teal / Forest Emerald (#0F5A47)

  * Secondary / Accents: Warm Terracotta (#E07A5F) & Warm Gold (#F4A261)

  * Backgrounds: Warm Off-White (#FAFAFA / #F4F6F5)

  * Card Surfaces: Pure White (#FFFFFF) with subtle border (#E5E7EB) and soft shadow

  * Data Tiers: Verified Tier = Sage Green (#2A9D8F); Self-Reported Tier = Muted Amber (#E9C46A)

  * Destructive / Alert: Rose Red (#E63946)

  * Text: Dark Charcoal (#1D2D44) for primary text; Muted Gray (#6C757D) for subtext

- Typography: Clear, readable sans-serif font (Poppins or Noto Sans) supporting English, Hindi (हिंदी), and Marathi (मराठी).

================================================================================

3. USER FLOWS & SCREEN SPECIFICATIONS

================================================================================

--------------------------------------------------------------------------------

FLOW A: BORROWER DASHBOARD & SCORE (WOMAN ENTREPRENEUR)

--------------------------------------------------------------------------------

1. Header & Language Bar:

   - Voice assistance button ("Listen" icon) next to profile header.

   - High-visibility language dropdown: [ English | मराठी | हिंदी ].

2. Data Input Card:

   - Section Title: "Add Your Business Data"

   - Option 1 (Verified Tier): [Upload UPI / Bank Statement CSV] (Tagged with Sage Green badge "Verified Data").

   - Option 2 (Self-Reported Tier): Quick button [+ Record Sales] with large numeric keypad and quick-add chips (+₹100, +₹500, +₹1,000).

   - Optional Inputs: [Record SHG Contribution], [Record EMI / Savings], [Record Chit Entry].

3. Credit Score Card (0–100 Scale):

   - Hero Score Meter showing score (e.g., "74 / 100 - Good Credit Health").

   - 6 Factor Breakdown rows with Plain-Language Explanations and Confidence Badges [Verified / Self-Reported]:

     a. Revenue Consistency: Month-to-month income variation ("Sales steady in 5 of last 6 months (+14 pts)")

     b. Growth Trend: Sales direction over time ("Sales grew 8% this quarter")

     c. Activity Regularity: Active business days ("Active 24 days per month")

     d. Customer Diversity: Unique payers ("18 unique UPI payers")

     e. Repayment & Saving Behavior: SHG/EMI history ("100% SHG EMIs paid on time")

     f. Cash-Flow Buffer: Inflows vs outflows ("Inflows exceed outflows by 22%")

4. Coaching & Improvement Tips ("The Coach"):

   - Amber highlight box with lightbulb icon: "Tip: Your sales dip at month-end. Collecting advance orders can stabilize your cash flow and boost your score by up to 8 points."

5. Visual Analytics:

   - Monthly Sales Trend (Line Graph)

   - Weekly Activity Heatmap (Grid of business days)

   - Inflow vs Outflow Comparison (Bar Chart)

6. Primary Action Footer:

   - Prominent sticky button: "Generate & Share Credit Passport" (Deep Teal background, lock/shield icon).

--------------------------------------------------------------------------------

FLOW B: CONSENT CONTROL & SHARING (3-STEP SYSTEM)

--------------------------------------------------------------------------------

SCREEN B1: "Share Passport" (Consent Form / Component: ConsentForm)

- Header: "Share your Credit Passport" | Short line: "You decide who sees it and for how long."

- Text Input: "Who is this for?" (Placeholder: "e.g. Bank of Maharashtra, Pune branch").

- Section: "What can they see?" (Toggle switches, all ON by default):

  * [Toggle ON] Score and factor breakdown (Icon: Gauge)

  * [Toggle ON] Charts and trends (Icon: Bar Chart)

  * [Toggle ON] Data confidence labels: verified / self-reported (Icon: Shield Check)

  Each toggle has a clear icon and a 1-line description.

- Section: "For how long?" Three large selectable segmented buttons:

  * [24 hours] | [7 days (Default)] | [30 days]

- Privacy Notice: Light gray box with lock icon: "Lenders never see your raw transactions, customer names or phone numbers."

- Primary Action Button: "Create share link" (Full width, Teal).

SCREEN B2: "Link created" (Success State / Component: LinkCreated)

- Header / Icon: Success Checkmark icon with text "Link Ready!"

- Generated Link Box: Read-only box displaying "https://yourapp.com/p/x8Kq2mZ9vT4rLp7W"

- Action Buttons:

  * [Copy link] (Secondary outline button)

  * [Share on WhatsApp] (Primary green button with WhatsApp icon)

- Summary Card: Shows recipient label ("Bank of Maharashtra, Pune branch"), sections included, and exact expiry date ("Expires Oct 11, 2026 at 6:00 PM").

- Navigation Button: "Done / View Shared Links".

SCREEN B3: "My shared links" (Consent Manager / Component: SharedLinksList)

- List of share cards, each showing:

  * Lender/Recipient label

  * Badges for shared sections ("Score", "Trends", "Confidence Tiers")

  * Status Badge: [Active - Green] | [Expired - Gray] | [Revoked - Red]

  * Expiry date and access log ("Opened 2 times, last opened Tuesday 4 PM")

  * Active cards feature a red outline button: "Revoke access"

- Revoke Confirmation Modal Dialog:

  * Title: "Stop sharing?"

  * Message: "This link will stop working immediately for Bank of Maharashtra."

  * Buttons: [Cancel] | [Confirm Revoke]

  * Behavior: On confirm, status badge changes to "Revoked" and the revoke button disappears.

- Empty State View: "You haven't shared your passport yet." with a button to "Share Passport".

--------------------------------------------------------------------------------

FLOW C: LENDER READ-ONLY VIEW (PUBLIC LINK SCREEN)

--------------------------------------------------------------------------------

1. Authenticity Header:

   - Banner with Green Shield Badge: "Verified Authentic: Unchanged since generation on Oct 4, 2026".

2. Overview Card:

   - Business ID / Alias, Overall Score (0–100), and Data Confidence Breakdown (% Verified vs Self-Reported).

3. Factor & Trend Summary Table:

   - Displays scores, metrics, and confidence badges side-by-side.

4. Honest Limitations Panel (Muted Gray Footer Card):

   - Clear 3-point disclaimer:

     1. "The score is an explainable supporting document, not an automated lending decision."

     2. "Self-reported entries are clearly segmented from bank/UPI-verified data."

     3. "Scoring weights are calibrated for pilot evaluation against micro-business repayment data."

================================================================================

4. TECHNICAL & ARCHITECTURAL REQUIREMENTS

================================================================================

- UI Architecture: Responsive, mobile-first, modular React architecture styled with Tailwind CSS or clean CSS.

- Component Isolation: Build separate, clearly named components:

  1. `ConsentForm`

  2. `LinkCreated`

  3. `SharedLinksList`

- State Management (Single File Data Model): Keep ALL sample data in a single file/object named `mockShares` with exact field structure:

  {

    id: "share-101",

    lenderLabel: "Bank of Maharashtra, Pune branch",

    sections: { score: true, charts: true, confidence: true },

    durationLabel: "7 days",

    createdAt: "2026-10-04T10:00:00Z",

    expiresAt: "2026-10-11T10:00:00Z",

    status: "active", // "active" | "expired" | "revoked"

    link: "https://yourapp.com/p/x8Kq2mZ9vT4rLp7W",

    openCount: 2,

    lastOpenedAt: "Tuesday 4 PM"

  }

- Explicit Functions: Attach click handlers to clearly named function stubs (`onCreateLink`, `onCopyLink`, `onRevokeShare`) so a backend API can easily be hooked up later.

- Localization Object: Use a single `translations` dictionary object for all UI strings to support English, Marathi, and Hindi seamlessly.

- Exclusions: Do NOT add complex auth/login flows, QR code generators, or complex backend logic. Keep focus on a pristine frontend experience.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://credit-passport-she.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/32062a4c-44dd-57cc-9da4-a9c8153e215c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
