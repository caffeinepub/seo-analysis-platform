import { ScoreRing } from "@/components/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllWebsiteStatuses, useDashboardSummary } from "@/hooks/useQueries";
import { mockDashboardSummary, mockWebsiteStatuses } from "@/lib/mockData";
import { scoreBgClass, scoreColorClass } from "@/lib/scoreUtils";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Clock,
  FileSearch,
  Globe,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { DashboardSummary, WebsiteStatus } from "../backend";

type Page =
  | "dashboard"
  | "status"
  | "seo"
  | "optimization"
  | "index"
  | "keyword";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString();
}

function HealthScoreCard({ summary }: { summary: DashboardSummary }) {
  const health = Number(summary.overallHealthScore);
  const seo = Number(summary.seoScore);
  const perf = Number(summary.performanceScore);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-border shadow-card">
        <CardContent className="pt-6 flex flex-col items-center gap-3">
          <ScoreRing score={health} size={110} label="Health" />
          <div className="text-center">
            <p className="font-display font-semibold text-base">
              Overall Health
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {health >= 80
                ? "Excellent performance"
                : health >= 50
                  ? "Needs attention"
                  : "Critical issues"}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border shadow-card">
        <CardContent className="pt-6 flex flex-col items-center gap-3">
          <ScoreRing score={seo} size={110} label="SEO" />
          <div className="text-center">
            <p className="font-display font-semibold text-base">SEO Score</p>
            <p className="text-xs text-muted-foreground mt-1">
              On-page, off-page &amp; technical
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border shadow-card">
        <CardContent className="pt-6 flex flex-col items-center gap-3">
          <ScoreRing score={perf} size={110} label="Perf" />
          <div className="text-center">
            <p className="font-display font-semibold text-base">Performance</p>
            <p className="text-xs text-muted-foreground mt-1">
              Speed &amp; optimization metrics
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-border shadow-card">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold font-display">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WebsiteStatusMini({ site }: { site: WebsiteStatus }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            site.isOnline ? "bg-chart-2" : "bg-destructive"
          }`}
        />
        <span className="text-sm truncate text-foreground">{site.url}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span className="text-xs text-muted-foreground">
          {Number(site.responseTimeMs)}ms
        </span>
        <Badge
          variant="outline"
          className={`text-xs ${
            site.isOnline
              ? "border-chart-2 text-chart-2"
              : "border-destructive text-destructive"
          }`}
        >
          {site.isOnline ? "Online" : "Offline"}
        </Badge>
      </div>
    </div>
  );
}

const QUICK_ACTIONS: {
  id: Page;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    id: "status",
    label: "Check Website Status",
    desc: "Monitor uptime & response times",
    icon: Globe,
  },
  {
    id: "seo",
    label: "Run SEO Analysis",
    desc: "Full on/off-page audit",
    icon: Search,
  },
  {
    id: "optimization",
    label: "Get Optimization Tips",
    desc: "Frontend & backend improvements",
    icon: Zap,
  },
  {
    id: "index",
    label: "Check Index Status",
    desc: "Google indexability check",
    icon: FileSearch,
  },
  {
    id: "keyword",
    label: "Keyword Research",
    desc: "Competitor SERP analysis",
    icon: BarChart2,
  },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const { data: summaryData, isLoading: summaryLoading } =
    useDashboardSummary();
  const { data: statusesData, isLoading: statusesLoading } =
    useAllWebsiteStatuses();

  const summary = summaryData ?? mockDashboardSummary;
  const statuses =
    statusesData && statusesData.length > 0
      ? statusesData
      : mockWebsiteStatuses;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Score Cards */}
      {summaryLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          data-ocid="dashboard.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border">
              <CardContent className="pt-6">
                <Skeleton className="w-28 h-28 rounded-full mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <HealthScoreCard summary={summary} />
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Globe}
          label="Sites Analyzed"
          value={
            summaryLoading ? "—" : Number(summary.totalSitesAnalyzed).toString()
          }
        />
        <StatCard
          icon={AlertTriangle}
          label="Issues Found"
          value={
            summaryLoading ? "—" : Number(summary.totalIssuesFound).toString()
          }
        />
        <StatCard
          icon={Clock}
          label="Last Updated"
          value={summaryLoading ? "—" : formatTimestamp(summary.lastUpdated)}
        />
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Websites */}
        <Card className="border-border shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Recent Website Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusesLoading ? (
              <div className="space-y-3" data-ocid="status.loading_state">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div>
                {statuses.slice(0, 5).map((site) => (
                  <WebsiteStatusMini key={site.url} site={site} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {QUICK_ACTIONS.map(({ id, label, desc, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
