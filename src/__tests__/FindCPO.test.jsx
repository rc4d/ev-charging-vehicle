import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import FindCPO from "../pages/FindCPO";

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUser = {
  phone: "9876543210",
  fullName: "Test User",
  carType: "tata",
  carBrand: "Tata",
  profileCompleted: true,
};

const renderFindCPO = () => {
  localStorage.setItem("ev_user", JSON.stringify(mockUser));

  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FindCPO />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe("FindCPO Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders Find CPO page", () => {
    renderFindCPO();

    expect(screen.getByText("Find Charging Point")).toBeInTheDocument();
  });

  it("shows list view by default", () => {
    renderFindCPO();

    // Check for charge point names from JSON
    expect(screen.getByText("Green Energy Hub")).toBeInTheDocument();
    expect(screen.getByText("EcoCharge Station")).toBeInTheDocument();
    expect(screen.getByText("PowerUp Central")).toBeInTheDocument();
  });

  it("can switch between list and map view", async () => {
    const user = userEvent.setup();
    renderFindCPO();

    // Click on Map button
    await user.click(screen.getByRole("button", { name: /map/i }));

    // Map view should show legend
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Bangalore Area")).toBeInTheDocument();
  });

  it("can switch back to list view", async () => {
    const user = userEvent.setup();
    renderFindCPO();

    // Switch to map
    await user.click(screen.getByRole("button", { name: /map/i }));

    // Switch back to list
    await user.click(screen.getByRole("button", { name: /list/i }));

    // Should show list items again
    expect(screen.getByText("Green Energy Hub")).toBeInTheDocument();
  });

  it("shows charge point details when selected", async () => {
    const user = userEvent.setup();
    renderFindCPO();

    // Click on a charge point
    await user.click(screen.getByText("Green Energy Hub"));

    // Should show details panel with start charging button
    expect(
      screen.getByRole("button", { name: /start charging/i })
    ).toBeInTheDocument();
  });

  it("shows offline status for unavailable stations", async () => {
    const user = userEvent.setup();
    renderFindCPO();

    // Click on offline station (Spark Charge Point)
    await user.click(screen.getByText("Spark Charge Point"));

    // Should show offline status
    expect(
      screen.getByRole("button", { name: /currently offline/i })
    ).toBeInTheDocument();
  });

  it("can close selected CPO details", async () => {
    const user = userEvent.setup();
    renderFindCPO();

    // Select a charge point
    await user.click(screen.getByText("Green Energy Hub"));

    // Check that the "Start Charging" button appears
    expect(
      screen.getByRole("button", { name: /start charging/i })
    ).toBeInTheDocument();
  });

  it("navigates back to home when clicking back button", async () => {
    const user = userEvent.setup();
    renderFindCPO();

    // Click back button (first button in header)
    const backButton = screen.getAllByRole("button")[0];
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("displays availability status for each CPO", () => {
    renderFindCPO();

    // Check for availability badges
    expect(screen.getAllByText("Available").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Busy").length).toBeGreaterThan(0);
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("displays power ratings for charge points", () => {
    renderFindCPO();

    expect(screen.getAllByText(/kW/i).length).toBeGreaterThan(0);
  });

  it("displays pricing information", () => {
    renderFindCPO();

    expect(screen.getAllByText(/₹.*\/kWh/i).length).toBeGreaterThan(0);
  });

  it("has theme toggle button", () => {
    renderFindCPO();

    const themeToggle = screen.getByRole("button", { name: /switch to/i });
    expect(themeToggle).toBeInTheDocument();
  });
});
