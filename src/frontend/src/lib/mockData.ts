import type {
  DashboardSummary,
  IndexCheckerStatus,
  KeywordAnalysis,
  OptimizationTip,
  SEOAuditResult,
  WebsiteStatus,
} from "../backend";

export const mockDashboardSummary: DashboardSummary = {
  overallHealthScore: BigInt(78),
  seoScore: BigInt(82),
  performanceScore: BigInt(71),
  totalSitesAnalyzed: BigInt(12),
  totalIssuesFound: BigInt(47),
  lastUpdated: BigInt(Date.now() * 1_000_000),
};

export const mockWebsiteStatuses: WebsiteStatus[] = [
  {
    url: "https://example.com",
    isOnline: true,
    httpStatusCode: BigInt(200),
    responseTimeMs: BigInt(243),
    uptimePercentage: 99.8,
    lastChecked: BigInt(Date.now() * 1_000_000),
  },
  {
    url: "https://shopify-store.io",
    isOnline: true,
    httpStatusCode: BigInt(200),
    responseTimeMs: BigInt(512),
    uptimePercentage: 98.2,
    lastChecked: BigInt(Date.now() * 1_000_000),
  },
  {
    url: "https://blog.techcrunch.com",
    isOnline: true,
    httpStatusCode: BigInt(200),
    responseTimeMs: BigInt(387),
    uptimePercentage: 99.5,
    lastChecked: BigInt(Date.now() * 1_000_000),
  },
  {
    url: "https://legacy-site.net",
    isOnline: false,
    httpStatusCode: BigInt(503),
    responseTimeMs: BigInt(0),
    uptimePercentage: 72.4,
    lastChecked: BigInt(Date.now() * 1_000_000),
  },
  {
    url: "https://startup-landing.co",
    isOnline: true,
    httpStatusCode: BigInt(200),
    responseTimeMs: BigInt(189),
    uptimePercentage: 99.9,
    lastChecked: BigInt(Date.now() * 1_000_000),
  },
];

export const mockSEOAudit: SEOAuditResult = {
  url: "https://example.com",
  auditTimestamp: BigInt(Date.now() * 1_000_000),
  onPage: {
    titleTagPresent: true,
    titleQualityScore: BigInt(85),
    metaDescriptionPresent: true,
    metaDescriptionQuality: BigInt(72),
    h1Count: BigInt(1),
    h2Count: BigInt(6),
    h3Count: BigInt(14),
    keywordDensityScore: 2.4,
    imageAltTagCoverage: 87.5,
    internalLinkCount: BigInt(23),
  },
  offPage: {
    domainAuthorityScore: BigInt(54),
    backlinkCountEstimate: BigInt(1847),
    socialSignalsCount: BigInt(3290),
  },
  technical: {
    sslEnabled: true,
    mobileFriendly: true,
    sitemapPresent: true,
    robotsTxtPresent: true,
    canonicalTagPresent: true,
    structuredDataPresent: false,
    pageSpeedScore: BigInt(71),
  },
  nonTechnical: {
    contentQualityScore: BigInt(78),
    readabilityScore: BigInt(65),
    keywordUsageScore: BigInt(82),
    contentLengthWords: BigInt(2340),
  },
};

export const mockOptimizationTips: OptimizationTip[] = [
  {
    title: "Enable Gzip/Brotli Compression",
    description:
      "Compress text-based assets (HTML, CSS, JS) to reduce transfer size by up to 80%. Configure your web server to serve compressed responses.",
    category: "backend",
    impactLevel: "high",
    implemented: false,
  },
  {
    title: "Implement Browser Caching Headers",
    description:
      "Set Cache-Control and Expires headers for static assets. Images and fonts can be cached for up to 1 year, reducing repeat load times significantly.",
    category: "backend",
    impactLevel: "high",
    implemented: true,
  },
  {
    title: "Optimize Time to First Byte (TTFB)",
    description:
      "Reduce server response time below 200ms by upgrading hosting, using a CDN, or enabling server-side caching (Redis/Memcached).",
    category: "backend",
    impactLevel: "high",
    implemented: false,
  },
  {
    title: "Use HTTP/2 or HTTP/3",
    description:
      "Modern HTTP protocols multiplex requests, reducing latency. Ensure your server supports HTTP/2 at minimum for improved performance.",
    category: "backend",
    impactLevel: "medium",
    implemented: true,
  },
  {
    title: "Implement Content Delivery Network",
    description:
      "Serve static assets from edge nodes geographically close to users. Reduces latency by 40-60% for global audiences.",
    category: "backend",
    impactLevel: "medium",
    implemented: false,
  },
  {
    title: "Minify CSS and JavaScript",
    description:
      "Remove whitespace, comments, and unused code from CSS and JS files. Tools like Terser and cssnano can automate this in your build pipeline.",
    category: "frontend",
    impactLevel: "medium",
    implemented: true,
  },
  {
    title: "Optimize and Lazy-Load Images",
    description:
      "Convert images to WebP/AVIF format and add loading='lazy' to below-fold images. Use srcset for responsive images across device sizes.",
    category: "frontend",
    impactLevel: "high",
    implemented: false,
  },
  {
    title: "Eliminate Render-Blocking Resources",
    description:
      "Defer non-critical JavaScript and inline critical CSS. Use async/defer attributes and move script tags to document end.",
    category: "frontend",
    impactLevel: "high",
    implemented: false,
  },
  {
    title: "Reduce Cumulative Layout Shift (CLS)",
    description:
      "Add explicit width/height attributes to images and embeds. Reserve space for dynamic content to prevent layout shifts during load.",
    category: "frontend",
    impactLevel: "medium",
    implemented: false,
  },
  {
    title: "Preload Critical Fonts",
    description:
      "Add <link rel='preload'> for above-the-fold fonts to reduce FOIT/FOUT. Use font-display: swap and self-host fonts where possible.",
    category: "frontend",
    impactLevel: "low",
    implemented: true,
  },
];

export const mockIndexCheckerStatus: IndexCheckerStatus = {
  url: "https://example.com",
  isIndexed: true,
  noindexTagPresent: false,
  robotsBlocked: false,
  lastChecked: BigInt(Date.now() * 1_000_000),
  indexabilityIssues: [
    "Thin content detected on /about page (< 300 words)",
    "Duplicate title tags found on /products and /shop pages",
  ],
};

export const mockKeywordAnalysis: KeywordAnalysis = {
  keyword: "website seo tools",
  competitorDomain: "ahrefs.com",
  keywordDifficulty: BigInt(67),
  searchVolumeEstimate: BigInt(18100),
  analysisTimestamp: BigInt(Date.now() * 1_000_000),
  top10Positions: [
    { domain: "ahrefs.com", position: BigInt(1) },
    { domain: "semrush.com", position: BigInt(2) },
    { domain: "moz.com", position: BigInt(3) },
    { domain: "searchengineland.com", position: BigInt(4) },
    { domain: "neil-patel.com", position: BigInt(5) },
    { domain: "backlinko.com", position: BigInt(6) },
    { domain: "sitechecker.pro", position: BigInt(7) },
    { domain: "seoptimer.com", position: BigInt(8) },
    { domain: "woorank.com", position: BigInt(9) },
    { domain: "seobility.net", position: BigInt(10) },
  ],
};
