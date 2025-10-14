import { api } from "../api/api";
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

let authState: {
  isAuthenticated: boolean;
  user: any;
  lastCheck: number;
} | null = null;

let isCheckingAuth = false;
const CACHE_DURATION = 5 * 60 * 1000;

const isAuthenticated = async (): Promise<boolean> => {
  // Return cached result if recent
  if (authState && Date.now() - authState.lastCheck < CACHE_DURATION) {
    return authState.isAuthenticated;
  }

  // Prevent multiple simultaneous auth checks
  if (isCheckingAuth) {
    return false;
  }

  isCheckingAuth = true;

  try {
    const response = await api.me();
    authState = {
      isAuthenticated: true,
      user: response.user,
      lastCheck: Date.now(),
    };
    return true;
  } catch (error) {
    console.log("Auth failed:", error);
    authState = {
      isAuthenticated: false,
      user: null,
      lastCheck: Date.now(),
    };
    return false;
  } finally {
    isCheckingAuth = false;
  }
};

export const clearAuthCache = () => {
  authState = null;
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (!(await isAuthenticated())) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}
