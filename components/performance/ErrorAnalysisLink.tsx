"use client";

import { useState, useTransition } from "react";

export default function ErrorAnalysisLink({
  analyzeAction,
}: {
  analyzeAction: () => Promise<string | undefined>;
}) {
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const res = await analyzeAction();
      setResult(res ?? "No analysis available.");
    });
  };

  return (
    <div className="border border-black/60 p-4 space-y-3">
      <button
        type="button"
        onClick={handleClick}
        className="text-blue-600 text-sm underline-offset-2 hover:underline disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? "Analyzing..." : "Analyze error"}
      </button>

      {result && (
        <div className="text-sm text-black/80 leading-relaxed">
          {result}
        </div>
      )}
    </div>
  );
}
