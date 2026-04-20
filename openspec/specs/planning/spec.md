# Move Planning

## Purpose

Manage operational jobs and container movements.

## Requirements

### Requirement 1: Display job queue

The system MUST display a list of jobs.

#### Scenario: View job list

- **WHEN** the user navigates to the planning view
- **THEN** the system MUST display all jobs
- **AND** each job MUST include id, containerId, status, and priority

---

### Requirement 2: Update job status

The system MUST allow updating the status of a job through explicit planning actions.

#### Scenario: Change job status

- **WHEN** the user updates a job status
- **THEN** the system MUST update the job
- **AND** the UI MUST reflect the new status

#### Scenario: Complete a task

- **WHEN** the user marks a task as completed
- **THEN** the related job MUST transition to a completed state
- **AND** the planning queue MUST reflect that completion immediately

---

### Requirement 3: Change job priority

The system MUST allow changing job priority and reordering operational attention accordingly.

#### Scenario: Update priority

- **WHEN** the user changes job priority
- **THEN** the system MUST update the priority
- **AND** the updated value MUST be displayed

#### Scenario: Reprioritize a queued job

- **WHEN** the user increases or decreases the priority of a queued job
- **THEN** the queue presentation MUST reflect the new priority
- **AND** the job MUST remain visible in its updated planning state

---

### Requirement 4: Assign movements

The system MUST allow assigning and reprogramming movements for jobs.

#### Scenario: Assign movement

- **WHEN** the user assigns a movement
- **THEN** the system MUST associate the movement with the job
- **AND** the UI MUST reflect the assignment

#### Scenario: Reprogram operation

- **WHEN** the user reprograms a planning operation
- **THEN** the system MUST update the planned movement or assignment metadata
- **AND** the queue MUST display the revised operational plan

---

### Requirement 5: Use a decoupled planning data layer

The planning domain MUST obtain job and movement data through a data access layer that is decoupled from presentation components.

#### Scenario: Render planning data from domain source

- **WHEN** the planning view loads jobs
- **THEN** it MUST retrieve them from a planning-specific data access module
- **AND** UI components MUST not rely on inline hardcoded records as their primary data source

---

### Requirement 6: Emit job update event

The system MUST emit a "jobUpdated" event when a job changes.

#### Scenario: Emit job update

- **WHEN** a job is updated
- **THEN** the system MUST emit "jobUpdated"
- **AND** the event MUST include job id and status
