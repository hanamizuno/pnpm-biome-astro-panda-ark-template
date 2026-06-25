import { describe, expect, it } from "vitest";
import { applyTheme, getThemeFromLocalStorage, setThemeToLocalStorage } from "./theme.ts";

// Node 環境 (window 未定義) での短絡パスを検証する。
// JSDOM を導入せずに小さな振る舞いを担保する目的のサンプル。
describe("theme utilities (Node / no DOM)", () => {
  it("getThemeFromLocalStorage returns 'system' without window", () => {
    expect(getThemeFromLocalStorage()).toBe("system");
  });

  it("setThemeToLocalStorage is a no-op without window", () => {
    expect(() => {
      setThemeToLocalStorage("dark");
    }).not.toThrow();
  });

  it("applyTheme is a no-op without window", () => {
    expect(() => {
      applyTheme("dark");
    }).not.toThrow();
  });
});
