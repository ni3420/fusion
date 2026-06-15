"use client";

import { useState } from "react";
import { AuthFLow } from "../types";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";

export default function AuthPage() {
  const [state, setState] = useState<AuthFLow>("login");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-md">
        {state === "login" ? (
          <LoginCard onSwitchToRegister={() => setState("register")} />
        ) : (
          <RegisterCard onSwitchToLogin={() => setState("login")} />
        )}
      </div>
    </div>
  );
}