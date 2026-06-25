export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof globalThis.window === "undefined") return "light";
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getThemeFromLocalStorage(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export function setThemeToLocalStorage(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, theme);
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  const resolved = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  // ネイティブUI（スクロールバー等）の配色も揃える
  root.style.colorScheme = theme === "system" ? "light dark" : resolved;

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", resolved === "dark" ? "#111827" : "#ffffff");
  }
}
