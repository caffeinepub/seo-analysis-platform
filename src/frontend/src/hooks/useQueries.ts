import { useQuery } from "@tanstack/react-query";
import type {
  DashboardSummary,
  IndexCheckerStatus,
  KeywordAnalysis,
  OptimizationTip,
  SEOAuditResult,
  WebsiteStatus,
} from "../backend";
import { useActor } from "./useActor";

export function useDashboardSummary() {
  const { actor, isFetching } = useActor();
  return useQuery<DashboardSummary | null>({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllWebsiteStatuses() {
  const { actor, isFetching } = useActor();
  return useQuery<WebsiteStatus[]>({
    queryKey: ["allWebsiteStatuses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWebsiteStatuses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWebsiteStatusByUrl(url: string) {
  const { actor, isFetching } = useActor();
  return useQuery<WebsiteStatus | null>({
    queryKey: ["websiteStatus", url],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWebsiteStatus(url);
    },
    enabled: !!actor && !isFetching && url.length > 0,
  });
}

export function useAllSEOAudits() {
  const { actor, isFetching } = useActor();
  return useQuery<SEOAuditResult[]>({
    queryKey: ["allSEOAudits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSEOAudits();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSEOAuditByUrl(url: string) {
  const { actor, isFetching } = useActor();
  return useQuery<SEOAuditResult | null>({
    queryKey: ["seoAudit", url],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSEOAdit(url);
    },
    enabled: !!actor && !isFetching && url.length > 0,
  });
}

export function useOptimizationTips(url: string) {
  const { actor, isFetching } = useActor();
  return useQuery<OptimizationTip[]>({
    queryKey: ["optimizationTips", url],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOptimizationTips(url);
    },
    enabled: !!actor && !isFetching && url.length > 0,
  });
}

export function useIndexCheckerStatus(url: string) {
  const { actor, isFetching } = useActor();
  return useQuery<IndexCheckerStatus | null>({
    queryKey: ["indexChecker", url],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getIndexCheckerStatus(url);
    },
    enabled: !!actor && !isFetching && url.length > 0,
  });
}

export function useKeywordAnalysis(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery<KeywordAnalysis[]>({
    queryKey: ["keywordAnalysis", keyword],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getKeywordAnalysis(keyword);
    },
    enabled: !!actor && !isFetching && keyword.length > 0,
  });
}
