import { useState, useEffect } from "react";

export interface DemoSession {
  isLoggedIn: boolean;
  phone: string;
  patientName: string;
  patientId: string;
  verifiedAt: string;
  isPrototype: true;
}

const STORAGE_KEY = "mediresq_demo_patient_session";
const SESSION_CHANGE_EVENT = "mediresq_demo_session_change";

export const FIXED_DEMO_OTP = "123456";

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

export function saveDemoSession(phone: string, patientName = "Rohan Sharma (Demo)"): DemoSession {
  const session: DemoSession = {
    isLoggedIn: true,
    phone,
    patientName,
    patientId: "MRQ-DEMO-0001",
    verifiedAt: new Date().toISOString(),
    isPrototype: true,
  };

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
    } catch (e) {
      console.warn("Unable to save session to sessionStorage", e);
    }
  }

  return session;
}

export function clearDemoSession(): void {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
    } catch (e) {
      console.warn("Unable to clear session", e);
    }
  }
}

export function useDemoSession() {
  const [session, setSession] = useState<DemoSession | null>(() => getDemoSession());

  useEffect(() => {
    const handleUpdate = () => {
      setSession(getDemoSession());
    };

    window.addEventListener(SESSION_CHANGE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(SESSION_CHANGE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    session,
    isLoggedIn: Boolean(session?.isLoggedIn),
    login: saveDemoSession,
    logout: clearDemoSession,
  };
}
