import { Copy, LoaderCircle, Sparkles } from "lucide-react";
import CandidateList from "@/components/transliteration/CandidateList";
import type { ApiError, TransliterateResponse, TransliterationCandidate } from "@/lib/types";

type OutputPanelProps = {
  result: TransliterateResponse | null;
  selectedText: string;
  isSubmitting: boolean;
  error: ApiError | null;
  copyLabel: string;
  onCopy: () => void;
  onSelectCandidate: (candidate: TransliterationCandidate) => void;
};

const OutputPanel = ({
  result,
  selectedText,
  isSubmitting,
  error,
  copyLabel,
  onCopy,
  onSelectCandidate,
}: OutputPanelProps) => {
  return (
    <section className="card-surface h-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-plum-700">Output panel</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Review transliterated output</h2>
        </div>
        <button type="button" className="btn-ghost" onClick={onCopy} disabled={!selectedText}>
          <Copy className="h-4 w-4" />
          {copyLabel}
        </button>
      </div>

      {isSubmitting ? (
        <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-plum-200 bg-plum-50/70 text-center">
          <LoaderCircle className="h-8 w-8 animate-spin text-plum-600" />
          <p className="mt-4 text-base font-medium text-ink">Generating Amharic-script output...</p>
          <p className="mt-2 max-w-sm text-sm text-slate-500">The request is being sent to the backend transliteration service.</p>
        </div>
      ) : null}

      {!isSubmitting && error ? (
        <div className="mt-6 rounded-[1.75rem] border border-rose-200 bg-rose-50 px-5 py-6">
          <p className="text-sm font-semibold text-rose-700">Request failed</p>
          <p className="mt-2 text-sm leading-7 text-rose-600">{error.message}</p>
        </div>
      ) : null}

      {!isSubmitting && !error ? (
        <div className="mt-6 rounded-[1.75rem] border border-plum-100 bg-surface p-6 shadow-sm">
          {result ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-plum-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-plum-700">
                  <Sparkles className="h-4 w-4" />
                  Best transliteration
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1">Model: {result.model_id}</span>
                  <span className="rounded-full bg-white px-3 py-1">Latency: {result.latency_ms.toFixed(1)} ms</span>
                  {result.personalized ? (
                    <span className="rounded-full bg-plum-100 px-3 py-1 font-medium text-plum-800">
                      Personalized ranking
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="mt-6 min-h-[180px] whitespace-pre-wrap rounded-[1.5rem] bg-white px-5 py-5 text-lg leading-9 text-ink shadow-sm">
                {selectedText || result.best_text}
              </p>
            </>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <Sparkles className="h-8 w-8 text-plum-500" />
              <p className="mt-4 text-base font-medium text-ink">Your transliterated paragraph will appear here.</p>
              <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
                Choose a model, write in Latin-script Amharic, and submit the request to see the best output and alternative candidates.
              </p>
            </div>
          )}
        </div>
      ) : null}

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">Ranked suggestions</h3>
          <p className="text-sm text-slate-500">Click a candidate to preview it above.</p>
        </div>
        <CandidateList candidates={result?.candidates ?? []} selectedText={selectedText} onSelect={onSelectCandidate} />
      </div>
    </section>
  );
};

export default OutputPanel;
