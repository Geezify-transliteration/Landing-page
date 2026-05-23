import type { TransliterationCandidate } from "@/lib/types";

type CandidateListProps = {
  candidates: TransliterationCandidate[];
  selectedText: string;
  onSelect: (candidate: TransliterationCandidate) => void;
};

const CandidateList = ({ candidates, selectedText, onSelect }: CandidateListProps) => {
  if (candidates.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-plum-200 bg-plum-50/60 px-5 py-6 text-sm text-slate-500">
        Candidate suggestions will appear here after a successful transliteration request.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {candidates.map((candidate) => {
        const isSelected = candidate.text === selectedText;

        return (
          <button
            key={`${candidate.rank}-${candidate.text}`}
            type="button"
            className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
              isSelected
                ? "border-plum-300 bg-plum-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-plum-200 hover:bg-plum-50/40"
            }`}
            onClick={() => onSelect(candidate)}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Candidate {candidate.rank}</p>
                <p className="mt-2 text-base font-medium text-ink">{candidate.text}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-plum-700 shadow-sm">
                Score {candidate.score.toFixed(2)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CandidateList;
