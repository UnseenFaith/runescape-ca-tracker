import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBossColor(bossId: string): string {
  const colors: Record<string, string> = {
    // GWD1
    kreearra: "from-cyan-100 to-blue-200 dark:from-cyan-950/40 dark:to-blue-900/30",
    graardor: "from-amber-100 to-orange-200 dark:from-amber-950/40 dark:to-orange-900/30",
    zilyana: "from-blue-100 to-indigo-200 dark:from-blue-950/40 dark:to-indigo-900/30",
    kril: "from-red-100 to-rose-200 dark:from-red-950/40 dark:to-rose-900/30",

    // GWD2
    vindicta: "from-red-100 to-orange-200 dark:from-red-950/40 dark:to-orange-900/30",
    helwyr: "from-green-100 to-emerald-200 dark:from-green-950/40 dark:to-emerald-900/30",
    twins: "from-yellow-100 to-amber-200 dark:from-yellow-950/40 dark:to-amber-900/30",
    gregorovic: "from-purple-100 to-violet-200 dark:from-purple-950/40 dark:to-violet-900/30",

    // Other bosses
    araxxor: "from-green-100 to-green-200 dark:from-green-950/40 dark:to-green-900/30",
    telos: "from-purple-100 to-purple-200 dark:from-purple-950/40 dark:to-purple-900/30",
    solak: "from-emerald-100 to-emerald-200 dark:from-emerald-950/40 dark:to-emerald-900/30",
    raksha: "from-amber-100 to-amber-200 dark:from-amber-950/40 dark:to-amber-900/30",
  }

  return colors[bossId] || "from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/30"
}

