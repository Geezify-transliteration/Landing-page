import { LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

type Mode = "login" | "register";

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password, fullName.trim() || undefined);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete sign-in.");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-midnight/60 px-4 py-8 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-plum-700">
          {mode === "login" ? "Sign in" : "Create account"}
        </p>
        <h2 id="auth-modal-title" className="mt-2 text-2xl font-semibold text-ink">
          {mode === "login" ? "Welcome back" : "Join Geezify"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to save your preferred candidates and apply server-side reranking on later requests.
        </p>

        <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          {mode === "register" ? (
            <label className="block text-sm font-medium text-ink">
              Full name
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </label>
          ) : null}

          <label className="block text-sm font-medium text-ink">
            Email
            <input
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="block text-sm font-medium text-ink">
            Password
            <input
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Please wait…
              </span>
            ) : mode === "login" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button
                type="button"
                className="font-medium text-plum-700 underline"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-plum-700 underline"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>,
    document.body,
  );
};

export default AuthModal;
