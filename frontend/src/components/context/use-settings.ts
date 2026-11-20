import { useContext } from "react";
import { SettingsContext } from "@/components/context/settings-state";

export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) throw new Error("useSettings must be used inside SettingsProvider");
  return value;
}
