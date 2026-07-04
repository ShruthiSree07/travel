// Tailwind can't resolve interpolated class names at build time, so every
// class used anywhere in the app is spelled out literally here per domain
// color. Add a new domain color by adding a new key with the same shape.
export type DomainStyle = {
  badge: string;
  iconWrap: string;
  cardHover: string;
  gradient: string;
  button: string;
  textAccent: string;
  ring: string;
};

export const domainStyles: Record<string, DomainStyle> = {
  emerald: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    iconWrap: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    cardHover: "hover:border-emerald-400/60 hover:shadow-emerald-500/10",
    gradient: "from-emerald-500 to-teal-500",
    button: "bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    ring: "focus:ring-emerald-500/40 focus:border-emerald-500",
  },
  rose: {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
    iconWrap: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    cardHover: "hover:border-rose-400/60 hover:shadow-rose-500/10",
    gradient: "from-rose-500 to-pink-500",
    button: "bg-rose-600 hover:bg-rose-500 focus-visible:outline-rose-600",
    textAccent: "text-rose-600 dark:text-rose-400",
    ring: "focus:ring-rose-500/40 focus:border-rose-500",
  },
  indigo: {
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
    iconWrap: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    cardHover: "hover:border-indigo-400/60 hover:shadow-indigo-500/10",
    gradient: "from-indigo-500 to-violet-500",
    button: "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600",
    textAccent: "text-indigo-600 dark:text-indigo-400",
    ring: "focus:ring-indigo-500/40 focus:border-indigo-500",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    iconWrap: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    cardHover: "hover:border-amber-400/60 hover:shadow-amber-500/10",
    gradient: "from-amber-500 to-orange-500",
    button: "bg-amber-600 hover:bg-amber-500 focus-visible:outline-amber-600",
    textAccent: "text-amber-600 dark:text-amber-400",
    ring: "focus:ring-amber-500/40 focus:border-amber-500",
  },
};
