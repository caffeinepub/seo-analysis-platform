import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Globe,
  LayoutDashboard,
  Moon,
  Search,
  Sun,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { IndexChecker } from "./pages/IndexChecker";
import { KeywordResearch } from "./pages/KeywordResearch";
import { OptimizationTips } from "./pages/OptimizationTips";
import { SEOAnalysis } from "./pages/SEOAnalysis";
import { WebsiteStatus } from "./pages/WebsiteStatus";

type Page =
  | "dashboard"
  | "status"
  | "seo"
  | "optimization"
  | "index"
  | "keyword";

const NAV_ITEMS: {
  id: Page;
  label: string;
  icon: React.ElementType;
  ocid: string;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  {
    id: "status",
    label: "Website Status",
    icon: Globe,
    ocid: "nav.status.link",
  },
  { id: "seo", label: "SEO Analysis", icon: Search, ocid: "nav.seo.link" },
  {
    id: "optimization",
    label: "Optimization",
    icon: Zap,
    ocid: "nav.optimization.link",
  },
  {
    id: "index",
    label: "Index Checker",
    icon: FileSearch,
    ocid: "nav.index.link",
  },
  {
    id: "keyword",
    label: "Keyword Research",
    icon: BarChart2,
    ocid: "nav.keyword.link",
  },
];

function getInitialTheme(): "dark" | "light" {
  try {
    const stored = localStorage.getItem("seo-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore
  }
  return "dark";
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    try {
      localStorage.setItem("seo-theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 relative flex-shrink-0",
          sidebarCollapsed ? "w-16" : "w-60",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center gap-3 px-4 h-16 border-b border-sidebar-border",
            sidebarCollapsed && "justify-center px-0",
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary flex-shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-display font-bold text-base text-sidebar-foreground tracking-tight">
              SEO<span className="text-primary">Pulse</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon, ocid }) => (
            <button
              key={id}
              data-ocid={ocid}
              type="button"
              onClick={() => setPage(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                sidebarCollapsed && "justify-center px-0",
                page === id
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed((c) => !c)}
          className="absolute -right-3 top-20 bg-card border border-border rounded-full p-0.5 shadow-xs hover:bg-accent transition-colors z-10"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-muted-foreground" />
          )}
        </button>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-t border-sidebar-border">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Built with caffeine.ai
              </a>
            </p>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 h-16 border-b border-border bg-card flex-shrink-0">
          <div>
            <h1 className="font-display font-semibold text-lg text-foreground">
              {NAV_ITEMS.find((n) => n.id === page)?.label}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            data-ocid="theme.toggle"
            className="gap-2"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {page === "dashboard" && <Dashboard onNavigate={setPage} />}
          {page === "status" && <WebsiteStatus />}
          {page === "seo" && <SEOAnalysis />}
          {page === "optimization" && <OptimizationTips />}
          {page === "index" && <IndexChecker />}
          {page === "keyword" && <KeywordResearch />}
        </main>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}
