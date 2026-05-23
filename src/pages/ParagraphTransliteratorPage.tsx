import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, BadgeAlert, LoaderCircle, Server } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ModelSelector from "@/components/transliteration/ModelSelector";
import OutputPanel from "@/components/transliteration/OutputPanel";
import TextEditorPanel from "@/components/transliteration/TextEditorPanel";
import TopKControl from "@/components/transliteration/TopKControl";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import {
  getPreferredGeEz,
  getSyncStatus,
  recordPreferenceAccepted,
  recordSettingsPatch,
} from "@/lib/sync";
import { DEFAULT_TOP_K, EXAMPLE_PROMPTS, MAX_INPUT_CHARS } from "@/lib/constants";
import type {
  ApiError,
  ModelsListResponse,
  TransliterateRequest,
  TransliterateResponse,
  TransliterationCandidate,
} from "@/lib/types";

const ParagraphTransliteratorPage = () => {
  const { isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [topK, setTopK] = useState(DEFAULT_TOP_K);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [validationMessage, setValidationMessage] = useState<string | undefined>();
  const [copyLabel, setCopyLabel] = useState("Copy output");
  const [syncError, setSyncError] = useState<string | null>(null);

  const modelsQuery = useQuery<ModelsListResponse, ApiError>({
    queryKey: ["models"],
    queryFn: api.listModels,
  });

  const transliterateMutation = useMutation<TransliterateResponse, ApiError, TransliterateRequest>({
    mutationFn: api.transliterate,
    onSuccess: (response) => {
      setSelectedText(response.best_text);
      setValidationMessage(undefined);
    },
  });

  useEffect(() => {
    if (selectedModelId || !modelsQuery.data) {
      return;
    }

    setSelectedModelId(modelsQuery.data.default_model_id || modelsQuery.data.models[0]?.id || "");
  }, [modelsQuery.data, selectedModelId]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSyncError(null);
      return;
    }
    void getSyncStatus().then((status) => setSyncError(status.lastError));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedModelId) return;
    recordSettingsPatch({
      defaultModelId: selectedModelId,
      defaultTopK: topK,
    });
  }, [selectedModelId, topK]);

  const selectedModel = useMemo(() => {
    return modelsQuery.data?.models.find((model) => model.id === selectedModelId) || null;
  }, [modelsQuery.data, selectedModelId]);

  const localPreferred = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return null;
    return getPreferredGeEz(trimmed);
  }, [text]);

  const handleSubmit = () => {
    const trimmed = text.trim();

    if (!trimmed) {
      setValidationMessage("Enter some Latin-script Amharic text before submitting.");
      return;
    }

    if (trimmed.length > MAX_INPUT_CHARS) {
      setValidationMessage(`Text must stay under ${MAX_INPUT_CHARS} characters.`);
      return;
    }

    if (!selectedModelId) {
      setValidationMessage("Choose a model before sending the request.");
      return;
    }

    transliterateMutation.mutate({
      text: trimmed,
      model_id: selectedModelId,
      top_k: topK,
    });
  };

  const handleClear = () => {
    setText("");
    setSelectedText("");
    setValidationMessage(undefined);
    setCopyLabel("Copy output");
    transliterateMutation.reset();
  };

  const handleUseExample = (value: string) => {
    setText(value);
    setValidationMessage(undefined);
  };

  const handleSelectCandidate = (candidate: TransliterationCandidate) => {
    setSelectedText(candidate.text);
    const latin = text.trim();
    if (!latin) return;
    if (!isAuthenticated) {
      setValidationMessage("Sign in to save this preference and apply it on future transliterations.");
      return;
    }
    recordPreferenceAccepted(latin, candidate.text);
    void getSyncStatus().then((status) => {
      setSyncError(status.lastError);
      if (!status.lastError && isAuthenticated) {
        setValidationMessage(
          "Preference saved. Run transliterate again with the same text to see your choice ranked first.",
        );
      }
    });
  };

  const handleCopy = async () => {
    const value = selectedText || transliterateMutation.data?.best_text;

    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy output"), 2000);
    } catch {
      setCopyLabel("Copy failed");
      window.setTimeout(() => setCopyLabel("Copy output"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-plum-50/60">
      <Navbar ctaLabel="Back to Home" ctaHref="/" />

      <main>
        <section className="bg-hero px-4 pb-16 pt-14 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-plum-100 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to homepage
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <span className="inline-flex rounded-full border border-white/[0.15] bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-plum-100">
                  Paragraph transliterator
                </span>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  A Workspace for Latin-to-Amharic paragraph transliteration.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-plum-100">
                  Choose a model, set the suggestion count, submit your paragraph, and review the backend's best output plus ranked alternatives.
                </p>
              </div>

              {/* <div className="glass-dark rounded-[1.75rem] border border-white/[0.12] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-plum-200">Backend route</p>
                <code className="mt-2 block font-medium text-white">/v1/models + /v1/transliterate</code>
              </div> */}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {!isAuthenticated ? (
              <p className="mb-6 rounded-2xl border border-plum-100 bg-plum-50 px-4 py-3 text-sm text-plum-800">
                Sign in from the header to save preferences when you pick a candidate and to rerank
                future results for the same input text.
              </p>
            ) : (
              <div className="mb-6 space-y-2">
                <p className="rounded-2xl border border-plum-100 bg-plum-50 px-4 py-3 text-sm text-plum-800">
                  Click a candidate to save your choice, then run transliteration again with the{" "}
                  <strong>exact same input text</strong> (personalization is keyed on the full paragraph).
                  Order only changes when scores are close.
                </p>
                {syncError ? (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Sync error: {syncError}
                  </p>
                ) : null}
              </div>
            )}

            <div className="card-surface mb-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-plum-700">Control center</p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">Tune the request before you run it.</h2>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row">
                  <ModelSelector
                    models={modelsQuery.data?.models ?? []}
                    value={selectedModelId}
                    isLoading={modelsQuery.isLoading}
                    onChange={setSelectedModelId}
                  />
                  <TopKControl value={topK} onChange={setTopK} />
                </div>
              </div>

              {localPreferred ? (
                <p className="mt-4 text-sm text-plum-700">
                  Local saved preference for this text: <span className="font-medium">{localPreferred}</span>
                </p>
              ) : null}

              {modelsQuery.isLoading ? (
                <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-plum-50 px-4 py-3 text-sm text-plum-700">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Loading available models...
                </div>
              ) : null}

              {modelsQuery.error ? (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                  <BadgeAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Could not load models from the backend.</p>
                    <p className="mt-1 leading-6">{modelsQuery.error.message}</p>
                  </div>
                </div>
              ) : null}

              {!modelsQuery.error && selectedModel ? (
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-plum-50 px-4 py-2 text-plum-700">
                    <Server className="h-4 w-4" />
                    {selectedModel.label || selectedModel.id}
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-2">
                    {selectedModel.loaded ? "Model warmed up" : "Model may load on first request"}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="grid gap-8 xl:grid-cols-2">
              <TextEditorPanel
                value={text}
                isSubmitting={transliterateMutation.isPending}
                examples={EXAMPLE_PROMPTS}
                onChange={(value) => {
                  setText(value);
                  setValidationMessage(undefined);
                }}
                onUseExample={handleUseExample}
                onSubmit={handleSubmit}
                onClear={handleClear}
                validationMessage={validationMessage}
              />
              <OutputPanel
                result={transliterateMutation.data || null}
                selectedText={selectedText}
                isSubmitting={transliterateMutation.isPending}
                error={transliterateMutation.error || null}
                copyLabel={copyLabel}
                onCopy={handleCopy}
                onSelectCandidate={handleSelectCandidate}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ParagraphTransliteratorPage;
