"use client"; // Mark this component as a client component

import { usePathname } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get current route

  // Define which pages should not show the Dashboard (e.g., login page)
  const noDashboardRoutes = ["/login","/register", "/signup", "/forgot-password"];

  // Check if the current route is in the list of routes that should not show the dashboard
  const isDashboardVisible = !noDashboardRoutes.includes(pathname);

  return <>{isDashboardVisible ? <Dashboard>{children}</Dashboard> : children}</>;
}
