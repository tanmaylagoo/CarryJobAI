export default function Loading({
  text = "Working on it...",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-5 h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-400" />

      <p className="text-sm text-zinc-400">
        {text}
      </p>
    </div>
  );
}