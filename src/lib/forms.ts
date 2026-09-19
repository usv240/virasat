/**
 * Claim pack generator: one PDF with the filled claim form, the cover letter
 * (English and Hindi) and the document checklist.
 */
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Asset, Claim } from "./types";

export type ClaimantDetails = { name: string; relation: string; address: string; phone: string; bankAccountMasked?: string };

const HINDI_LETTER = (c: ClaimantDetails, a: Asset) =>
  `Sewa mein, Shakha Prabandhak, ${a.institution}.\nVishay: Khata / policy ${a.identifierMasked} (dharak: ${a.holderName}) ki rakam ke daave hetu aavedan.\nMahoday, main ${c.name}, dharak ki ${c.relation}, uparokt khate ki rakam ka daava karti/karta hoon. Sabhi aavashyak dastavez sanlagn hain. Kripya rakam mere khate mein jama karne ki kripa karein.\nDhanyavaad. ${c.name}, ${c.phone}`;

export async function buildClaimPack(claim: Claim, asset: Asset, claimant: ClaimantDetails): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const teal = rgb(0.06, 0.24, 0.24);
  const ink = rgb(0.1, 0.13, 0.12);
  const muted = rgb(0.32, 0.38, 0.37);
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  function page(title: string) {
    const p = pdf.addPage([595, 842]);
    p.drawRectangle({ x: 0, y: 792, width: 595, height: 50, color: teal });
    p.drawText("Virasat claim pack", { x: 40, y: 812, size: 14, font: bold, color: rgb(1, 1, 1) });
    p.drawText(title, { x: 300, y: 812, size: 11, font, color: rgb(0.9, 0.95, 0.94) });
    p.drawText("Prepared by Virasat. Review every line before signing. This is guidance, not legal advice.", { x: 40, y: 30, size: 8, font, color: muted });
    return p;
  }
  function paragraphs(p: ReturnType<typeof page>, text: string, x: number, y: number, size = 11, width = 515): number {
    const words = text.split(/\s+/);
    let line = "";
    let yy = y;
    const lines: string[] = [];
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > width || w === "\n") {
        lines.push(line);
        line = w === "\n" ? "" : w;
      } else line = test;
    }
    if (line) lines.push(line);
    for (const l of lines) {
      p.drawText(l, { x, y: yy, size, font, color: ink });
      yy -= size * 1.5;
    }
    return yy;
  }

  // Page 1: claim form
  const p1 = page("Claim form (pre-filled)");
  p1.drawText(`Claim form: ${asset.institution}`, { x: 40, y: 760, size: 18, font: bold, color: teal });
  p1.drawText(`Route: ${claim.decision.routeLabel}   Rule: ${claim.decision.ruleId} v${claim.decision.ruleVersion}   Date: ${today}`, { x: 40, y: 738, size: 9, font, color: muted });
  const fields: [string, string][] = [
    ["Account holder / policyholder", asset.holderName],
    ["Account / policy / folio number", `${asset.identifierMasked} (write the full number from the original)`],
    ["Type", asset.type.toUpperCase()],
    ["Claimant name", claimant.name],
    ["Relation to holder", claimant.relation],
    ["Claimant address", claimant.address],
    ["Claimant phone", claimant.phone],
    ["Pay to bank account", claimant.bankAccountMasked ?? "(attach cancelled cheque)"],
    ["Nominee named on record", asset.nomineeName ?? "None / unknown"],
    ["Amount claimed (estimate)", asset.amountEstimateInr ? `Rs. ${asset.amountEstimateInr.toLocaleString("en-IN")}` : "As per records"],
  ];
  let y = 705;
  for (const [k, v] of fields) {
    p1.drawText(k, { x: 40, y, size: 10, font: bold, color: muted });
    p1.drawRectangle({ x: 230, y: y - 6, width: 325, height: 22, borderColor: rgb(0.84, 0.87, 0.87), borderWidth: 1 });
    p1.drawText(v, { x: 236, y, size: 10, font, color: ink });
    y -= 34;
  }
  p1.drawText("Declaration", { x: 40, y: y - 10, size: 12, font: bold, color: teal });
  y = paragraphs(p1, "I declare that the details above are true to my knowledge and that I am entitled to receive the amount as nominee or legal heir. I enclose the documents listed in the checklist. I undertake to refund the amount if a person with a better claim is later established.", 40, y - 32);
  p1.drawText("Signature of claimant: ________________________    Date: ____________", { x: 40, y: y - 30, size: 10, font, color: ink });

  // Page 2: cover letters
  const p2 = page("Cover letter (English and Hindi)");
  p2.drawText("Cover letter", { x: 40, y: 760, size: 18, font: bold, color: teal });
  let y2 = paragraphs(
    p2,
    `To, The Branch Manager, ${asset.institution}. Date: ${today}. Subject: Claim for the amount in ${asset.type === "insurance" ? "policy" : "account"} ${asset.identifierMasked} held by ${asset.holderName}. Respected Sir or Madam, I, ${claimant.name}, ${claimant.relation} of ${asset.holderName}, request the settlement of the above ${asset.type === "insurance" ? "policy" : "account"} in my favour under the ${claim.decision.routeLabel.toLowerCase()}. I enclose: ${claim.decision.checklist.map((c) => c.label).join("; ")}. Kindly credit the amount to my bank account, details enclosed. Please let me know if any further document is required. My contact number is ${claimant.phone}. Thanking you, ${claimant.name}, ${claimant.address}.`,
    40,
    730,
  );
  p2.drawText("Hindi (in Roman script; the app reads it aloud in Hindi)", { x: 40, y: y2 - 24, size: 11, font: bold, color: teal });
  y2 = paragraphs(p2, HINDI_LETTER(claimant, asset).replace(/\n/g, " "), 40, y2 - 46);

  // Page 3: checklist
  const p3 = page("Document checklist");
  p3.drawText("Documents to carry", { x: 40, y: 760, size: 18, font: bold, color: teal });
  let y3 = 730;
  for (const item of claim.decision.checklist) {
    p3.drawRectangle({ x: 40, y: y3 - 2, width: 12, height: 12, borderColor: ink, borderWidth: 1 });
    p3.drawText(item.label + (item.autoFilled ? "  (prepared by Virasat)" : ""), { x: 60, y: y3, size: 11, font: bold, color: ink });
    y3 = paragraphs(p3, `${item.what} Where: ${item.where}`, 60, y3 - 16, 9.5, 495) - 6;
    if (y3 < 80) break;
  }
  p3.drawText(`Expected time: about ${claim.decision.timelineDays} days. If nothing happens after ${claim.decision.escalation.afterDays} days: ${claim.decision.escalation.to}.`, { x: 40, y: Math.max(y3 - 10, 50), size: 9.5, font, color: muted });

  pdf.setTitle(`Virasat claim pack: ${asset.institution}`);
  pdf.setProducer("Virasat");
  return pdf.save();
}
