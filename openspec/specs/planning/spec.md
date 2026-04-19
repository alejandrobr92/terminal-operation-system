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

The system MUST allow updating the status of a job.

#### Scenario: Change job status

- **WHEN** the user updates a job status
- **THEN** the system MUST update the job
- **AND** the UI MUST reflect the new status

---

### Requirement 3: Change job priority

The system MUST allow changing job priority.

#### Scenario: Update priority

- **WHEN** the user changes job priority
- **THEN** the system MUST update the priority
- **AND** the updated value MUST be displayed

---

### Requirement 4: Assign movements

The system MUST allow assigning movements to jobs.

#### Scenario: Assign movement

- **WHEN** the user assigns a movement
- **THEN** the system MUST associate the movement with the job
- **AND** the UI MUST reflect the assignment

---

### Requirement 5: Emit job update event

The system MUST emit a "jobUpdated" event when a job changes.

#### Scenario: Emit job update

- **WHEN** a job is updated
- **THEN** the system MUST emit "jobUpdated"
- **AND** the event MUST include job id and status
