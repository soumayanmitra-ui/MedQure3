import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Smartphone,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  FlaskConical,
  Sparkles,
  Info,
  LogOut,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FIXED_DEMO_OTP, useDemoSession } from "@/lib/demo-auth";
import { DemoBadge } from "@/components/common";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Patient Login (Demo OTP) — MediResQ" },
      {
        name: "description",
        content:
          "Prototype patient login flow with simulated Demo OTP verification. No real SMS is sent.",
      },
      { property: "og:title", content: "Patient Login (Demo OTP) — MediResQ" },
      {
        property: "og:description",
        content: "Simulated OTP patient verification for prototype demonstration.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, isLoggedIn, login, logout } = useDemoSession();

  // Step state: 'phone' | 'otp' | 'success'
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccessNotice, setResendSuccessNotice] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const validatePhone = (value: string): boolean => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setPhoneError("Please enter your 10-digit mobile number.");
      return false;
    }
    if (clean.length !== 10) {
      setPhoneError(`Mobile number must be exactly 10 digits (currently ${clean.length}).`);
      return false;
    }
    if (!/^[6-9]/.test(clean)) {
      setPhoneError("Indian mobile numbers must start with 6, 7, 8, or 9.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validatePhone(phone)) return;

    setSendingOtp(true);
    setOtpError("");
    setResendSuccessNotice(false);

    // Simulate short network latency
    setTimeout(() => {
      setSendingOtp(false);
      setStep("otp");
      setResendCooldown(30);
      toast.info("Demo OTP: 123456", {
        description: "Simulated verification code generated. No real SMS sent.",
        duration: 6000,
      });
    }, 450);
  };

  const handleFillDemoPhone = () => {
    setPhone("9876543210");
    setPhoneError("");
  };

  const handleFillDemoOtp = () => {
    setOtp(FIXED_DEMO_OTP);
    setOtpError("");
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOtpError("");

    if (!otp || otp.length < 6) {
      setOtpError("Please enter all 6 digits of the OTP.");
      return;
    }

    setVerifyingOtp(true);

    setTimeout(() => {
      setVerifyingOtp(false);
      if (otp === FIXED_DEMO_OTP) {
        // Success: create prototype session
        const cleanPhone = "+91 " + phone.replace(/\D/g, "");
        login(cleanPhone, "Rohan Sharma (Demo)");
        setStep("success");
        toast.success("Demo OTP verified successfully!", {
          description: "Starting prototype patient session...",
        });

        // Navigate to patient dashboard
        setTimeout(() => {
          navigate({ to: "/patient-dashboard" });
        }, 1200);
      } else {
        // Friendly error for incorrect code
        setOtpError(
          `Invalid code "${otp}". This is a prototype: only the fixed demo OTP 123456 is accepted.`
        );
        toast.error("Incorrect demo OTP", {
          description: "Please enter the fixed prototype OTP: 123456",
        });
      }
    }, 400);
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    setOtpError("");
    setResendSuccessNotice(true);
    setResendCooldown(30);
    toast.info("Simulated OTP Resent: 123456", {
      description: "Demo code regenerated. No SMS was sent to your carrier.",
    });
  };

  const handleEditPhone = () => {
    setStep("phone");
    setOtp("");
    setOtpError("");
    setResendSuccessNotice(false);
  };

  return (
    <div className="mx-auto max-w-xl py-4 sm:py-8">
      {/* Active Session Notice if already logged in */}
      {isLoggedIn && session && step !== "success" && (
        <div className="mb-6 rounded-2xl border border-teal/40 bg-teal-soft/40 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-teal" />
              <div>
                <p className="font-semibold text-primary">
                  Active Prototype Session: {session.patientName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Simulated mobile: {session.phone} · Prototype mode
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="teal">
                <Link to="/patient-dashboard">Go to Dashboard</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  logout();
                  setStep("phone");
                  setPhone("");
                  toast("Prototype session ended");
                }}
              >
                <LogOut className="h-3.5 w-3.5 mr-1" /> End
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
        {/* Card Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
            {step === "otp" ? (
              <KeyRound className="h-7 w-7 text-teal" />
            ) : step === "success" ? (
              <CheckCircle2 className="h-7 w-7 text-success" />
            ) : (
              <Smartphone className="h-7 w-7 text-teal" />
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 mb-2">
            <DemoBadge>Frontend Prototype · Simulated Auth</DemoBadge>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            {step === "otp"
              ? "Verify Demo OTP"
              : step === "success"
              ? "Verification Complete"
              : "Patient Login & Sign Up"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {step === "otp"
              ? "Enter the simulated 6-digit verification code below"
              : step === "success"
              ? "Redirecting you to your prototype patient dashboard..."
              : "Access simulated patient records, appointments & prescriptions"}
          </p>
        </div>

        {/* Global Prototype Notice */}
        <div
          role="note"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning-soft/60 p-3.5 text-xs text-foreground"
        >
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div className="space-y-1">
            <p className="font-semibold text-warning">
              Prototype Environment Notice
            </p>
            <p className="text-muted-foreground">
              No real SMS gateway is connected. No actual SMS messages are sent.
              The fixed demo OTP for verification is{" "}
              <strong className="text-foreground font-mono bg-warning-soft px-1.5 py-0.5 rounded border border-warning/40">
                123456
              </strong>
              .
            </p>
          </div>
        </div>

        {/* STEP 1: Phone Number Input */}
        {step === "phone" && (
          <form onSubmit={handleSendOtp} noValidate className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="mobile-input" className="text-sm font-semibold">
                  Mobile Number *
                </Label>
                <button
                  type="button"
                  onClick={handleFillDemoPhone}
                  className="inline-flex items-center gap-1 text-xs text-teal hover:underline font-medium"
                >
                  <Sparkles className="h-3 w-3" />
                  Fill demo number
                </button>
              </div>

              <div className="flex rounded-xl border bg-background shadow-xs focus-within:ring-2 focus-within:ring-ring">
                <div className="flex items-center gap-1 border-r bg-muted/60 px-3 py-2 text-sm font-medium text-foreground select-none rounded-l-xl">
                  <span className="text-base">🇮🇳</span>
                  <span>+91</span>
                </div>
                <Input
                  id="mobile-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setPhone(digits);
                    if (phoneError) setPhoneError("");
                  }}
                  placeholder="Enter 10-digit number (e.g. 98765 43210)"
                  className="border-0 shadow-none focus-visible:ring-0 text-base"
                  aria-invalid={Boolean(phoneError)}
                  aria-describedby={phoneError ? "phone-error" : undefined}
                />
              </div>

              {phoneError && (
                <p
                  id="phone-error"
                  className="mt-1.5 flex items-center gap-1 text-xs text-destructive font-medium"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {phoneError}
                </p>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">
                Enter any 10-digit number (starts with 6-9). No real personal data
                is stored or linked.
              </p>
            </div>

            <Button
              type="submit"
              variant="teal"
              size="lg"
              className="w-full text-base font-semibold"
              disabled={sendingOtp}
            >
              {sendingOtp ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Demo OTP…
                </>
              ) : (
                <>
                  Send Demo OTP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="rounded-xl border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
              <p>
                By proceeding, you understand this is a demonstration prototype.
                No credentials, passwords, or health records are permanently
                stored.
              </p>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Verification Input */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} noValidate className="space-y-5">
            {/* Mobile number confirmation & edit */}
            <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">
                  Simulated recipient:
                </span>
                <p className="font-semibold text-primary">
                  +91 {phone.slice(0, 5)} {phone.slice(5)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleEditPhone}
                className="text-xs font-medium text-teal hover:text-teal"
              >
                <ArrowLeft className="h-3 w-3 mr-1" /> Change
              </Button>
            </div>

            {/* Prominent Demo OTP Box (Requirement 3 & 9) */}
            <div className="rounded-2xl border-2 border-teal/40 bg-teal-soft/40 p-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-teal">
                <Info className="h-4 w-4" />
                <span>PROTOTYPE SIMULATION · NO REAL SMS SENT</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your fixed demo verification code is:
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="rounded-xl border-2 border-teal bg-card px-4 py-1.5 font-mono text-2xl font-extrabold tracking-widest text-primary shadow-xs">
                  {FIXED_DEMO_OTP}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleFillDemoOtp}
                  className="border-teal text-teal hover:bg-teal hover:text-primary-foreground text-xs font-semibold"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Auto-fill 123456
                </Button>
              </div>
            </div>

            {/* 6-digit OTP Input */}
            <div className="space-y-2">
              <Label htmlFor="otp-slots" className="text-sm font-semibold">
                Enter 6-Digit Demo OTP *
              </Label>
              <div className="flex justify-center py-2">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    if (otpError) setOtpError("");
                  }}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="h-12 w-11 text-lg font-bold rounded-lg border" />
                    <InputOTPSlot index={1} className="h-12 w-11 text-lg font-bold rounded-lg border" />
                    <InputOTPSlot index={2} className="h-12 w-11 text-lg font-bold rounded-lg border" />
                    <InputOTPSlot index={3} className="h-12 w-11 text-lg font-bold rounded-lg border" />
                    <InputOTPSlot index={4} className="h-12 w-11 text-lg font-bold rounded-lg border" />
                    <InputOTPSlot index={5} className="h-12 w-11 text-lg font-bold rounded-lg border" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Error Alert */}
              {otpError && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{otpError}</p>
                    <p className="text-muted-foreground mt-0.5">
                      Hint: Enter exactly <strong>123456</strong> or click
                      "Auto-fill 123456" above.
                    </p>
                  </div>
                </div>
              )}

              {/* Resend simulated confirmation */}
              {resendSuccessNotice && !otpError && (
                <div className="rounded-xl border border-success/30 bg-success-soft p-2.5 text-xs text-success flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    Simulated OTP re-sent: <strong>{FIXED_DEMO_OTP}</strong> (No SMS sent).
                  </span>
                </div>
              )}
            </div>

            {/* Verify OTP Button */}
            <Button
              type="submit"
              variant="teal"
              size="lg"
              className="w-full text-base font-semibold"
              disabled={verifyingOtp || otp.length < 6}
            >
              {verifyingOtp ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Demo Code…
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Verify Demo OTP
                </>
              )}
            </Button>

            {/* Resend OTP Interaction (Requirement 7) */}
            <div className="flex items-center justify-between text-xs pt-1 border-t">
              <span className="text-muted-foreground">
                Didn't catch the demo code?
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="text-teal hover:text-teal font-semibold text-xs h-auto p-1"
              >
                <RotateCw
                  className={`h-3 w-3 mr-1 ${
                    resendCooldown > 0 ? "" : "hover:rotate-180 transition-transform"
                  }`}
                />
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Demo OTP"}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: Verification Success State */}
        {step === "success" && (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">
                Demo OTP Verified!
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Prototype patient session initialized for{" "}
                <strong className="text-foreground">+91 {phone}</strong>
              </p>
            </div>
            <div className="rounded-2xl border border-success/30 bg-success-soft/50 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-success">
                Prototype Session Established
              </p>
              <p className="mt-1">
                You are now signed into the simulated patient portal with sample
                data. No external services or real databases were involved.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
              <Button asChild variant="teal">
                <Link to="/patient-dashboard">Go to Patient Dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Back link */}
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MediResQ Homepage
        </Link>
      </div>
    </div>
  );
}
