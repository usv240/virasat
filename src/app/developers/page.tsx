import { Card, Section } from "@/components/ui";
import { Playground } from "@/components/developers/playground";

export const metadata = { title: "Virasat API for developers" };

const ENDPOINTS: [string, string, string][] = [
  ["POST", "/api/v1/extract", "Upload a photo (multipart file) or sampleId. Returns the extracted fields with confidence per field."],
  ["POST", "/api/v1/ais/parse", "Upload an AIS PDF (multipart file) or sample=true. Returns the asset map. No AI needed."],
  ["POST", "/api/v1/claims/route", "JSON: input, optional extraction, userNotes, debate, rules (BYO). Returns the rule decision and the debate verdict."],
  ["POST", "/api/v1/claims/pack", "JSON: claim, asset, claimant. Returns the claim pack PDF."],
  ["GET", "/api/v1/dividends/search?name=", "Search the unpaid-dividend index by shareholder name."],
  ["GET", "/api/v1/rules", "List the built-in rule sets and versions."],
  ["POST", "/api/v1/rules", "Validate a Bring Your Own rule set against the schema."],
  ["GET", "/api/v1/health", "Service status and whether live AI is on."],
];

export default function DevelopersPage() {
  return (
    <>
      <Section eyebrow="For developers" title="Use Virasat as a service">
        <p className="max-w-3xl text-lg">Send a document, get the details. Send the details, get the claim route, the debate verdict and the forms. Any bank, insurer, service centre or NGO can use this from their own software.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[["Sandbox key", "vs_test_demo", "Free. Sample data and your own files. 30 requests a minute."], ["Live keys", "vs_live_...", "For institutions. Stored only as a SHA-256 hash on the server. Scopes and limits per key."], ["Errors", "application/problem+json", "Every error follows RFC 9457 with a plain-language detail field. Rate limit headers on every response."]].map(([h, code, d]) => (
            <Card key={h}><h3 className="text-lg text-brand">{h}</h3><code className="mt-1 block rounded bg-surface px-2 py-1 text-sm">{code}</code><p className="mt-2 text-sm">{d}</p></Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Quickstart" title="Your first call in one minute" tone="surface">
        <pre className="overflow-x-auto rounded-card border border-border bg-raised p-4 text-sm"><code>{`# 1. Route a claim (rules plus the Two AI Debate)
curl -X POST $HOST/api/v1/claims/route \\
  -H "Authorization: Bearer vs_test_demo" -H "Content-Type: application/json" \\
  -d '{"input":{"assetType":"bank","institution":"State Bank of India","amountInr":158420,
       "nomineePresent":true,"jointHolder":false,"claimantRelation":"spouse","otherHeirs":true}}'

# 2. Read a sample document
curl -X POST $HOST/api/v1/extract -H "Authorization: Bearer vs_test_demo" -F sampleId=passbook

# 3. Read your own document with your own AI key (Bring Your Own Key)
curl -X POST $HOST/api/v1/extract -H "Authorization: Bearer vs_test_demo" \\
  -H "x-byo-anthropic-key: sk-ant-..." -F file=@passbook.jpg`}</code></pre>
        <h3 className="mt-8 text-lg">Endpoints</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="bg-brand text-left text-brand-contrast"><th className="p-2">Method</th><th className="p-2">Path</th><th className="p-2">What it does</th></tr></thead>
            <tbody>{ENDPOINTS.map(([m, p, d]) => <tr key={p + m} className="border-b border-border odd:bg-raised"><td className="p-2 font-mono">{m}</td><td className="p-2 font-mono">{p}</td><td className="p-2">{d}</td></tr>)}</tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Playground" title="Try the API in the browser">
        <Playground />
      </Section>

      <Section eyebrow="Bring your own" title="Your data, your key, your rules" tone="surface">
        <div className="grid gap-4 md:grid-cols-3">
          <Card><h3 className="text-lg text-brand">Bring Your Own Data</h3><p className="mt-2 text-sm">Files you send are processed for that request and returned. Nothing is stored beyond the request. Photos are re-encoded to strip metadata before the AI reads them (planned) and never used for training.</p></Card>
          <Card><h3 className="text-lg text-brand">Bring Your Own Key</h3><p className="mt-2 text-sm">Send <code>x-byo-anthropic-key</code> with your Anthropic key. Your AI usage is billed to you and covered by your own data agreement. The key is used for that request only and is never stored or logged.</p></Card>
          <Card><h3 className="text-lg text-brand">Bring Your Own Rules</h3><p className="mt-2 text-sm">Pass a <code>rules</code> array to <code>/claims/route</code>, or validate one first with <code>POST /rules</code>. Every result records the rule id and version used, so your compliance team can audit it.</p>
            <pre className="mt-2 overflow-x-auto rounded bg-surface p-2 text-xs"><code>{`{"institution":"My Bank","assetType":"bank","version":1,
 "rules":[{"id":"MYBANK_NOMINEE_V1","when":{"nomineePresent":true},
   "route":"nominee","documents":["claim_form","supporting_certificate","nominee_id"],
   "timelineDays":10}],
 "escalation":{"afterDays":30,"to":"RBI Ombudsman","how":"cms.rbi.org.in"}}`}</code></pre></Card>
        </div>
      </Section>

      <Section id="source" eyebrow="Source and docs" title="Run it yourself">
        <pre className="overflow-x-auto rounded-card border border-border bg-raised p-4 text-sm"><code>{`git clone <repository-url> && cd virasat
npm install
cp .env.example .env.local     # optional: ANTHROPIC_API_KEY=sk-ant-... for live AI
npm run dev                    # http://localhost:3000`}</code></pre>
        <p className="mt-3 text-sm text-muted">Without a key the app runs in Sample mode and the demo still works end to end. The repository README lists the stack, the tests and the video.</p>
      </Section>
    </>
  );
}
