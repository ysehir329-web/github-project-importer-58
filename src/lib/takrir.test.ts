import { describe, it, expect } from "vitest";
import { createTakrirDay, setTakrir, takrirStats } from "./takrir";

describe("takrir", () => {
  it("a new takrir day starts everyone as vermedi", () => {
    const d = createTakrirDay([], "x", "2026-01-05", ["a", "b"]);
    expect(takrirStats(d, "a")).toEqual({ verdi: 0, vermedi: 1 });
  });
  it("marking verdi counts as a verdi day", () => {
    const d = setTakrir(createTakrirDay([], "x", "2026-01-05", ["a"]), "2026-01-05", "a", true);
    expect(takrirStats(d, "a")).toEqual({ verdi: 1, vermedi: 0 });
  });
  it("days without a takrir session are not counted", () => {
    let d = createTakrirDay([], "x", "2026-01-05", ["a"]);
    d = createTakrirDay(d, "y", "2026-01-09", ["a"]);
    d = setTakrir(d, "2026-01-09", "a", true);
    expect(takrirStats(d, "a")).toEqual({ verdi: 1, vermedi: 1 });
  });
  it("creating the same day twice keeps one session", () => {
    const d = createTakrirDay(createTakrirDay([], "x", "2026-01-05", ["a"]), "y", "2026-01-05", ["a"]);
    expect(d).toHaveLength(1);
  });
});
