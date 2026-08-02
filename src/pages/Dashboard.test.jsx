import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard.jsx";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../hooks/useUser.jsx", () => ({
  useUser: () => ({
    user: {
      name: "Ana",
      level: "B2",
      xp: 3200,
      streak: 5,
      weakAreas: [],
      completedLessons: [],
      completedQuizzes: [],
      diagnostic: null,
      lastActive: Date.now(),
    },
    addXp: vi.fn(),
  }),
}));

describe("Dashboard", () => {
  it("renderiza sin romperse con la unidad B2 presente", () => {
    render(<Dashboard />);
    expect(screen.getByText(/Ana/i)).toBeTruthy();
  });
});
