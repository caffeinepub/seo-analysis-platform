import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TechnicalSEO {
    mobileFriendly: boolean;
    pageSpeedScore: bigint;
    sitemapPresent: boolean;
    sslEnabled: boolean;
    structuredDataPresent: boolean;
    robotsTxtPresent: boolean;
    canonicalTagPresent: boolean;
}
export type Time = bigint;
export interface WebsiteStatus {
    url: string;
    isOnline: boolean;
    httpStatusCode: bigint;
    responseTimeMs: bigint;
    uptimePercentage: number;
    lastChecked: Time;
}
export interface SEOAuditResult {
    url: string;
    technical: TechnicalSEO;
    auditTimestamp: Time;
    offPage: OffPageSEO;
    nonTechnical: NonTechnicalSEO;
    onPage: OnPageSEO;
}
export interface OffPageSEO {
    socialSignalsCount: bigint;
    domainAuthorityScore: bigint;
    backlinkCountEstimate: bigint;
}
export interface KeywordAnalysis {
    keywordDifficulty: bigint;
    top10Positions: Array<KeywordAnalysisPosition>;
    searchVolumeEstimate: bigint;
    competitorDomain: string;
    keyword: string;
    analysisTimestamp: Time;
}
export interface NonTechnicalSEO {
    contentLengthWords: bigint;
    readabilityScore: bigint;
    keywordUsageScore: bigint;
    contentQualityScore: bigint;
}
export interface KeywordAnalysisPosition {
    domain: string;
    position: bigint;
}
export interface OptimizationTip {
    title: string;
    impactLevel: string;
    description: string;
    implemented: boolean;
    category: string;
}
export interface OnPageSEO {
    metaDescriptionPresent: boolean;
    metaDescriptionQuality: bigint;
    h3Count: bigint;
    h1Count: bigint;
    titleQualityScore: bigint;
    internalLinkCount: bigint;
    titleTagPresent: boolean;
    imageAltTagCoverage: number;
    h2Count: bigint;
    keywordDensityScore: number;
}
export interface IndexCheckerStatus {
    url: string;
    indexabilityIssues: Array<string>;
    noindexTagPresent: boolean;
    robotsBlocked: boolean;
    lastChecked: Time;
    isIndexed: boolean;
}
export interface DashboardSummary {
    performanceScore: bigint;
    totalSitesAnalyzed: bigint;
    totalIssuesFound: bigint;
    lastUpdated: Time;
    seoScore: bigint;
    overallHealthScore: bigint;
}
export interface backendInterface {
    addIndexCheckerStatus(status: IndexCheckerStatus): Promise<void>;
    addKeywordAnalysis(keyword: string, analysis: KeywordAnalysis): Promise<void>;
    addOptimizationTip(url: string, tip: OptimizationTip): Promise<void>;
    addSEOAdit(audit: SEOAuditResult): Promise<void>;
    addWebsiteStatus(status: WebsiteStatus): Promise<void>;
    getAllSEOAudits(): Promise<Array<SEOAuditResult>>;
    getAllWebsiteStatuses(): Promise<Array<WebsiteStatus>>;
    getDashboardSummary(): Promise<DashboardSummary | null>;
    getIndexCheckerStatus(url: string): Promise<IndexCheckerStatus | null>;
    getKeywordAnalysis(keyword: string): Promise<Array<KeywordAnalysis>>;
    getOptimizationTips(url: string): Promise<Array<OptimizationTip>>;
    getSEOAdit(url: string): Promise<SEOAuditResult | null>;
    getWebsiteStatus(url: string): Promise<WebsiteStatus | null>;
    updateDashboardSummary(summary: DashboardSummary): Promise<void>;
}
