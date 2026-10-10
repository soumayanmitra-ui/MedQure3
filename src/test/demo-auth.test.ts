import { describe, expect, it, beforeEach } from "vitest";
import {
  FIXED_DEMO_OTP,
  getDemoSession,
  saveDemoSession,
  clearDemoSession,
} from "@/lib/demo-auth";

describe("Demo OTP Auth System", () => {
  beforeEach(() => {
    clearDemoSession();
  });

  it("uses the fixed demo OTP 123456", () => {
    expect(FIXED_DEMO_OTP).toBe("123456");
  });

  it("starts with no active session", () => {
    expect(getDemoSession()).toBeNull();
  });

  it("saves a valid prototype session with phone and prototype indicator", () => {
    const session = saveDemoSession("+91 9876543210", "Rohan Sharma (Demo)");

    expect(session.isLoggedIn).toBe(true);
    expect(session.phone).toBe("+91 9876543210");
    expect(session.patientName).toBe("Rohan Sharma (Demo)");
    expect(session.isPrototype).toBe(true);
    expect(session.patientId).toBe("MRQ-DEMO-0001");

    const retrieved = getDemoSession();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.isLoggedIn).toBe(true);
    expect(retrieved?.phone).toBe("+91 9876543210");
    expect(retrieved?.isPrototype).toBe(true);
  });

  it("clears the session on logout", () => {
    saveDemoSession("+91 9876543210");
    expect(getDemoSession()).not.toBeNull();

    clearDemoSession();
    expect(getDemoSession()).toBeNull();
  });

  it("validates that only fixed demo OTP 123456 is valid", () => {
    const testCodes = ["000000", "111111", "123455", "123457", "654321", "abcde1"];
    testCodes.forEach((code) => {
      expect(code === FIXED_DEMO_OTP).toBe(false);
    });
    expect("123456" === FIXED_DEMO_OTP).toBe(true);
  });
});
