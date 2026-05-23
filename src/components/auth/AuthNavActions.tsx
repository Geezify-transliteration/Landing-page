import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { eraseAll } from "@/lib/sync";

const AuthNavActions = ({ variant = "dark" }: { variant?: "dark" | "light" }) => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const signInClass =
    variant === "dark"
      ? "rounded-2xl border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
      : "rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-ink hover:bg-slate-50";

  if (isLoading) {
    return <span className={`text-sm ${variant === "dark" ? "text-plum-200" : "text-slate-500"}`}>…</span>;
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <button type="button" className={signInClass} onClick={() => setModalOpen(true)}>
          Sign in
        </button>
        <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  const label = user.full_name?.trim() || user.email;

  return (
    <div className="relative">
      <button
        type="button"
        className={signInClass}
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
      >
        <span className="inline-flex items-center gap-2">
          <User className="h-4 w-4" />
          {label}
        </span>
      </button>

      {menuOpen ? (
        <div className="absolute right-0 z-50 mt-2 min-w-[12rem] rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
          <p className="px-4 py-2 text-xs text-slate-500">{user.email}</p>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => {
              if (confirm("Erase all synced personalization data for this account?")) {
                void eraseAll();
              }
              setMenuOpen(false);
            }}
          >
            Erase synced data
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      ) : null}

      <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default AuthNavActions;
