"use client";

import { useState } from "react";
import { Card, InfoButton } from "@/components/ui";
import { inr } from "@/lib/store";

export function SavingsCalculator() {
  const [amount, setAmount] = useState(420000);
  const [fee, setFee] = useState(10);
  const agent = Math.round((amount * fee) / 100);
  const lawyer = amount > 500000 ? 25000 : 15000;
  const days = 20;
  return (
    <Card>
      <h3 className="text-lg">What a family saves with Virasat <InfoButton label="How this is calculated">Agent fee: IEPF and claim recovery consultants publish success fees of 5 to 15 percent. Lawyer fee: succession certificate fee guides list 5,000 to 25,000 rupees for simple cases. Days: an estimate from typical office visits for one claim. Sources are on the References page.</InfoButton></h3>
      <label className="mt-4 block text-sm">
        Money owed to the family: <span className="font-semibold tabular">{inr(amount)}</span>
        <input type="range" min={50000} max={2000000} step={10000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1 w-full accent-[var(--brand)]" />
      </label>
      <label className="mt-3 block text-sm">
        Agent&apos;s fee if you used one: <span className="font-semibold tabular">{fee}%</span>
        <input type="range" min={5} max={15} step={1} value={fee} onChange={(e) => setFee(Number(e.target.value))} className="mt-1 w-full accent-[var(--brand)]" />
      </label>
      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-accent-soft p-3"><dt className="text-xs text-muted">Agent fee avoided</dt><dd className="text-xl font-semibold tabular">{inr(agent)}</dd></div>
        <div className="rounded-lg bg-surface p-3"><dt className="text-xs text-muted">Lawyer fee avoided in simple cases</dt><dd className="text-xl font-semibold tabular">up to {inr(lawyer)}</dd></div>
        <div className="rounded-lg bg-surface p-3"><dt className="text-xs text-muted">Days of office visits saved</dt><dd className="text-xl font-semibold tabular">about {days}</dd></div>
      </dl>
      <p className="mt-3 text-xs text-muted">Virasat is free for families. Estimates, not promises.</p>
    </Card>
  );
}
