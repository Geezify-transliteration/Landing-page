import { Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthNavActions from "@/components/auth/AuthNavActions";
import { NAV_LINKS } from "@/lib/constants";

type NavbarProps = {
  ctaLabel?: string;
  ctaHref?: string;
};

const Navbar = ({ ctaLabel = "Open Tool", ctaHref = "/paragraph-transliterator" }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(18,10,36,0.9)] backdrop-blur-xl"
      style={{ WebkitBackdropFilter: "blur(24px)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.12] text-plum-200">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-semibold">Geezify</p>
            <p className="text-xs uppercase tracking-[0.24em] text-plum-200">Transliteration Suite</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item.label} to={item.href} className="text-sm font-medium text-plum-100 transition hover:text-white">
              {item.label}
            </Link>
          ))}
          <AuthNavActions variant="dark" />
          <Link to={ctaHref} className="btn-primary">
            {ctaLabel}
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.15] bg-white/10 text-white md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-midnight/95 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-plum-100 hover:bg-white/[0.06] hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4">
              <AuthNavActions variant="dark" />
            </div>
            <Link to={ctaHref} className="btn-primary text-center" onClick={() => setIsOpen(false)}>
              {ctaLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
