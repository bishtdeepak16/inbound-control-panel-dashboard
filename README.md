# Inbound Control Panel — Demo

A **demo version** of a live inbound-operations dashboard that I designed and built for a multi-FC warehousing and fulfillment operation, with three role-based views for different decision makers.

> **All data in this demo is synthetic** (random appointments, clients, FCs and units). The production dashboard and its data are private to the company.

**Live demo:** open `index.html` (GitHub Pages).

## Views
- **CXO — Business Performance:** appointment fulfilment %, scheduled-date adherence, same-day clearance %, detention rate, damage + shortage %, median gate-to-gate TAT, null (wasted-slot) rate; monthly volume trend, top FCs and clients by volume, appointment classification, category mix.
- **Planner — Supply Control:** 14-day upcoming load by FC, open appointments at risk, brand show rate, scheduling lead time, projected-vs-realised variance.
- **Ops — Ground Execution:** today's gate-ins, loading status, same-day SLA risk, FC operations scorecard, TAT distribution by client, unloading TAT by vehicle size, manpower efficiency, pending-clearance aging, gate-in / gate-out heatmaps.
- **AI report:** weekly and month-to-date performance summary with metric comparison and recommended actions (rule-based text in this demo).

## Engineering notes
- Handles messy source data: mixed date and number formats, timestamp year errors, client-name variants (normalised and de-duplicated).
- Role- and FC-scoped access, auto-refresh, Excel/CSV exports, PDF report download.

## Stack
JavaScript · Chart.js · Google Sheets and Apps Script (production data source) · LLM summaries

## About this demo
`mock-inbound.js` replaces the private data source, user list, LLM proxy and email service with a synthetic data generator that returns the same shapes, so the original dashboard runs unchanged as a static page.

![CXO](docs/cxo-view.png)
![Planner](docs/planner-view.png)
![Ops](docs/ops-view.png)
![AI report](docs/ai-report.png)

## Weekly AI email (sample)
`report-sample-weekly-email.html` is a sample of the automated Monday 10 AM IST email (week-on-week + month-to-date, client tables, highlights, concerns, recommended actions), generated from synthetic demo data. Open it directly in a browser.
