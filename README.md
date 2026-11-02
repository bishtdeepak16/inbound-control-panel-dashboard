<div align="center">

# Inbound Control Panel

**Inbound appointment, gate and unloading visibility for fulfillment centres**

<sub>Three role-based views (CXO · Planner · Ops) · automated weekly AI report</sub>

<br>

[**▶ Live Demo**](https://bishtdeepak16.github.io/inbound-control-panel-dashboard/) &nbsp;·&nbsp;
[**Weekly AI email (sample)**](https://bishtdeepak16.github.io/inbound-control-panel-dashboard/report-sample-weekly-email.html)

</div>

<br>

> **The live demo uses synthetic data.** All appointments, clients and FCs in it are generated in the browser. The production system, its code and its data are private to the company; production screenshots below are masked. This repo shows the product, not company data.

---

## What it does
Every inbound truck is booked as an appointment, arrives at the gate, unloads at the dock and is checked for damage and shortage. The panel gives each audience what it needs:
- **Leadership (CXO):** are we fulfilling appointments, clearing them the same day, and keeping damage and shortage low?
- **Planners:** what is arriving in the next 14 days, which appointments are at risk and how reliable is each brand?
- **Operations:** how fast are trucks turned around, where is manpower being wasted and what is pending clearance?

## Highlights
- **CXO view:** monthly volume trend, top FCs and clients by good units, appointment classification, damage + shortage rate by client, with KPIs for appointment fulfilment %, same-day clearance %, detention rate and null (wasted-slot) rate.
- **Planner view:** 14-day upcoming load by FC, open appointments at risk, brand show rate, scheduling lead time and projected-vs-realised variance, so supply is planned before trucks arrive.
- **Ops view:** FC operations scorecard, TAT distribution by client, unloading TAT by vehicle size, manpower efficiency, pending-clearance aging and gate-in / gate-out arrival heatmaps.
- **Data-accuracy layer:** handles inconsistent date and number formats, corrects timestamp errors and normalises and de-duplicates client names, so KPIs stay reliable despite a messy source sheet.
- **Access control:** Google sign-in with a user-access panel; filterable by FC, client and date.
- **Automated weekly AI report:** every Monday 10 AM IST an HTML email goes to stakeholders with a week-on-week comparison, client tables (priority clients flagged), highlights, concerns and recommended actions. Numbers are computed in the dashboard and the same payload is emailed, so the report always matches the dashboard; the LLM only writes the commentary.

## Stack
HTML / JS · Chart.js · Google Sheets (live source) · Google Apps Script (mailer and scheduler) · Cloudflare Worker (secure LLM proxy) · Groq LLM

---

<div align="center">

## 📸 Screenshots

<sub>Real dashboard. Client names, IDs and sensitive figures are masked.</sub>

<br>

**CXO view**

<img src="Dashboard%20images/cxo-view.png" width="92%" alt="CXO view">

<br><br>

**Planner view**

<img src="Dashboard%20images/planner-view.png" width="92%" alt="Planner view">

<br><br>

**Ops view**

<img src="Dashboard%20images/ops-view.png" width="92%" alt="Ops view">

<br><br>

**AI Report · in-dashboard AI summary**

<img src="Dashboard%20images/ai-report.png" width="92%" alt="AI report">

<br><br>

</div>

---

<div align="center">

## 📧 Automated Weekly AI Report
<sub>Sent every Monday to leadership. Numbers come from the dashboard; the AI only writes the commentary.</sub>

<br>

[**Download full report (PDF)**](Weekly%20AI%20Report/Inbound_Weekly_AI_Report_Sample.pdf) &nbsp;·&nbsp;
[**Open as HTML email**](https://bishtdeepak16.github.io/inbound-control-panel-dashboard/report-sample-weekly-email.html)

<br>

**Page 1 of 2**

<img src="Weekly%20AI%20Report/inbound-report-page-1.png" width="75%" alt="Weekly report page 1">

<br><br>

**Page 2 of 2**

<img src="Weekly%20AI%20Report/inbound-report-page-2.png" width="75%" alt="Weekly report page 2">

<br>

<sub>Sample built from synthetic data.</sub>

</div>

---

## About the live demo
`mock-inbound.js` generates synthetic appointment data in the browser and stands in for the private Google Sheets source, user list, LLM proxy and mailer, so the real front-end runs unchanged as a static page. No login or backend is needed.
