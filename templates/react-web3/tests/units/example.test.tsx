import { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// 示例：测试一个简单组件
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}

describe("Counter", () => {
  it("should increment count on click", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Count: 0");

    await user.click(button);
    expect(button).toHaveTextContent("Count: 1");
  });
});
