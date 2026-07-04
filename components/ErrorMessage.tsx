export function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex h-full items-center rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
    >
      {children}
    </div>
  );
}
