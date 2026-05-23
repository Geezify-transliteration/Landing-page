import { ChevronDown, LoaderCircle } from "lucide-react";
import type { ModelDescriptor } from "@/lib/types";

type ModelSelectorProps = {
  models: ModelDescriptor[];
  value: string;
  isLoading?: boolean;
  onChange: (value: string) => void;
};

const ModelSelector = ({ models, value, isLoading = false, onChange }: ModelSelectorProps) => {
  return (
    <label className="flex min-w-[220px] flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Model</span>
      <div className="relative">
        <select
          className="input-base appearance-none pr-10"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={isLoading || models.length === 0}
        >
          {models.length === 0 ? <option value="">No models available</option> : null}
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.label || model.id}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
          {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </div>
    </label>
  );
};

export default ModelSelector;
