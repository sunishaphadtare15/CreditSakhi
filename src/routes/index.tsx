import { createFileRoute } from "@tanstack/react-router";
import { CreditPassportApp } from "@/features/credit-passport/CreditPassportApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Credit Passport for Women Micro-Entrepreneurs" },
      { name: "description", content: "Turn everyday business records into explainable credit evidence, coaching, and a secure shareable passport." },
      { property: "og:title", content: "Credit Passport for Women Micro-Entrepreneurs" },
      { property: "og:description", content: "An explainable credit evidence layer for women-led micro-businesses in India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <CreditPassportApp />;
}
