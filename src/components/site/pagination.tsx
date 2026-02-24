"use client";
import { Button } from "@/components/ui/button";

export function Pager({ hasPrev, hasNext, onPrev, onNext }: { hasPrev: boolean; hasNext: boolean; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" disabled={!hasPrev} onClick={onPrev}>Previous</Button>
      <Button variant="outline" disabled={!hasNext} onClick={onNext}>Next</Button>
    </div>
  );
}
