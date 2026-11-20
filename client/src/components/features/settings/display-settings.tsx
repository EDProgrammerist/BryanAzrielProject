import { useSettings } from "@/components/context/use-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const colorModes: [string, string][] = [
  ["none", "Default colors"],
  ["protanopia", "Protanopia (red-weak)"],
  ["deuteranopia", "Deuteranopia (green-weak)"],
  ["tritanopia", "Tritanopia (blue-weak)"],
];

export function DisplaySettings() {
  const { s, set, reset } = useSettings();

  return (
    <section className="panel">
      <h2>Display</h2>
      <label className="row">
        <span>Dark mode</span>
        <Input type="checkbox" role="switch" checked={s.dark} onChange={(e) => set({ dark: e.target.checked })} />
      </label>
      <label>Color-blind mode
        <Select value={s.cb} onChange={(e) => set({ cb: e.target.value })}>
          {colorModes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
      </label>
      <label>Text size: {s.font}%
        <Input type="range" min="80" max="160" step="10" value={s.font} onChange={(e) => set({ font: +e.target.value })} />
      </label>
      <div className="actions">
        <Button onClick={() => set({ font: Math.max(80, s.font - 10) })}>−</Button>
        <Button onClick={() => set({ font: Math.min(160, s.font + 10) })}>+</Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </section>
  );
}
