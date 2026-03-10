import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useOptimizationTips } from "@/hooks/useQueries";
import { mockOptimizationTips } from "@/lib/mockData";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Monitor,
  Server,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { OptimizationTip } from "../backend";

function ImpactBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    high: "border-destructive/40 bg-destructive/10 text-destructive",
    medium: "border-chart-3/40 bg-chart-3/10 text-chart-3",
    low: "border-chart-2/40 bg-chart-2/10 text-chart-2",
  };
  return (
    <Badge
      variant="outline"
      className={`text-xs capitalize ${styles[level] ?? styles.low}`}
    >
      {level} impact
    </Badge>
  );
}

function TipCard({ tip, index }: { tip: OptimizationTip; index: number }) {
  return (
    <Card
      className={`border-border shadow-card transition-all ${
        tip.implemented ? "opacity-70" : ""
      }`}
      data-ocid={`optimization.item.${index}`}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            {tip.implemented ? (
              <CheckCircle2 className="w-4 h-4 text-chart-2" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p
                className={`text-sm font-semibold ${tip.implemented ? "line-through text-muted-foreground" : ""}`}
              >
                {tip.title}
              </p>
              <ImpactBadge level={tip.impactLevel} />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tip.description}
            </p>
            {tip.implemented && (
              <p className="text-xs text-chart-2 mt-1.5 font-medium">
                ✓ Implemented
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OptimizationTips() {
  const [inputUrl, setInputUrl] = useState("");
  const [queryUrl, setQueryUrl] = useState("");

  const { data: tipsData, isLoading } = useOptimizationTips(queryUrl);

  const handleLoad = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    const normalized = trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed}`;
    setQueryUrl(normalized);
  };

  const tips =
    tipsData && tipsData.length > 0 ? tipsData : mockOptimizationTips;

  const isMockData = !queryUrl || !tipsData || tipsData.length === 0;
  const frontendTips = tips.filter((t) => t.category === "frontend");
  const backendTips = tips.filter((t) => t.category === "backend");

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* URL Input */}
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              data-ocid="optimization.url.input"
              placeholder="https://example.com"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoad()}
              className="flex-1"
            />
            <Button
              data-ocid="optimization.load.button"
              onClick={handleLoad}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Loading..." : "Load Tips"}
            </Button>
          </div>
          {isMockData && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing general optimization tips. Enter a URL for site-specific
              recommendations.
            </p>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          data-ocid="optimization.loading_state"
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Frontend */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-base flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              Frontend Optimizations
              <Badge variant="secondary" className="text-xs">
                {frontendTips.length}
              </Badge>
            </h2>
            {frontendTips.length > 0 ? (
              frontendTips.map((tip, i) => (
                <TipCard key={tip.title} tip={tip} index={i + 1} />
              ))
            ) : (
              <div
                className="p-6 rounded-lg border border-dashed border-border text-center"
                data-ocid="optimization.empty_state"
              >
                <p className="text-sm text-muted-foreground">
                  No frontend tips available.
                </p>
              </div>
            )}
          </div>

          {/* Backend */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-base flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              Backend Optimizations
              <Badge variant="secondary" className="text-xs">
                {backendTips.length}
              </Badge>
            </h2>
            {backendTips.length > 0 ? (
              backendTips.map((tip, i) => (
                <TipCard key={tip.title} tip={tip} index={i + 1} />
              ))
            ) : (
              <div
                className="p-6 rounded-lg border border-dashed border-border text-center"
                data-ocid="optimization.empty_state"
              >
                <p className="text-sm text-muted-foreground">
                  No backend tips available.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
