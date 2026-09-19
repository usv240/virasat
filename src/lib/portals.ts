import type { Asset, AssetKind } from "./types";

export type SearchPlan = {
  portal: string;
  url: string;
  needs: string[];
  steps: string[];
  info: string;
  sourceHref: string;
};

const PLANS: Record<AssetKind, (a: Asset) => SearchPlan> = {
  bank: (a) => ({
    portal: "RBI UDGAM",
    url: "https://udgam.rbi.org.in/unclaimed-deposits/",
    needs: ["Your mobile number (OTP)", `Account holder name: ${a.holderName}`, "PAN, date of birth or passport of the account holder", `Bank: ${a.institution}`],
    steps: [
      "Open UDGAM and register with your mobile number. You will get an OTP.",
      `Enter the account holder's name exactly as on the passbook: ${a.holderName}.`,
      "Add one more detail: PAN, date of birth or passport number.",
      `Select the bank: ${a.institution}. UDGAM covers 30 banks, about 90 percent of unclaimed deposits by value.`,
      "If a match appears, take a screenshot and upload it here. Virasat reads it and fills the claim.",
      "If no match appears, the deposit may be less than 10 years old. Visit the branch with the passbook; Virasat prepares the letter.",
    ],
    info: "UDGAM is the Reserve Bank of India's portal for deposits that have had no activity for 10 years or more. Newer dormant accounts are handled at the branch.",
    sourceHref: "https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3579",
  }),
  insurance: (a) => ({
    portal: `${a.institution} unclaimed amounts search (via IRDAI Bima Bharosa)`,
    url: a.institution.toLowerCase().includes("lic") ? "https://licindia.in/unclaimed-amounts-of-policyholders3" : "https://bimabharosa.irdai.gov.in/Home/UnclaimedAmountsQuery",
    needs: [`Policy number (from the bond): ${a.identifierMasked}`, `Policyholder name: ${a.holderName}`, "Date of birth of the policyholder", "PAN (optional but helps)"],
    steps: [
      "Open the insurer's unclaimed amounts page. Every insurer must have one; IRDAI links them all on Bima Bharosa.",
      `Enter the policy number ${a.identifierMasked} (full number from the bond) and the policyholder's date of birth.`,
      "If an unclaimed amount shows, screenshot it and upload it here.",
      "If nothing shows, the policy may still be in force or already paid. Virasat prepares a status-enquiry letter for the branch.",
    ],
    info: "IRDAI, the insurance regulator, requires every insurer to keep a searchable list of unclaimed policy money on its website.",
    sourceHref: "https://bimabharosa.irdai.gov.in/Home/UnclaimedAmountsQuery",
  }),
  mf: (a) => ({
    portal: "SEBI MITRA",
    url: "https://www.mfcentral.com/",
    needs: ["PAN of the account holder", `Name: ${a.holderName}`],
    steps: [
      "Open MITRA (Mutual fund Investment Tracing and Retrieval Assistant), run by CAMS and KFintech under SEBI.",
      "Search by the account holder's PAN. Inactive folios are ones with no transactions for 10 years.",
      "Screenshot any folios found and upload here.",
    ],
    info: "MITRA is the market regulator SEBI's service for tracing forgotten mutual fund investments, launched in 2025.",
    sourceHref: "https://www.sebi.gov.in/legal/circulars/feb-2025/service-platform-for-investors-to-trace-inactive-and-unclaimed-mutual-fund-folios-mitra-mutual-fund-investment-tracing-and-retrieval-assistant-_91847.html",
  }),
  shares: (a) => ({
    portal: "IEPF and the company's unpaid dividend list",
    url: "https://www.iepf.gov.in/IEPF/refund.html",
    needs: [`Shareholder name: ${a.holderName}`, "Folio or certificate number if you have it", "Company name"],
    steps: [
      "Search Virasat's index of companies' public unpaid-dividend lists by the shareholder's name (the Find step does this for you).",
      "Open the company's investor page and confirm the entry in its unpaid dividend list.",
      "If dividends were unpaid for 7 years, the shares moved to IEPF. The claim is filed online on the IEPF portal with Form IEPF-5.",
      "Screenshot the list entry and upload here.",
    ],
    info: "Companies must publish the names of shareholders whose dividends are unpaid. After 7 years the money and shares move to the Investor Education and Protection Fund (IEPF), where they can still be claimed.",
    sourceHref: "https://www.infosys.com/investors/shareholder-services/unclaimed-dividend.html",
  }),
  pf: (a) => ({
    portal: "EPFO member portal",
    url: "https://unifiedportal-mem.epfindia.gov.in/memberinterface/",
    needs: ["UAN (12-digit Universal Account Number)", "Registered mobile number for OTP", `Member name: ${a.holderName}`],
    steps: [
      "Open the EPFO member portal and log in with the UAN. If the UAN is unknown, use 'Know your UAN' with the member's Aadhaar or PAN.",
      "Check the passbook for the balance and the nomination details.",
      "Screenshot the passbook page and upload here.",
    ],
    info: "EPFO holds provident fund, pension and insurance for salaried workers. Old accounts from past jobs are a common source of forgotten money.",
    sourceHref: "https://unifiedportal-mem.epfindia.gov.in/memberinterface/",
  }),
  post: (a) => ({
    portal: "India Post (branch visit)",
    url: "https://www.indiapost.gov.in/",
    needs: [`Account or certificate number: ${a.identifierMasked}`, `Holder name: ${a.holderName}`],
    steps: [
      "Post office savings do not yet have an online unclaimed search. Take the passbook or certificate to the post office where it was opened.",
      "Ask for the account status. Virasat prepares the status-enquiry letter.",
      "Upload a photo of the reply here.",
    ],
    info: "India Post runs savings accounts, recurring deposits, and certificates such as NSC and KVP. Claims are handled at the branch.",
    sourceHref: "https://www.indiapost.gov.in/",
  }),
};

export function searchPlan(asset: Asset): SearchPlan {
  return PLANS[asset.type](asset);
}
