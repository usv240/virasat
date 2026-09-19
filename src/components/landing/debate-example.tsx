"use client";

import { DebatePanel } from "@/components/app/debate-panel";
import { SAMPLE_DEBATE } from "@/lib/sample";

export function DebateExample() {
  return <DebatePanel debate={SAMPLE_DEBATE} routeLabel="Nominee route" />;
}
