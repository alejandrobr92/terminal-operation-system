## MODIFIED Requirements

### Requirement 1: Provide navigation

The system MUST provide navigation between microfrontends, with the shell owning the primary route structure for the platform.

#### Scenario: Navigate between MFEs

- **WHEN** the user selects a navigation option
- **THEN** the system MUST route to the selected MFE
- **AND** the corresponding view MUST be displayed

#### Scenario: Shell-owned route map

- **WHEN** the platform initializes
- **THEN** the shell MUST define routes for yard operations, planning, and analytics
- **AND** each route MUST resolve to the corresponding remote microfrontend

### Requirement 2: Load microfrontends

The system MUST load remote microfrontends using Module Federation, and each remote MUST render inside a shell-managed application frame.

#### Scenario: Load remote module

- **WHEN** a route is accessed
- **THEN** the system MUST load the corresponding remote module
- **AND** the module MUST render within the shell

#### Scenario: Render fallback while loading

- **WHEN** a remote microfrontend has not finished loading
- **THEN** the shell MUST display a loading or fallback state for that route
- **AND** the rest of the shell layout MUST remain usable

### Requirement 3: Provide shared dependencies

The system MUST provide shared dependencies across MFEs, including the shared contracts and communication primitives needed for platform bootstrap.

#### Scenario: Share dependencies

- **WHEN** MFEs are loaded
- **THEN** the system MUST ensure shared dependencies are reused
- **AND** duplicate instances MUST be avoided

#### Scenario: Provide platform wiring

- **WHEN** a remote is rendered inside the shell
- **THEN** the remote MUST be able to use the shared platform contracts and communication pattern
- **AND** the shell MUST provide the integration environment needed for connected operation
