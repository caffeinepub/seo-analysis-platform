import { ScoreRing } from "@/components/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllSEOAudits, useSEOAuditByUrl } from "@/hooks/useQueries";
import { mockSEOAudit } from "@/lib/mockData";
import { scoreBgClass, scoreColorClass } from "@/lib/scoreUtils";
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  FileText,
  Globe,
  Image,
  Link,
  Loader2,
  Search,
  Shield,
  Smartphone,
  Type,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import type { SEOAuditResult } from "../backend";

function BoolCheck({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${
        ok
          ? "border-chart-2/30 bg-chart-2/5"
          : "border-destructive/30 bg-destructive/5"
      }`}
    >
      <span className="text-sm">{label}</span>
      {ok ? (
        <CheckCircle2 className="w-4 h-4 text-chart-2" />
      ) : (
        <XCircle className="w-4 h-4 text-destructive" />
      )}
    </div>
  );
}

function ScoreBar({
  label,
  value,
  max = 100,
}: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const colorClass = scoreColorClass(pct);
  const progressColor =
    pct >= 80 ? "bg-chart-2" : pct >= 50 ? "bg-chart-3" : "bg-destructive";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold ${colorClass}`}>
          {value}
          {max !== 100 ? "" : "%"}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function OnPageTab({ audit }: { audit: SEOAuditResult }) {
  const op = audit.onPage;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <BoolCheck ok={op.titleTagPresent} label="Title Tag Present" />
        <BoolCheck
          ok={op.metaDescriptionPresent}
          label="Meta Description Present"
        />
      </div>
      <div className="space-y-3">
        <ScoreBar
          label="Title Quality Score"
          value={Number(op.titleQualityScore)}
        />
        <ScoreBar
          label="Meta Description Quality"
          value={Number(op.metaDescriptionQuality)}
        />
        <ScoreBar
          label="Keyword Density"
          value={op.keywordDensityScore}
          max={5}
        />
        <ScoreBar
          label="Image Alt Tag Coverage"
          value={op.imageAltTagCoverage}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "H1 Tags", value: Number(op.h1Count), icon: Type },
          { label: "H2 Tags", value: Number(op.h2Count), icon: Type },
          { label: "H3 Tags", value: Number(op.h3Count), icon: Type },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border">
            <CardContent className="pt-4 pb-4 text-center">
              <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold font-display">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <Link className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Internal Links</p>
              <p className="text-2xl font-bold font-display">
                {Number(op.internalLinkCount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OffPageTab({ audit }: { audit: SEOAuditResult }) {
  const op = audit.offPage;
  const da = Number(op.domainAuthorityScore);
  return (
    <div className="space-y-4">
      <div className="flex justify-center py-2">
        <div className="text-center">
          <ScoreRing score={da} size={130} label="DA" />
          <p className="mt-2 font-display font-semibold">Domain Authority</p>
          <p className="text-xs text-muted-foreground">Score out of 100</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-3xl font-bold font-display text-primary">
              {Number(op.backlinkCountEstimate).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated Backlinks
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-3xl font-bold font-display text-primary">
              {Number(op.socialSignalsCount).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Social Signals</p>
          </CardContent>
        </Card>
      </div>
      <div className="p-4 rounded-lg border border-border bg-muted/20 text-sm text-muted-foreground space-y-1.5">
        <p className="font-medium text-foreground">About Off-Page SEO</p>
        <p>
          Domain Authority (DA) predicts how likely your site is to rank in
          search engines. Scores above 50 are considered good, above 70
          excellent.
        </p>
        <p>
          Backlinks from authoritative domains signal trust. Social signals
          indicate content engagement and brand visibility.
        </p>
      </div>
    </div>
  );
}

function TechnicalTab({ audit }: { audit: SEOAuditResult }) {
  const t = audit.technical;
  const speed = Number(t.pageSpeedScore);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/20">
        <ScoreRing score={speed} size={80} strokeWidth={8} />
        <div>
          <p className="font-display font-semibold">Page Speed Score</p>
          <p className="text-xs text-muted-foreground">
            Based on Core Web Vitals metrics
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <BoolCheck ok={t.sslEnabled} label="SSL / HTTPS Enabled" />
        <BoolCheck ok={t.mobileFriendly} label="Mobile Friendly" />
        <BoolCheck ok={t.sitemapPresent} label="Sitemap Present" />
        <BoolCheck ok={t.robotsTxtPresent} label="robots.txt Present" />
        <BoolCheck ok={t.canonicalTagPresent} label="Canonical Tags" />
        <BoolCheck ok={t.structuredDataPresent} label="Structured Data" />
      </div>
    </div>
  );
}

function NonTechnicalTab({ audit }: { audit: SEOAuditResult }) {
  const nt = audit.nonTechnical;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <ScoreBar
          label="Content Quality Score"
          value={Number(nt.contentQualityScore)}
        />
        <ScoreBar
          label="Readability Score"
          value={Number(nt.readabilityScore)}
        />
        <ScoreBar
          label="Keyword Usage Score"
          value={Number(nt.keywordUsageScore)}
        />
      </div>
      <Card className="border-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Content Length</p>
              <p className="text-2xl font-bold font-display">
                {Number(nt.contentLengthWords).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">words</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="p-4 rounded-lg border border-border bg-muted/20 text-sm text-muted-foreground space-y-1.5">
        <p className="font-medium text-foreground">Content Recommendations</p>
        <p>
          Aim for 1,500–2,500 words for comprehensive coverage. Readability
          scores above 60 indicate accessible content for a wide audience.
        </p>
      </div>
    </div>
  );
}

export function SEOAnalysis() {
  const [inputUrl, setInputUrl] = useState("");
  const [queryUrl, setQueryUrl] = useState("");

  const { data: auditData, isLoading } = useSEOAuditByUrl(queryUrl);

  const handleAnalyze = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    const normalized = trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed}`;
    setQueryUrl(normalized);
  };

  const displayAudit: SEOAuditResult | null =
    auditData !== undefined ? auditData : queryUrl ? null : mockSEOAudit;

  const isMockData = !queryUrl;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* URL Input */}
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            SEO Audit Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              data-ocid="seo.url.input"
              placeholder="https://example.com"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <Button
              data-ocid="seo.analyze.button"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      {isLoading ? (
        <Card className="border-border" data-ocid="seo.loading_state">
          <CardContent className="pt-6 pb-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ) : displayAudit ? (
        <div className="animate-fade-in">
          {isMockData && (
            <div className="mb-4 p-3 rounded-lg border border-chart-3/40 bg-chart-3/5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-chart-3 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Showing demo data for{" "}
                <span className="font-medium text-foreground">example.com</span>
                . Enter a URL above to analyze a real site.
              </p>
            </div>
          )}
          <Tabs defaultValue="onpage">
            <TabsList className="grid grid-cols-4 w-full mb-4">
              <TabsTrigger value="onpage" data-ocid="seo.onpage.tab">
                On-Page
              </TabsTrigger>
              <TabsTrigger value="offpage" data-ocid="seo.offpage.tab">
                Off-Page
              </TabsTrigger>
              <TabsTrigger value="technical" data-ocid="seo.technical.tab">
                Technical
              </TabsTrigger>
              <TabsTrigger
                value="nontechnical"
                data-ocid="seo.nontechnical.tab"
              >
                Content
              </TabsTrigger>
            </TabsList>
            <TabsContent value="onpage">
              <Card className="border-border shadow-card">
                <CardContent className="pt-5">
                  <OnPageTab audit={displayAudit} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="offpage">
              <Card className="border-border shadow-card">
                <CardContent className="pt-5">
                  <OffPageTab audit={displayAudit} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="technical">
              <Card className="border-border shadow-card">
                <CardContent className="pt-5">
                  <TechnicalTab audit={displayAudit} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="nontechnical">
              <Card className="border-border shadow-card">
                <CardContent className="pt-5">
                  <NonTechnicalTab audit={displayAudit} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div
          className="p-6 rounded-lg border border-border bg-card text-center"
          data-ocid="seo.empty_state"
        >
          <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No audit data found for{" "}
            <span className="font-medium text-foreground">{queryUrl}</span>.
          </p>
        </div>
      )}
    </div>
  );
}
