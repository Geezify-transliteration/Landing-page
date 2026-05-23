import { ArrowRight, Code2, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-plum-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <span className="inline-flex rounded-full border border-plum-200 bg-plum-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-plum-700">
            Geezify
          </span>
          <h2 className="mt-5 text-2xl font-semibold text-ink">
            A focused home for Amharic transliteration across browser, mobile, and paragraph workflows.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            This landing experience was built to present the product suite clearly while keeping the paragraph transliterator ready for real backend integration.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-plum-700">Explore</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <Link className="transition hover:text-plum-700" to="/">
                Home
              </Link>
              <Link className="transition hover:text-plum-700" to="/paragraph-transliterator">
                Paragraph Transliterator
              </Link>
              <Link className="transition hover:text-plum-700" to="/#products">
                Product Suite
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-plum-700">Project</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> Contact-ready copy blocks
              </span>
              <span className="inline-flex items-center gap-2">
                <Code2 className="h-4 w-4" /> Deployment-friendly Vite setup
              </span>
              <Link className="inline-flex items-center gap-2 font-semibold text-plum-700" to="/paragraph-transliterator">
                Launch the tool <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
