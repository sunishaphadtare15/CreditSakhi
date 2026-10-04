export type Language = "en" | "mr" | "hi";
export type ShareStatus = "active" | "expired" | "revoked";

export type ShareRecord = {
  id: string;
  lenderLabel: string;
  sections: { score: boolean; charts: boolean; confidence: boolean };
  durationLabel: string;
  createdAt: string;
  expiresAt: string;
  status: ShareStatus;
  link: string;
  openCount: number;
  lastOpenedAt: string;
};

export const mockShares: ShareRecord[] = [
  {
    id: "share-101",
    lenderLabel: "Bank of Maharashtra, Pune branch",
    sections: { score: true, charts: true, confidence: true },
    durationLabel: "7 days",
    createdAt: "2026-10-04T10:00:00Z",
    expiresAt: "2026-10-11T10:00:00Z",
    status: "active",
    link: "https://yourapp.com/p/x8Kq2mZ9vT4rLp7W",
    openCount: 2,
    lastOpenedAt: "Tuesday 4 PM",
  },
  {
    id: "share-100",
    lenderLabel: "Sahyadri Mahila Co-op Bank",
    sections: { score: true, charts: true, confidence: false },
    durationLabel: "24 hours",
    createdAt: "2026-09-18T08:30:00Z",
    expiresAt: "2026-09-19T08:30:00Z",
    status: "expired",
    link: "https://yourapp.com/p/Q7mR2aL9",
    openCount: 1,
    lastOpenedAt: "Sep 18, 2 PM",
  },
];

const en = {
  appName: "Credit Passport", borrower: "My Passport", shares: "Shared Links", lender: "Lender View", listen: "Listen", hello: "Namaste, Meera", business: "Meera's Tiffin Service", updated: "Updated today", addData: "Add Your Business Data", verifiedData: "Verified Data", upload: "Upload UPI / Bank Statement CSV", uploadHint: "Fastest way to strengthen your score", selfReported: "Self-Reported", recordSales: "Record Sales", addAmount: "Add today's sale", saveSale: "Save sale", cancel: "Cancel", optionalRecords: "Other records", shg: "SHG contribution", emi: "EMI / Savings", chit: "Chit entry", creditHealth: "Your Credit Health", good: "Good", outOf: "out of 100", basedOn: "Based on 6 months of business activity", scoreUp: "+6 points since July", factors: "What builds your score", verified: "Verified", reported: "Self-reported", points: "pts", coach: "The Coach", tip: "Your sales dip at month-end. Collecting advance orders can stabilize your cash flow and boost your score by up to 8 points.", insights: "Your business patterns", salesTrend: "Monthly sales trend", weeklyActivity: "Weekly activity", cashFlow: "Inflow vs outflow", inflow: "Inflow", outflow: "Outflow", activeDays: "Active days", generate: "Generate & Share Credit Passport", shareTitle: "Share your Credit Passport", shareSubtitle: "You decide who sees it and for how long.", whoFor: "Who is this for?", whoPlaceholder: "e.g. Bank of Maharashtra, Pune branch", whatSee: "What can they see?", scoreBreakdown: "Score and factor breakdown", scoreDesc: "Your score and the six reasons behind it", chartsTrends: "Charts and trends", chartsDesc: "Monthly sales, activity and cash flow", confidenceLabels: "Data confidence labels", confidenceDesc: "Verified and self-reported sources", howLong: "For how long?", hours24: "24 hours", days7: "7 days", days30: "30 days", default: "Default", privacy: "Lenders never see your raw transactions, customer names or phone numbers.", createLink: "Create share link", back: "Back", linkReady: "Link Ready!", linkReadyDesc: "Your private passport link is ready to share.", copyLink: "Copy link", copied: "Copied!", whatsapp: "Share on WhatsApp", sharedWith: "Shared with", included: "Included", expires: "Expires Oct 11, 2026 at 6:00 PM", done: "Done", viewLinks: "View Shared Links", myLinks: "My shared links", manageLinks: "See and stop access at any time.", active: "Active", expired: "Expired", revoked: "Revoked", opened: "Opened {count} times, last opened {time}", revoke: "Revoke access", stopSharing: "Stop sharing?", stopMessage: "This link will stop working immediately for {name}.", confirmRevoke: "Confirm Revoke", empty: "You haven't shared your passport yet.", sharePassport: "Share Passport", authentic: "Verified Authentic", unchanged: "Unchanged since generation on Oct 4, 2026", businessId: "Business ID", alias: "Business alias", overallScore: "Overall score", confidence: "Data confidence", verifiedPercent: "72% verified", reportedPercent: "28% self-reported", factorSummary: "Factor and trend summary", factor: "Factor", evidence: "Evidence", source: "Source", limitations: "What this passport means", limitation1: "The score is an explainable supporting document, not an automated lending decision.", limitation2: "Self-reported entries are clearly segmented from bank/UPI-verified data.", limitation3: "Scoring weights are calibrated for pilot evaluation against micro-business repayment data.", pitch: "She doesn't lack creditworthiness. She lacks proof. The Credit Passport turns her daily hustle into evidence a lender can trust, and into a plan she can act on.", close: "Close", amount: "Amount in rupees", salesSaved: "Sale recorded", record: "Record", menu: "Open navigation", language: "Language", dashboard: "Dashboard", stronger: "Strong evidence", selectFile: "Choose CSV file", noFile: "No file selected", fileReady: "Statement ready", today: "Today", month: "Month", rupees: "₹", revenue: "Revenue Consistency", revenueDesc: "Sales steady in 5 of last 6 months", growth: "Growth Trend", growthDesc: "Sales grew 8% this quarter", activity: "Activity Regularity", activityDesc: "Active 24 days per month", diversity: "Customer Diversity", diversityDesc: "18 unique UPI payers", repayment: "Repayment & Saving Behavior", repaymentDesc: "100% SHG EMIs paid on time", buffer: "Cash-Flow Buffer", bufferDesc: "Inflows exceed outflows by 22%", langEnglish: "English", langMarathi: "मराठी", langHindi: "हिंदी"
};

export type Translation = typeof en;
export const translations: Record<Language, Translation> = {
  en,
  mr: { ...en, borrower:"माझे पासपोर्ट", shares:"शेअर केलेल्या लिंक्स", lender:"कर्जदाता दृश्य", listen:"ऐका", hello:"नमस्कार, मीरा", updated:"आज अपडेट केले", addData:"तुमच्या व्यवसायाची माहिती जोडा", upload:"UPI / बँक स्टेटमेंट CSV अपलोड करा", recordSales:"विक्री नोंदवा", creditHealth:"तुमचे क्रेडिट आरोग्य", good:"चांगले", factors:"तुमचा स्कोअर कशाने बनतो", coach:"तुमचा मार्गदर्शक", insights:"तुमच्या व्यवसायाचे नमुने", generate:"क्रेडिट पासपोर्ट तयार करा आणि शेअर करा", shareTitle:"तुमचा क्रेडिट पासपोर्ट शेअर करा", shareSubtitle:"कोण पाहू शकते आणि किती काळ, हे तुम्ही ठरवा.", whoFor:"हे कोणासाठी आहे?", whatSee:"ते काय पाहू शकतात?", howLong:"किती काळासाठी?", createLink:"शेअर लिंक तयार करा", linkReady:"लिंक तयार!", copyLink:"लिंक कॉपी करा", whatsapp:"WhatsApp वर शेअर करा", myLinks:"माझ्या शेअर केलेल्या लिंक्स", revoke:"प्रवेश थांबवा", authentic:"सत्यापित आणि अस्सल", dashboard:"डॅशबोर्ड" },
  hi: { ...en, borrower:"मेरा पासपोर्ट", shares:"शेयर किए लिंक", lender:"ऋणदाता दृश्य", listen:"सुनें", hello:"नमस्ते, मीरा", updated:"आज अपडेट किया", addData:"अपने व्यवसाय का डेटा जोड़ें", upload:"UPI / बैंक स्टेटमेंट CSV अपलोड करें", recordSales:"बिक्री दर्ज करें", creditHealth:"आपकी क्रेडिट स्थिति", good:"अच्छी", factors:"आपका स्कोर कैसे बनता है", coach:"आपका मार्गदर्शक", insights:"आपके व्यवसाय के पैटर्न", generate:"क्रेडिट पासपोर्ट बनाएं और शेयर करें", shareTitle:"अपना क्रेडिट पासपोर्ट शेयर करें", shareSubtitle:"कौन देख सकता है और कितने समय तक, यह आप तय करती हैं।", whoFor:"यह किसके लिए है?", whatSee:"वे क्या देख सकते हैं?", howLong:"कितने समय के लिए?", createLink:"शेयर लिंक बनाएं", linkReady:"लिंक तैयार!", copyLink:"लिंक कॉपी करें", whatsapp:"WhatsApp पर शेयर करें", myLinks:"मेरे शेयर किए लिंक", revoke:"पहुंच रोकें", authentic:"सत्यापित और असली", dashboard:"डैशबोर्ड" },
};

export const factorData = [
  { key: "revenue", desc: "revenueDesc", score: 14, max: 16, confidence: "verified" },
  { key: "growth", desc: "growthDesc", score: 11, max: 16, confidence: "verified" },
  { key: "activity", desc: "activityDesc", score: 13, max: 16, confidence: "verified" },
  { key: "diversity", desc: "diversityDesc", score: 12, max: 16, confidence: "verified" },
  { key: "repayment", desc: "repaymentDesc", score: 13, max: 18, confidence: "reported" },
  { key: "buffer", desc: "bufferDesc", score: 11, max: 18, confidence: "verified" },
] as const;

export const salesData = [
  { month: "Apr", sales: 32 }, { month: "May", sales: 36 }, { month: "Jun", sales: 34 },
  { month: "Jul", sales: 41 }, { month: "Aug", sales: 45 }, { month: "Sep", sales: 48 },
];
