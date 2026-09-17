export default function PlanSection({ id, title, subtitle, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-20 rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
    >
      <div className="border-b border-slate-100 pb-3 mb-5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}