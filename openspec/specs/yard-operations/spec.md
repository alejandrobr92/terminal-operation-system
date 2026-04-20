# Yard Operations

## Purpose

Manage and visualize containers in the yard, including their state, location, and operational events.

## Requirements

### Requirement 1: Display container list

The system MUST display a list of containers.

#### Scenario: View container list

- **WHEN** the user navigates to the yard operations view
- **THEN** the system MUST display a list of containers
- **AND** each container MUST include id, status, location, and priority

---

### Requirement 2: Filter containers

The system MUST allow filtering containers by type, status, block, location, and priority.

#### Scenario: Apply multiple filters

- **WHEN** the user selects one or more filter criteria
- **THEN** the system MUST update the container list
- **AND** only containers matching the selected criteria MUST be displayed

#### Scenario: Reset filters

- **WHEN** the user clears the active filters
- **THEN** the system MUST restore the full container list
- **AND** the cleared state MUST be reflected in the filter controls

---

### Requirement 3: View container details

The system MUST allow viewing detailed information for a container, including operational attributes relevant to yard workflows.

#### Scenario: Open container detail

- **WHEN** the user selects a container
- **THEN** the system MUST display detailed information
- **AND** the detail view MUST include all container attributes

#### Scenario: Show operational detail fields

- **WHEN** the container detail view is displayed
- **THEN** it MUST include container id, status, type, location, block, priority, and operational event information
- **AND** the detail presentation MUST remain consistent with the selected list item

---

### Requirement 4: Handle UI states

The system MUST handle loading, empty, error, and success states.

#### Scenario: Loading state

- **WHEN** data is being fetched
- **THEN** the system MUST display a loading indicator

#### Scenario: Empty state

- **WHEN** no containers are available
- **THEN** the system MUST display an empty state message

#### Scenario: Error state

- **WHEN** data fetching fails
- **THEN** the system MUST display an error message

---

### Requirement 5: Represent operational container events

The system MUST represent relevant operational events for each container, including inbound, outbound, hold, customs release, and loading or unloading states.

#### Scenario: Show event summary in list or detail

- **WHEN** a container is rendered in the yard experience
- **THEN** the system MUST display its current operational event or event history summary
- **AND** the event information MUST be understandable without leaving the yard domain

---

### Requirement 6: Use a decoupled yard data layer

The yard domain MUST obtain container data through a data access layer that is decoupled from presentation components.

#### Scenario: Render containers from domain data source

- **WHEN** the yard view loads container data
- **THEN** it MUST retrieve that data from a yard-specific data access module
- **AND** UI components MUST not define the raw source records inline as their primary data source

---

### Requirement 7: Emit container selection event

The system MUST emit a "containerSelected" event when a container is selected.

#### Scenario: Emit selection event

- **WHEN** the user clicks a container
- **THEN** the system MUST emit "containerSelected"
- **AND** the event MUST include the container id
