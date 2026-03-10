import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Order "mo:core/Order";

actor {
  // Data Types
  type WebsiteStatus = {
    url : Text;
    isOnline : Bool;
    httpStatusCode : Int;
    responseTimeMs : Int;
    uptimePercentage : Float;
    lastChecked : Time.Time;
  };

  type OnPageSEO = {
    titleTagPresent : Bool;
    titleQualityScore : Int;
    metaDescriptionPresent : Bool;
    metaDescriptionQuality : Int;
    h1Count : Int;
    h2Count : Int;
    h3Count : Int;
    keywordDensityScore : Float;
    imageAltTagCoverage : Float;
    internalLinkCount : Int;
  };

  type OffPageSEO = {
    backlinkCountEstimate : Int;
    domainAuthorityScore : Int; // 0-100
    socialSignalsCount : Int;
  };

  type TechnicalSEO = {
    pageSpeedScore : Int; // 0-100
    mobileFriendly : Bool;
    sslEnabled : Bool;
    sitemapPresent : Bool;
    robotsTxtPresent : Bool;
    canonicalTagPresent : Bool;
    structuredDataPresent : Bool;
  };

  type NonTechnicalSEO = {
    contentQualityScore : Int; // 0-100
    readabilityScore : Int; // 0-100
    contentLengthWords : Int;
    keywordUsageScore : Int;
  };

  type SEOAuditResult = {
    url : Text;
    onPage : OnPageSEO;
    offPage : OffPageSEO;
    technical : TechnicalSEO;
    nonTechnical : NonTechnicalSEO;
    auditTimestamp : Time.Time;
  };

  module SEOAuditResult {
    public func compare(a : SEOAuditResult, b : SEOAuditResult) : Order.Order {
      Int.compare(a.auditTimestamp, b.auditTimestamp);
    };
  };

  type OptimizationTip = {
    category : Text; // "frontend" or "backend"
    title : Text;
    description : Text;
    impactLevel : Text; // "high", "medium", "low"
    implemented : Bool;
  };

  type IndexCheckerStatus = {
    url : Text;
    isIndexed : Bool;
    noindexTagPresent : Bool;
    robotsBlocked : Bool;
    indexabilityIssues : [Text];
    lastChecked : Time.Time;
  };

  type KeywordAnalysisPosition = {
    domain : Text;
    position : Int;
  };

  type KeywordAnalysis = {
    keyword : Text;
    competitorDomain : Text;
    searchVolumeEstimate : Int;
    keywordDifficulty : Int; // 0-100
    top10Positions : [KeywordAnalysisPosition];
    analysisTimestamp : Time.Time;
  };

  type DashboardSummary = {
    overallHealthScore : Int; // 0-100
    seoScore : Int; // 0-100
    performanceScore : Int; // 0-100
    totalSitesAnalyzed : Nat;
    totalIssuesFound : Nat;
    lastUpdated : Time.Time;
  };

  // Persistent Storage
  let websiteStatusMap = Map.empty<Text, WebsiteStatus>();
  let seoAuditMap = Map.empty<Text, SEOAuditResult>();
  let optimizationTipsMap = Map.empty<Text, [OptimizationTip]>();
  let indexCheckerMap = Map.empty<Text, IndexCheckerStatus>();
  let keywordAnalysisMap = Map.empty<Text, [KeywordAnalysis]>();
  var dashboardSummary : ?DashboardSummary = null;

  // Seed Data
  let website1Status : WebsiteStatus = {
    url = "https://example.com";
    isOnline = true;
    httpStatusCode = 200;
    responseTimeMs = 150;
    uptimePercentage = 99.9;
    lastChecked = Time.now();
  };

  let website2Status : WebsiteStatus = {
    url = "https://sampleblog.com";
    isOnline = true;
    httpStatusCode = 200;
    responseTimeMs = 210;
    uptimePercentage = 98.7;
    lastChecked = Time.now();
  };

  let website1Audit : SEOAuditResult = {
    url = "https://example.com";
    onPage = {
      titleTagPresent = true;
      titleQualityScore = 85;
      metaDescriptionPresent = true;
      metaDescriptionQuality = 80;
      h1Count = 1;
      h2Count = 3;
      h3Count = 5;
      keywordDensityScore = 2.5;
      imageAltTagCoverage = 95.0;
      internalLinkCount = 12;
    };
    offPage = {
      backlinkCountEstimate = 1500;
      domainAuthorityScore = 75;
      socialSignalsCount = 320;
    };
    technical = {
      pageSpeedScore = 78;
      mobileFriendly = true;
      sslEnabled = true;
      sitemapPresent = true;
      robotsTxtPresent = true;
      canonicalTagPresent = true;
      structuredDataPresent = true;
    };
    nonTechnical = {
      contentQualityScore = 88;
      readabilityScore = 82;
      contentLengthWords = 1200;
      keywordUsageScore = 84;
    };
    auditTimestamp = Time.now();
  };

  let website2Audit : SEOAuditResult = {
    url = "https://sampleblog.com";
    onPage = {
      titleTagPresent = true;
      titleQualityScore = 90;
      metaDescriptionPresent = true;
      metaDescriptionQuality = 85;
      h1Count = 1;
      h2Count = 4;
      h3Count = 8;
      keywordDensityScore = 2.2;
      imageAltTagCoverage = 98.0;
      internalLinkCount = 15;
    };
    offPage = {
      backlinkCountEstimate = 800;
      domainAuthorityScore = 65;
      socialSignalsCount = 150;
    };
    technical = {
      pageSpeedScore = 82;
      mobileFriendly = true;
      sslEnabled = true;
      sitemapPresent = true;
      robotsTxtPresent = true;
      canonicalTagPresent = true;
      structuredDataPresent = false;
    };
    nonTechnical = {
      contentQualityScore = 92;
      readabilityScore = 87;
      contentLengthWords = 2500;
      keywordUsageScore = 89;
    };
    auditTimestamp = Time.now();
  };

  let website1Tips : [OptimizationTip] = [
    {
      category = "frontend";
      title = "Optimize Image Sizes";
      description = "Reduce large images to improve page load speed.";
      impactLevel = "high";
      implemented = false;
    },
    {
      category = "backend";
      title = "Enable GZIP Compression";
      description = "Compress server responses to speed up transfers.";
      impactLevel = "medium";
      implemented = false;
    },
  ];

  let website2Tips : [OptimizationTip] = [
    {
      category = "frontend";
      title = "Improve Mobile Menu";
      description = "Optimize navigation for smaller screens.";
      impactLevel = "medium";
      implemented = true;
    },
    {
      category = "backend";
      title = "Database Indexing";
      description = "Add indexes for faster blog post retrievals.";
      impactLevel = "high";
      implemented = false;
    },
  ];

  let website1IndexStatus : IndexCheckerStatus = {
    url = "https://example.com";
    isIndexed = true;
    noindexTagPresent = false;
    robotsBlocked = false;
    indexabilityIssues = [];
    lastChecked = Time.now();
  };

  let website2IndexStatus : IndexCheckerStatus = {
    url = "https://sampleblog.com";
    isIndexed = true;
    noindexTagPresent = false;
    robotsBlocked = false;
    indexabilityIssues = [];
    lastChecked = Time.now();
  };

  let keyword1Analysis : KeywordAnalysis = {
    keyword = "best running shoes";
    competitorDomain = "runningshoestore.com";
    searchVolumeEstimate = 50000;
    keywordDifficulty = 68;
    top10Positions = [
      { domain = "example.com"; position = 4 },
      { domain = "runningshoestore.com"; position = 1 },
    ];
    analysisTimestamp = Time.now();
  };

  let keyword2Analysis : KeywordAnalysis = {
    keyword = "digital marketing tips";
    competitorDomain = "marketguru.com";
    searchVolumeEstimate = 35000;
    keywordDifficulty = 75;
    top10Positions = [
      { domain = "sampleblog.com"; position = 6 },
      { domain = "marketguru.com"; position = 2 },
    ];
    analysisTimestamp = Time.now();
  };

  let initialDashboardSummary : DashboardSummary = {
    overallHealthScore = 83;
    seoScore = 88;
    performanceScore = 80;
    totalSitesAnalyzed = 2;
    totalIssuesFound = 5;
    lastUpdated = Time.now();
  };

  // Initialize with seed data
  websiteStatusMap.add(website1Status.url, website1Status);
  websiteStatusMap.add(website2Status.url, website2Status);

  seoAuditMap.add(website1Audit.url, website1Audit);
  seoAuditMap.add(website2Audit.url, website2Audit);

  optimizationTipsMap.add(website1Tips[0].title, website1Tips);
  optimizationTipsMap.add(website2Tips[0].title, website2Tips);

  indexCheckerMap.add(website1IndexStatus.url, website1IndexStatus);
  indexCheckerMap.add(website2IndexStatus.url, website2IndexStatus);

  keywordAnalysisMap.add(keyword1Analysis.keyword, [keyword1Analysis]);
  keywordAnalysisMap.add(keyword2Analysis.keyword, [keyword2Analysis]);

  dashboardSummary := ?initialDashboardSummary;

  // Website Status
  public shared ({ caller }) func addWebsiteStatus(status : WebsiteStatus) : async () {
    websiteStatusMap.add(status.url, status);
  };

  public query ({ caller }) func getWebsiteStatus(url : Text) : async ?WebsiteStatus {
    websiteStatusMap.get(url);
  };

  public query ({ caller }) func getAllWebsiteStatuses() : async [WebsiteStatus] {
    websiteStatusMap.values().toArray();
  };

  // SEO Audits
  public shared ({ caller }) func addSEOAdit(audit : SEOAuditResult) : async () {
    seoAuditMap.add(audit.url, audit);
  };

  public query ({ caller }) func getSEOAdit(url : Text) : async ?SEOAuditResult {
    seoAuditMap.get(url);
  };

  public query ({ caller }) func getAllSEOAudits() : async [SEOAuditResult] {
    seoAuditMap.values().toArray();
  };

  // Optimization Tips
  public shared ({ caller }) func addOptimizationTip(url : Text, tip : OptimizationTip) : async () {
    let existingTips = switch (optimizationTipsMap.get(url)) {
      case (null) { [] };
      case (?tips) { tips };
    };
    optimizationTipsMap.add(url, existingTips.concat([tip]));
  };

  public query ({ caller }) func getOptimizationTips(url : Text) : async [OptimizationTip] {
    switch (optimizationTipsMap.get(url)) {
      case (null) { [] };
      case (?tips) { tips };
    };
  };

  // Index Checker
  public shared ({ caller }) func addIndexCheckerStatus(status : IndexCheckerStatus) : async () {
    indexCheckerMap.add(status.url, status);
  };

  public query ({ caller }) func getIndexCheckerStatus(url : Text) : async ?IndexCheckerStatus {
    indexCheckerMap.get(url);
  };

  // Keyword Analysis
  public shared ({ caller }) func addKeywordAnalysis(keyword : Text, analysis : KeywordAnalysis) : async () {
    let existing = switch (keywordAnalysisMap.get(keyword)) {
      case (null) { [] };
      case (?analyses) { analyses };
    };
    keywordAnalysisMap.add(keyword, existing.concat([analysis]));
  };

  public query ({ caller }) func getKeywordAnalysis(keyword : Text) : async [KeywordAnalysis] {
    switch (keywordAnalysisMap.get(keyword)) {
      case (null) { [] };
      case (?analyses) { analyses };
    };
  };

  // Dashboard Summary
  public shared ({ caller }) func updateDashboardSummary(summary : DashboardSummary) : async () {
    dashboardSummary := ?summary;
  };

  public query ({ caller }) func getDashboardSummary() : async ?DashboardSummary {
    dashboardSummary;
  };
};
