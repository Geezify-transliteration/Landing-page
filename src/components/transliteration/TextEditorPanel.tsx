import { PenLine } from "lucide-react";
import { MAX_INPUT_CHARS } from "@/lib/constants";
import type { ExamplePrompt } from "@/lib/types";

type TextEditorPanelProps = {
  value: string;
  isSubmitting: boolean;
  examples: ExamplePrompt[];
  onChange: (value: string) => void;
  onUseExample: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  validationMessage?: string;
};

const TextEditorPanel = ({
  value,
  isSubmitting,
  examples,
  onChange,
  onUseExample,
  onSubmit,
  onClear,
  validationMessage,
}: TextEditorPanelProps) => {
  const remainingChars = MAX_INPUT_CHARS - value.length;

  return (
    <section className="card-surface flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-plum-700">Input editor</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Write Latin-script Amharic</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-plum-50 px-3 py-1 text-xs font-medium text-plum-700">
          <PenLine className="h-4 w-4" />
          Up to {MAX_INPUT_CHARS} characters
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        Paste a draft, class note, message, or caption. The backend will return the best Amharic-script output plus ranked alternatives.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {examples.map((example) => (
          <button
            key={example.title}
            type="button"
            className="rounded-full border border-plum-200 bg-plum-50 px-4 py-2 text-sm font-medium text-plum-700 transition hover:border-plum-300 hover:bg-plum-100"
            onClick={() => onUseExample(example.text)}
          >
            {example.title}
          </button>
        ))}
      </div>

      <textarea
        className="input-base mt-6 min-h-[320px] flex-1 resize-none overflow-y-auto"
        placeholder="Example: selam new endet neh? zare conference lay presentation alen."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={`text-sm ${remainingChars < 0 ? "text-rose-600" : "text-slate-500"}`}>
            {value.length}/{MAX_INPUT_CHARS} characters
          </p>
          {validationMessage ? <p className="mt-1 text-sm text-rose-600">{validationMessage}</p> : null}
        </div>

        <div className="flex gap-3">
          <button type="button" className="btn-ghost" onClick={onClear}>
            Clear
          </button>
          <button type="button" className="btn-primary" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Transliterating..." : "Transliterate text"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TextEditorPanel;
