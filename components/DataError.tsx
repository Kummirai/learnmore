/**
 * Inline failure state for server-rendered sections whose backend call threw.
 * Strict API-only policy: a failed read shows this message instead of quietly
 * falling back to bundled data.
 */
export default function DataError({ label }: { label: string }) {
  return (
    <div
      className={
        "border border-red-200 bg-red-50 rounded-xl px-5 py-6 text-center"
      }
      role={"alert"}
    >
      <p className={"text-red-700 font-medium"}>
        {label} couldn&apos;t be loaded — check your connection and try again.
      </p>
    </div>
  );
}
