import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import Home from "../pages/Home";

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

const renderHome = (user = mockUser) => {
  localStorage.setItem("ev_user", JSON.stringify(user));

  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders home page with user name", () => {
    renderHome();

    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("displays user car brand", () => {
    renderHome();

    expect(screen.getByText("Tata")).toBeInTheDocument();
  });

  it("shows all quick action cards", () => {
    renderHome();

    expect(screen.getByText("Find CPO")).toBeInTheDocument();
    expect(screen.getByText("My Sessions")).toBeInTheDocument();
    expect(screen.getByText("Payments")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("navigates to Find CPO when clicking the card", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByText("Find CPO"));

    expect(mockNavigate).toHaveBeenCalledWith("/find-cpo");
  });

  it("navigates to Sessions when clicking the card", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByText("My Sessions"));

    expect(mockNavigate).toHaveBeenCalledWith("/sessions");
  });

  it("navigates to Payments when clicking the card", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByText("Payments"));

    expect(mockNavigate).toHaveBeenCalledWith("/payments");
  });

  it("navigates to Settings when clicking the card", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByText("Settings"));

    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });

  it("shows greeting based on time of day", () => {
    renderHome();

    // Check that some form of greeting is shown
    const greetings = ["Good Morning", "Good Afternoon", "Good Evening"];
    const hasGreeting = greetings.some(
      (greeting) => screen.queryByText(greeting) !== null
    );

    expect(hasGreeting).toBe(true);
  });

  it("shows recent activity section", () => {
    renderHome();

    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
  });

  it("shows logout confirmation modal and navigates to login on confirm", async () => {
    const user = userEvent.setup();
    renderHome();

    const logoutButton = screen.getByTitle("Logout");
    await user.click(logoutButton);

    // Modal should appear
    expect(screen.getByText("Are you sure you want to logout?")).toBeInTheDocument();
    
    // Find confirm button in the modal (button with type="button" and text "Logout")
    const buttons = screen.getAllByRole("button", { name: "Logout" });
    const confirmButton = buttons.find(btn => btn.textContent === "Logout");
    await user.click(confirmButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("clears localStorage on logout confirm", async () => {
    const user = userEvent.setup();
    renderHome();

    const logoutButton = screen.getByTitle("Logout");
    await user.click(logoutButton);
    
    // Click confirm button in modal
    const buttons = screen.getAllByRole("button", { name: "Logout" });
    const confirmButton = buttons.find(btn => btn.textContent === "Logout");
    await user.click(confirmButton);

    expect(localStorage.getItem("ev_user")).toBeNull();
  });

  it("closes logout modal on cancel", async () => {
    const user = userEvent.setup();
    renderHome();

    const logoutButton = screen.getByTitle("Logout");
    await user.click(logoutButton);

    // Modal should appear
    expect(screen.getByText("Are you sure you want to logout?")).toBeInTheDocument();
    
    // Click cancel button
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    // Modal should close
    expect(screen.queryByText("Are you sure you want to logout?")).not.toBeInTheDocument();
    // Should not navigate
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("has theme toggle button", () => {
    renderHome();

    const themeToggle = screen.getByRole("button", { name: /switch to/i });
    expect(themeToggle).toBeInTheDocument();
  });

  it("displays battery status mock", () => {
    renderHome();

    expect(screen.getByText("Battery Status")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });
});
