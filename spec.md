# SEO Analysis Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full-featured SEO and website performance analysis platform
- Website Status Checker: online/offline, response time, HTTP status codes
- SEO Analysis Dashboard with On-Page, Off-Page, Technical, and Non-Technical SEO sections
- Backend & Frontend Optimization Tips panel
- Index Checker: Google indexability status, blocking issues
- Competitor Keyword & Search Results: keyword rankings, difficulty, search volume
- Dashboard Overview: health score, SEO score, performance score summary cards
- Dark/light mode toggle
- Sidebar navigation
- Color-coded scores (red/yellow/green)
- Mock/sample data for all sections

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- Store analyzed website entries with URL, status, scores
- Store SEO audit results: on-page, off-page, technical, non-technical metrics
- Store optimization tips per website
- Store index check results
- Store keyword/competitor analysis results
- Seed with realistic mock data for demo purposes
- APIs: getWebsiteStatus, getSEOAnalysis, getOptimizationTips, getIndexStatus, getKeywordAnalysis, getDashboardSummary

### Frontend (React + TypeScript + Tailwind)
- App shell with collapsible sidebar navigation
- Dark/light mode toggle using Tailwind dark class
- Dashboard overview page with summary score cards
- Website Status Checker page
- SEO Analysis page with tabs for On-Page, Off-Page, Technical, Non-Technical
- Optimization Tips page split into Frontend and Backend sections
- Index Checker page
- Competitor Keyword Analysis page
- Color-coded score badges and progress bars (green >= 80, yellow >= 50, red < 50)
- URL input forms for triggering analysis (uses mock data)
