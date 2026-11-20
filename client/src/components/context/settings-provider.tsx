import { useEffect, useState, type ReactNode } from "react";
import {
  DEFAULT_SETTINGS,
  SettingsContext,
  type Settings,
} from "@/components/context/settings-state";

function loadSettings(): Settings {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("settings") || "{}") };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(loadSettings);

  useEffect(function applySettings() {
    const root = document.documentElement;
    root.dataset.theme = s.dark ? "dark" : "light";
    root.dataset.cb = s.cb;
    root.style.fontSize = s.font + "%";
    localStorage.setItem("settings", JSON.stringify(s));
  }, [s]);

  function set(patch: Partial<Settings>) {
    setS({ ...s, ...patch });
  }
  function reset() {
    setS(DEFAULT_SETTINGS);
  }

  return <SettingsContext.Provider value={{ s, set, reset }}>{children}</SettingsContext.Provider>;
}
