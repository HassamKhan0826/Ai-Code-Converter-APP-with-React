import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "./Button.jsx";
import { useAuth } from "../hooks/useAuth";
import { describePuterError } from "../services/puter";

/** Shows the Puter sign-in state in the header. */
export function AccountButton() {
  const { status, user, signIn, signOut } = useAuth();
  const [error, setError] = useState("");

  if (status === "checking") {
    return <div className="h-8 w-28 animate-pulse rounded-lg bg-ink-800" aria-label="Checking sign-in" />;
  }

  if (status === "unavailable") {
    return (
      <span role="alert" className="text-sm text-coral">
        Puter couldn&apos;t load. Check your connection and reload.
      </span>
    );
  }

  if (status === "signedIn") {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-mist sm:inline">
          Signed in as <span className="font-medium text-paper">{user?.username ?? "Puter user"}</span>
        </span>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>
    );
  }

  const handleSignIn = async () => {
    setError("");
    try {
      await signIn();
    } catch (err) {
      setError(describePuterError(err));
    }
  };

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span role="alert" className="hidden max-w-xs text-xs text-coral md:inline">
          {error}
        </span>
      )}
      <Button variant="secondary" size="sm" onClick={handleSignIn}>
        <LogIn className="h-4 w-4" aria-hidden="true" />
        <span className="sm:hidden">Sign in</span>
        <span className="hidden sm:inline">Sign in with Puter</span>
      </Button>
    </div>
  );
}
