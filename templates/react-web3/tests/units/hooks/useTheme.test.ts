import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAppStore } from "@/stores/appStore";

describe("useAppStore - theme", () => {
  beforeEach(() => {
    // 重置 store
    useAppStore.setState({ theme: "system" });
  });

  it("should have default theme as system", () => {
    const { result } = renderHook(() =>
      useAppStore((s) => s.theme)
    );
    expect(result.current).toBe("system");
  });

  it("should update theme", () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme).toBe("dark");
  });
});
