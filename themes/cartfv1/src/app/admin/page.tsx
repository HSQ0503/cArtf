"use client";

import { useCallback, useEffect, useState } from "react";
import TutorialsPanel from "./TutorialsPanel";
import DiyPanel from "./DiyPanel";

type Toast = {
  message: string;
  type: "success" | "error";
};

type Section = "tutorials" | "diy";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_password");
    if (stored) {
      fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: stored }),
      }).then((res) => {
        if (res.ok) {
          setPassword(stored);
          setAuthenticated(true);
        } else {
          sessionStorage.removeItem("admin_password");
        }
        setChecking(false);
      });
    } else {
      setChecking(false);
    }
  }, []);

  const handleLogin = async (pw: string) => {
    const res = await fetch("/api/tutorials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      setPassword(pw);
      setAuthenticated(true);
      sessionStorage.setItem("admin_password", pw);
      return true;
    }
    return false;
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body">
        <p className="text-text-light">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <AdminShell password={password} />;
}

function LoginForm({
  onLogin,
}: {
  onLogin: (pw: string) => Promise<boolean>;
}) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const ok = await onLogin(pw);
    if (!ok) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-body">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8">
        <h1 className="text-2xl font-secondary font-bold text-text-dark text-center mb-2">
          Admin Panel
        </h1>
        <p className="text-text-light text-sm text-center mb-8">
          Enter the admin password to continue
        </p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          required
          autoFocus
          className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary ${
            error ? "border-red-400" : "border-border"
          }`}
        />
        {error && (
          <p className="text-red-500 text-xs mt-2">Incorrect password</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 px-4 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {loading ? "Checking..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

function AdminShell({ password }: { password: string }) {
  const [section, setSection] = useState<Section>("tutorials");
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  const handleLogout = () => {
    sessionStorage.removeItem("admin_password");
    window.location.reload();
  };

  const sectionMeta: Record<Section, { title: string; subtitle: string }> = {
    tutorials: {
      title: "Tutorial Admin",
      subtitle: "Manage categories and videos",
    },
    diy: {
      title: "Draw It Yourself Admin",
      subtitle: "Manage the gallery wall videos",
    },
  };

  return (
    <div className="min-h-screen bg-body">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="container py-8">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-secondary font-bold text-text-dark">
              {sectionMeta[section].title}
            </h1>
            <p className="text-text-light text-sm mt-1">
              {sectionMeta[section].subtitle}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-border/50 transition-colors"
          >
            Log Out
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-border">
          <SectionTab
            active={section === "tutorials"}
            onClick={() => setSection("tutorials")}
            label="Tutorials"
          />
          <SectionTab
            active={section === "diy"}
            onClick={() => setSection("diy")}
            label="Draw It Yourself"
          />
        </div>

        {section === "tutorials" && (
          <TutorialsPanel password={password} showToast={showToast} />
        )}
        {section === "diy" && (
          <DiyPanel password={password} showToast={showToast} />
        )}
      </div>
    </div>
  );
}

function SectionTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-text-light hover:text-text"
      }`}
    >
      {label}
    </button>
  );
}
