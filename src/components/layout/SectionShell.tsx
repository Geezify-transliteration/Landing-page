import type { PropsWithChildren, ReactNode } from "react";

type SectionShellProps = PropsWithChildren<{
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: ReactNode;
  className?: string;
}>;

const SectionShell = ({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  actions,
  className = "",
  children,
}: SectionShellProps) => {
  const isCentered = align === "center";

  return (
    <section id={id} className={`px-4 py-20 sm:px-6 lg:px-8 ${className}`.trim()}>
      <div className="mx-auto max-w-7xl">
        <div className={isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow ? (
            <span className="mb-4 inline-flex rounded-full border border-plum-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-plum-700">
              {eyebrow}
            </span>
          ) : null}

          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>

          {description ? (
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
          ) : null}

          {actions ? <div className="mt-8">{actions}</div> : null}
        </div>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
};

export default SectionShell;
