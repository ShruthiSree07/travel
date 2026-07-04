"use client";

export function Field({
  label,
  suffix,
  className = "",
  ...props
}: {
  label: string;
  suffix?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
      <div className="relative">
        <input
          className={`w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-base text-neutral-900 outline-none transition focus:ring-4 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white ${className}`}
          inputMode="decimal"
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-neutral-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

export function Select({
  label,
  children,
  className = "",
  ...props
}: {
  label: string;
  children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
      <select
        className={`w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-base text-neutral-900 outline-none transition focus:ring-4 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
