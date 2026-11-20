import { createContext } from "react";

export interface Settings {
  dark: boolean;
  cb: string;
  font: number;
}

export interface SettingsContextValue {
  s: Settings;
  set: (patch: Partial<Settings>) => void;
  reset: () => void;
}

export const DEFAULT_SETTINGS: Settings = { dark: false, cb: "none", font: 100 };
export const SettingsContext = createContext<SettingsContextValue | null>(null);
