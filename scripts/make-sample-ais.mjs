// Builds a synthetic Annual Information Statement (AIS) PDF for the sample family.
// Every name and number is made up. Run: node scripts/make-sample-ais.mjs
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync, mkdirSync } from "fs";

const pdf = await PDFDocument.create();
const font = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const p = pdf.addPage([595, 842]);
let y = 800;
const line = (s, f = font, size = 10) => {
  p.drawText(s, { x: 40, y, size, font: f, color: rgb(0.1, 0.1, 0.1) });
  y -= size * 1.8;
};
line("Annual Information Statement (AIS)  -  SAMPLE, all values made up", bold, 13);
line("PAN: XXXXX1234X   Name: RAMESH KULKARNI   Financial year: 2018-19");
y -= 10;
line("Interest from savings bank / deposits", bold, 11);
line("1  STATE BANK OF INDIA                          9,605");
line("2  BANK OF MAHARASHTRA                          2,520");
line("Total                                          12,125");
y -= 10;
line("Dividend", bold, 11);
line("1  BHARAT CEMENT LIMITED                          900");
line("Total                                             900");
y -= 10;
line("Purchase of units of mutual fund", bold, 11);
line("1  NIVESH BALANCED FUND                        85,000");
y -= 20;
line("This sample AIS exists so the parser can be demonstrated without any real person's data.", font, 8);
mkdirSync("public/samples", { recursive: true });
writeFileSync("public/samples/sample-ais.pdf", await pdf.save());
console.log("public/samples/sample-ais.pdf written");
