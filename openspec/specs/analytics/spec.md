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

The system MUST update KPI values periodically to simulate realtime behavior.

#### Scenario: Periodic KPI updates

- **WHEN** the analytics dashboard is open
- **THEN** the system MUST update KPI values every 2 seconds
- **AND** the updated values MUST be reflected in the UI

---

### Requirement 3: Derive data from other domains

The system MUST derive analytics data from yard operations and planning domains.

#### Scenario: Data aggregation

- **WHEN** container or job data changes
- **THEN** the system MUST recalculate KPI values
- **AND** the dashboard MUST reflect updated aggregated data
