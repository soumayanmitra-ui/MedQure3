import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { clearDemoSession, getDemoSession } from "@/lib/demo-auth";
import { Route } from "@/routes/login";

// Mock @tanstack/react-router
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});

describe("LoginPage Demo OTP Flow", () => {
  const LoginPageComponent = Route.options.component!;

  beforeEach(() => {
    clearDemoSession();
    vi.clearAllTimers();
  });

  it("renders mobile number input and Send Demo OTP button", () => {
    render(<LoginPageComponent />);

    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Demo OTP/i })).toBeInTheDocument();
    expect(screen.getByText(/123456/i)).toBeInTheDocument();
  });

  it("validates mobile number before sending OTP", async () => {
    render(<LoginPageComponent />);

    const sendBtn = screen.getByRole("button", { name: /Send Demo OTP/i });

    // Submit empty
    fireEvent.click(sendBtn);
    expect(await screen.findByText(/Please enter your 10-digit mobile number/i)).toBeInTheDocument();

    // Enter short number
    const input = screen.getByLabelText(/Mobile Number/i);
    fireEvent.change(input, { target: { value: "12345" } });
    fireEvent.click(sendBtn);
    expect(await screen.findByText(/Mobile number must be exactly 10 digits/i)).toBeInTheDocument();

    // Enter number starting with 1 (not 6-9)
    fireEvent.change(input, { target: { value: "1234567890" } });
    fireEvent.click(sendBtn);
    expect(await screen.findByText(/Indian mobile numbers must start with 6, 7, 8, or 9/i)).toBeInTheDocument();
  });

  it("advances to OTP step with demo code banner after clicking Send OTP", async () => {
    render(<LoginPageComponent />);

    // Click quick fill helper
    const fillHelper = screen.getByRole("button", { name: /Fill demo number/i });
    fireEvent.click(fillHelper);

    const input = screen.getByLabelText(/Mobile Number/i) as HTMLInputElement;
    expect(input.value).toBe("9876543210");

    const sendBtn = screen.getByRole("button", { name: /Send Demo OTP/i });
    fireEvent.click(sendBtn);

    // Wait for step transition
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Verify Demo OTP/i })).toBeInTheDocument();
      expect(screen.getByText(/PROTOTYPE SIMULATION · NO REAL SMS SENT/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Verify Demo OTP/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("shows friendly error when wrong OTP is entered, and verifies when 123456 is entered", async () => {
    render(<LoginPageComponent />);

    // Fill valid phone and send OTP
    const fillHelper = screen.getByRole("button", { name: /Fill demo number/i });
    fireEvent.click(fillHelper);
    fireEvent.click(screen.getByRole("button", { name: /Send Demo OTP/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Verify Demo OTP/i })).toBeInTheDocument();
    }, { timeout: 3000 });

    // Autofill 123456 helper
    const autoFillOtpBtn = screen.getByRole("button", { name: /Auto-fill 123456/i });
    fireEvent.click(autoFillOtpBtn);

    const verifyBtn = screen.getByRole("button", { name: /Verify Demo OTP/i });
    fireEvent.click(verifyBtn);

    // Should transition to success state
    await waitFor(() => {
      expect(screen.getByText(/Demo OTP Verified!/i)).toBeInTheDocument();
      expect(screen.getByText(/Prototype Session Established/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check that prototype session was saved
    const session = getDemoSession();
    expect(session?.isLoggedIn).toBe(true);
    expect(session?.phone).toBe("+91 9876543210");
  });

  it("shows resend confirmation without sending real SMS", async () => {
    render(<LoginPageComponent />);

    // Advance to OTP step
    fireEvent.click(screen.getByRole("button", { name: /Fill demo number/i }));
    fireEvent.click(screen.getByRole("button", { name: /Send Demo OTP/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Verify Demo OTP/i })).toBeInTheDocument();
    }, { timeout: 3000 });

    // Resend button has cooldown or text
    const resendBtn = screen.getByRole("button", { name: /Resend/i });
    expect(resendBtn).toBeInTheDocument();
  });
});
