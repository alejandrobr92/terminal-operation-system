# Analytics Dashboard

## Purpose

Provide visibility into operational KPIs derived from yard and planning domains.

## Requirements

### Requirement 1: Display KPIs

The system MUST display key performance indicators including throughput, moves per hour, yard occupancy, and pending jobs.

#### Scenario: Display KPI metrics

- **WHEN** the user navigates to the analytics dashboard
- **THEN** the system MUST render all KPI values
- **AND** each KPI MUST be visible in a dashboard widget

---

### Requirement 2: Update metrics in pseudo realtime

The system MUST update KPI values periodically and in response to meaningful domain state changes to simulate realtime behavior.

#### Scenario: Periodic KPI updates

- **WHEN** the analytics dashboard is open
- **THEN** the system MUST update KPI values every 2 seconds
- **AND** the updated values MUST be reflected in the UI

#### Scenario: Update after domain interaction

- **WHEN** a relevant yard or planning interaction changes operational state
- **THEN** the affected KPI values MUST update without requiring a full page refresh
- **AND** the analytics dashboard MUST reflect the new operational signal

---

### Requirement 3: Derive data from other domains

The system MUST derive analytics data from yard operations and planning domains.

#### Scenario: Data aggregation

- **WHEN** container or job data changes
- **THEN** the system MUST recalculate KPI values
- **AND** the dashboard MUST reflect updated aggregated data

#### Scenario: Derive pending jobs and throughput

- **WHEN** planning status or yard operational state changes
- **THEN** analytics MUST derive at least pending jobs, throughput, and moves-per-hour style metrics from shared domain information
- **AND** those metrics MUST remain consistent with the latest known domain state

---

### Requirement 4: Present monitoring indicators

The system MUST present simple monitoring indicators beyond raw KPI cards, including alerts or operational insight summaries.

#### Scenario: Show operational insight panel

- **WHEN** the analytics dashboard renders
- **THEN** it MUST include a monitoring or insight area
- **AND** that area MUST communicate relevant changes from the yard or planning domains

---

### Requirement 5: Use a decoupled analytics data layer

The analytics domain MUST obtain or derive dashboard data through a data access or aggregation layer that is decoupled from presentation components.

#### Scenario: Render analytics from derived source

- **WHEN** analytics values are calculated
- **THEN** the calculation logic MUST live outside the presentational dashboard components
- **AND** the dashboard UI MUST consume already-prepared KPI or insight data structures
