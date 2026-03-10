import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllWebsiteStatuses,
  useWebsiteStatusByUrl,
} from "@/hooks/useQueries";
import { mockWebsiteStatuses } from "@/lib/mockData";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  Wifi,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import type { WebsiteStatus as WS } from "../backend";

function ResponseTimeBar({ ms }: { ms: number }) {
  const pct = Math.min(100, (ms / 2000) * 100);
  const color =
    ms < 300 ? "bg-chart-2" : ms < 800 ? "bg-chart-3" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-14 text-right">
        {ms}ms
      </span>
    </div>
  );
}

function StatusCard({ site, index }: { site: WS; index: number }) {
  const uptime = site.uptimePercentage;
  const uptimeColor =
    uptime >= 99
      ? "text-chart-2"
      : uptime >= 95
        ? "text-chart-3"
        : "text-destructive";

  return (
    <Card
      className="border-border shadow-card"
      data-ocid={`status.item.${index}`}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium truncate">{site.url}</span>
          </div>
          <Badge
            variant="outline"
            className={`flex-shrink-0 text-xs ${
              site.isOnline
                ? "border-chart-2/40 bg-chart-2/10 text-chart-2"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {site.isOnline ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Online
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">HTTP Status:</span>
            <span className="font-mono font-semibold">
              {Number(site.httpStatusCode)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-muted-foreground" />
            <span className={`font-semibold ${uptimeColor}`}>
              {uptime.toFixed(1)}% uptime
            </span>
          </div>
        </div>
        <ResponseTimeBar ms={Number(site.responseTimeMs)} />
      </CardContent>
    </Card>
  );
}

export function WebsiteStatus() {
  const [inputUrl, setInputUrl] = useState("");
  const [queryUrl, setQueryUrl] = useState("");

  const { data: allStatuses, isLoading: allLoading } = useAllWebsiteStatuses();
  const { data: checkedStatus, isLoading: checkLoading } =
    useWebsiteStatusByUrl(queryUrl);

  const displayStatuses =
    allStatuses && allStatuses.length > 0 ? allStatuses : mockWebsiteStatuses;
  const isMockData = !allStatuses || allStatuses.length === 0;

  const handleCheck = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    const normalized = trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed}`;
    setQueryUrl(normalized);
  };

  const resultSite: WS | null =
    checkedStatus !== undefined ? checkedStatus : null;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* URL Checker */}
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Website Status Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              data-ocid="status.url.input"
              placeholder="https://example.com"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              className="flex-1"
            />
            <Button
              data-ocid="status.check.button"
              onClick={handleCheck}
              disabled={checkLoading}
              className="gap-2"
            >
              {checkLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {checkLoading ? "Checking..." : "Check Status"}
            </Button>
          </div>

          {/* Result */}
          {queryUrl && (
            <div>
              {checkLoading ? (
                <div data-ocid="status.loading_state" className="space-y-2">
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              ) : resultSite ? (
                <div
                  className="p-4 rounded-lg border border-border bg-muted/30 animate-fade-in"
                  data-ocid="status.success_state"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">
                      {resultSite.url}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        resultSite.isOnline
                          ? "border-chart-2/40 bg-chart-2/10 text-chart-2"
                          : "border-destructive/40 bg-destructive/10 text-destructive"
                      }
                    >
                      {resultSite.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">HTTP Code</p>
                      <p className="font-mono font-bold text-base">
                        {Number(resultSite.httpStatusCode)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Response Time</p>
                      <p className="font-bold text-base">
                        {Number(resultSite.responseTimeMs)}ms
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Uptime</p>
                      <p className="font-bold text-base">
                        {resultSite.uptimePercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="p-4 rounded-lg border border-chart-3/40 bg-chart-3/5 flex items-center gap-2 animate-fade-in"
                  data-ocid="status.error_state"
                >
                  <AlertCircle className="w-4 h-4 text-chart-3 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    No data found for{" "}
                    <span className="font-medium text-foreground">
                      {queryUrl}
                    </span>
                    . Showing demo data below.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Websites */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Monitored Websites
            {isMockData && (
              <Badge variant="outline" className="text-xs font-normal">
                Demo Data
              </Badge>
            )}
          </h2>
          <span className="text-sm text-muted-foreground">
            {displayStatuses.length} sites
          </span>
        </div>

        {allLoading ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-ocid="status.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayStatuses.map((site, i) => (
              <StatusCard key={site.url} site={site} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
