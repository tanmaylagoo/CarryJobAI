export default function PlanSection({ title, children }) {
  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white tracking-tight border-b border-zinc-800/80 pb-4 mb-6">
        {title}
      </h3>
      <div>{children}</div>
    </section>
  );
}