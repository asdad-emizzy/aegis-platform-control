import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Canonical Aegis operational environments.
 *
 * This is the OCC-level environment concept: it is independent from
 * infrastructure-level labels (e.g. Cluster.environment, which reflects
 * AWS-account-scoped fleet grouping today). The two will be reconciled
 * once environment identity is backed by a real Platform API.
 */
export type Environment = "sit" | "uat" | "prod";

export const ENVIRONMENTS: { value: Environment; label: string }[] = [
  { value: "sit", label: "SIT" },
  { value: "uat", label: "UAT" },
  { value: "prod", label: "PROD" },
];

const STORAGE_KEY = "aegis.occ.environment";
const DEFAULT_ENVIRONMENT: Environment = "prod";

function isEnvironment(value: string | null): value is Environment {
  return value === "sit" || value === "uat" || value === "prod";
}

interface EnvironmentContextValue {
  environment: Environment;
  setEnvironment: (environment: Environment) => void;
}

const EnvironmentContext = createContext<EnvironmentContextValue | null>(null);

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironmentState] = useState<Environment>(() => {
    if (typeof window === "undefined") return DEFAULT_ENVIRONMENT;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isEnvironment(stored) ? stored : DEFAULT_ENVIRONMENT;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, environment);
  }, [environment]);

  return (
    <EnvironmentContext.Provider value={{ environment, setEnvironment: setEnvironmentState }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) throw new Error("useEnvironment must be used within EnvironmentProvider");
  return ctx;
}
