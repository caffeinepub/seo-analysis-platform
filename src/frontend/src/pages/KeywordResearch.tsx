import { ScoreRing } from "@/components/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useKeywordAnalysis } from "@/hooks/useQueries";
import { mockKeywordAnalysis } from "@/lib/mockData";
import {
  AlertCircle,
  BarChart2,
  Loader2,
  Search,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import type { KeywordAnalysis } from "../backend";

function DifficultyBadge({ score }: { score: number }) {
  if (score >= 70)
    return (
      <Badge
        variant="outline"
        className="border-destructive/40 bg-destructive/10 text-destructive text-xs"
      >
        Hard ({score})
      </Badge>
    );
  if (score >= 40)
    return (
      <Badge
        variant="outline"
        className="border-chart-3/40 bg-chart-3/10 text-chart-3 text-xs"
      >
        Medium ({score})
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="border-chart-2/40 bg-chart-2/10 text-chart-2 text-xs"
    >
      Easy ({score})
    </Badge>
  );
}

function KeywordResults({
  analysis,
  competitor,
}: { analysis: KeywordAnalysis; competitor: string }) {
  const difficulty = Number(analysis.keywordDifficulty);
  const volume = Number(analysis.searchVolumeEstimate);

  return (
    <div className="space-y-4 animate-fade-in" data-ocid="keyword.card">
      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border shadow-card">
          <CardContent className="pt-5 pb-5 flex items-center gap-3">
            <Search className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold font-display">
                {volume.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Monthly Search Volume
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-card">
          <CardContent className="pt-5 pb-5 flex items-center gap-3">
            <div className="flex-shrink-0">
              <ScoreRing score={difficulty} size={60} strokeWidth={6} />
            </div>
            <div>
              <DifficultyBadge score={difficulty} />
              <p className="text-xs text-muted-foreground mt-1">
                Keyword Difficulty
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-card">
          <CardContent className="pt-5 pb-5 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium text-sm truncate max-w-[120px]">
                {analysis.competitorDomain || competitor}
              </p>
              <p className="text-xs text-muted-foreground">
                Tracked Competitor
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SERP Table */}
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Top 10 SERP Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table data-ocid="keyword.table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis.top10Positions.map((pos, i) => {
                const isCompetitor =
                  pos.domain === (analysis.competitorDomain || competitor);
                return (
                  <TableRow
                    key={pos.domain}
                    data-ocid={`keyword.row.${i + 1}`}
                    className={isCompetitor ? "bg-primary/5" : ""}
                  >
                    <TableCell className="font-mono font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${
                          Number(pos.position) <= 3
                            ? "bg-chart-3/20 text-chart-3 font-bold"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        #{Number(pos.position)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{pos.domain}</TableCell>
                    <TableCell className="text-right">
                      {isCompetitor ? (
                        <Badge
                          variant="outline"
                          className="border-primary/40 bg-primary/10 text-primary text-xs"
                        >
                          Competitor
                        </Badge>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function KeywordResearch() {
  const [keyword, setKeyword] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [queryKeyword, setQueryKeyword] = useState("");

  const { data: keywordData, isLoading } = useKeywordAnalysis(queryKeyword);

  const handleAnalyze = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setQueryKeyword(trimmed);
  };

  const results = keywordData && keywordData.length > 0 ? keywordData : null;
  const displayAnalysis: KeywordAnalysis | null = results
    ? {
        ...results[0],
        competitorDomain: competitor || results[0].competitorDomain,
      }
    : queryKeyword
      ? null
      : mockKeywordAnalysis;

  const isMockData = !queryKeyword;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Inputs */}
      <Card className="border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            Keyword &amp; Competitor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="keyword-input"
                className="text-xs text-muted-foreground mb-1.5 block"
              >
                Target Keyword
              </label>
              <Input
                id="keyword-input"
                data-ocid="keyword.keyword.input"
                placeholder="e.g. website seo tools"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>
            <div>
              <label
                htmlFor="competitor-input"
                className="text-xs text-muted-foreground mb-1.5 block"
              >
                Competitor Domain
              </label>
              <Input
                id="competitor-input"
                data-ocid="keyword.competitor.input"
                placeholder="e.g. ahrefs.com"
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>
          </div>
          <Button
            data-ocid="keyword.analyze.button"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="gap-2 w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Analyzing..." : "Analyze Keyword"}
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div data-ocid="keyword.loading_state" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-lg" />
        </div>
      ) : displayAnalysis ? (
        <div>
          {isMockData && (
            <div className="mb-4 p-3 rounded-lg border border-chart-3/40 bg-chart-3/5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-chart-3 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Showing demo data for{" "}
                <span className="font-medium text-foreground">
                  "website seo tools"
                </span>
                . Enter a keyword above to analyze.
              </p>
            </div>
          )}
          <KeywordResults analysis={displayAnalysis} competitor={competitor} />
        </div>
      ) : (
        <div
          className="p-8 rounded-lg border border-dashed border-border text-center"
          data-ocid="keyword.empty_state"
        >
          <BarChart2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No data found for keyword{" "}
            <span className="font-medium text-foreground">
              "{queryKeyword}"
            </span>
            .
          </p>
        </div>
      )}
    </div>
  );
}
