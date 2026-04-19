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

The system MUST allow filtering containers by status, location, and priority.

#### Scenario: Apply filters

- **WHEN** the user selects filter criteria
- **THEN** the system MUST update the container list
- **AND** only matching containers MUST be displayed

---

### Requirement 3: View container details

The system MUST allow viewing detailed information for a container.

#### Scenario: Open container detail

- **WHEN** the user selects a container
- **THEN** the system MUST display detailed information
- **AND** the detail view MUST include all container attributes

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

### Requirement 5: Emit container selection event

The system MUST emit a "containerSelected" event when a container is selected.

#### Scenario: Emit selection event

- **WHEN** the user clicks a container
- **THEN** the system MUST emit "containerSelected"
- **AND** the event MUST include the container id
