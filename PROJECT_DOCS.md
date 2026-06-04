# FluentGantt XML Project Documentation

## 1. Project Overview
FluentGantt is a modern task management application leveraging XML technologies for data structure and reporting, with a Fluent design aesthetic and AI-driven productivity insights.

### Core Technologies
- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, Recharts.
- **XML Suite**: XML for data export, XSD for validation, XSLT for HTML report generation.
- **AI**: Genkit AI Task Optimizer for deadline and priority suggestions.
- **Database**: SQLite (Simulated via LocalStorage for web demo, persistence logic provided).

## 2. Requirements (requirements.txt)
```text
next>=15.0.0
react>=18.0.0
lucide-react
recharts
date-fns
clsx
tailwind-merge
zod
genkit
firebase (for potential cloud hosting)
```

## 3. Data Architecture (UML)

### Use Case Diagram
- **User**: 
  - Authenticate (Login/Signup)
  - Create/Update/Delete Tasks
  - Visualize Gantt Timeline
  - Export Task List as XML
  - Apply XSLT Stylesheets
  - View Productivity Stats
  - Receive Email Notifications (Config)

### Class Diagram
- **Task**: `id, name, description, startDate, endDate, priority, status, progress, effort`
- **User**: `id, email, name, settings`
- **XMLProcessor**: `generateXML(), validateXSD(), transformXSLT()`
- **AIOptimizer**: `analyze(), suggestOptimizations()`

## 4. Workflow
1. **Input**: User enters task details (Dates, Effort, Priority).
2. **Persistence**: Data saved to LocalStorage (Simulating SQLite relational structure).
3. **Visualization**: CSS Grid renders the Gantt timeline dynamically.
4. **Analysis**: AI Flow `optimizeTasks` is triggered to suggest workload balancing.
5. **XML Export**: System converts JSON state to validated XML.
6. **Reporting**: XSLT processor transforms XML to HTML for browser rendering.

## 5. XML Assets

### tasks.xsd (Schema)
Defines strict rules for task elements including data types (dates, integers) and required attributes.

### tasks.xsl (Stylesheet)
A transformation file that converts raw XML data into a styled HTML table with high-contrast UI elements.

## 6. How to Use
1. **Auth**: Sign up with an email to access the dashboard.
2. **Dashboard**: Use the "New Task" button to populate the Gantt chart.
3. **Optimize**: Click "Optimize My List" to see AI suggestions for your deadlines.
4. **XML Tools**: Copy the generated XML or modify the XSLT to see immediate HTML transformations.
5. **Stats**: Monitor completion rates in the Stats Hub.
