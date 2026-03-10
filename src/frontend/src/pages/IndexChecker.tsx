import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useIndexCheckerStatus } from "@/hooks/useQueries";
import { mockIndexCheckerStatus } from "@/lib/mockData";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  FileSearch,
  Info,
  Loader2,
  ShieldCheck,
  ShieldX,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export function IndexChecker() {
  const [inputUrl, setInputUrl] = useState("");
  const [queryUrl, setQueryUrl] = useState("");

  const { data: indexData, isLoading } = useIndexCheckerStatus(queryUrl);

  const handleCheck = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    const normalized = trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed}`;
    setQueryUrl(normalized);
  };

  const displayData =
    indexData !== undefined
      ? indexData
      : queryUrl
        ? null
        : mockIndexCheckerStatus;

  const isMockData = !queryUrl;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Input */}
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-primary" />
            Google Index Checker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              data-ocid="index.url.input"
              placeholder="https://example.com"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              className="flex-1"
            />
            <Button
              data-ocid="index.check.button"
              onClick={handleCheck}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Checking..." : "Check Index"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div data-ocid="index.loading_state" className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : displayData ? (
        <div className="space-y-4 animate-fade-in">
          {isMockData && (
            <div className="p-3 rounded-lg border border-chart-3/40 bg-chart-3/5 flex items-center gap-2">
              <Info className="w-4 h-4 text-chart-3 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Showing demo data. Enter a URL above to check real indexation
                status.
              </p>
            </div>
          )}

          {/* Main Status Card */}
          <Card
            className={`border shadow-card ${
              displayData.isIndexed
                ? "border-chart-2/40"
                : "border-destructive/40"
            }`}
            data-ocid="index.card"
          >
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    displayData.isIndexed
                      ? "bg-chart-2/15"
                      : "bg-destructive/15"
                  }`}
                >
                  {displayData.isIndexed ? (
                    <CheckCircle2 className="w-6 h-6 text-chart-2" />
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-display font-bold text-lg">
                    {displayData.isIndexed
                      ? "Page is Indexed"
                      : "Page Not Indexed"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {displayData.url}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-auto ${
                    displayData.isIndexed
                      ? "border-chart-2/40 bg-chart-2/10 text-chart-2"
                      : "border-destructive/40 bg-destructive/10 text-destructive"
                  }`}
                >
                  {displayData.isIndexed ? "Indexed" : "Not Indexed"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Status Checks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="border-border">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldX className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Noindex Tag</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      displayData.noindexTagPresent
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-chart-2/40 bg-chart-2/10 text-chart-2"
                    }
                  >
                    {displayData.noindexTagPresent ? "Present" : "Not Found"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Robots.txt Block</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      displayData.robotsBlocked
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-chart-2/40 bg-chart-2/10 text-chart-2"
                    }
                  >
                    {displayData.robotsBlocked ? "Blocked" : "Allowed"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Issues */}
          {displayData.indexabilityIssues.length > 0 && (
            <Card className="border-chart-3/40 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-sm flex items-center gap-2 text-chart-3">
                  <AlertTriangle className="w-4 h-4" />
                  Indexability Issues ({displayData.indexabilityIssues.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {displayData.indexabilityIssues.map((issue, i) => (
                  <div
                    key={issue.slice(0, 30)}
                    data-ocid={`index.item.${i + 1}`}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-chart-3/5 border border-chart-3/20"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-chart-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{issue}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                What Affects Indexability?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">Noindex tags</strong> — Meta
                robots or X-Robots-Tag with noindex prevent pages from appearing
                in search results.
              </p>
              <p>
                <strong className="text-foreground">robots.txt</strong> —
                Blocking Googlebot in your robots.txt stops crawling but may not
                remove already-indexed pages.
              </p>
              <p>
                <strong className="text-foreground">Canonical tags</strong> —
                Pointing canonical to a different URL tells Google to index the
                canonical instead.
              </p>
              <p>
                <strong className="text-foreground">Thin content</strong> —
                Pages with very little unique content may be excluded from the
                index algorithmically.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div
          className="p-8 rounded-lg border border-dashed border-border text-center"
          data-ocid="index.empty_state"
        >
          <FileSearch className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No index data found for{" "}
            <span className="font-medium text-foreground">{queryUrl}</span>.
          </p>
        </div>
      )}
    </div>
  );
}
