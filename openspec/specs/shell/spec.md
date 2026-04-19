# Shell Application

## Purpose

Host and integrate all microfrontends into a single platform.

## Requirements

### Requirement 1: Provide navigation

The system MUST provide navigation between microfrontends.

#### Scenario: Navigate between MFEs

- **WHEN** the user selects a navigation option
- **THEN** the system MUST route to the selected MFE
- **AND** the corresponding view MUST be displayed

---

### Requirement 2: Load microfrontends

The system MUST load remote microfrontends using Module Federation.

#### Scenario: Load remote module

- **WHEN** a route is accessed
- **THEN** the system MUST load the corresponding remote module
- **AND** the module MUST render within the shell

---

### Requirement 3: Provide shared dependencies

The system MUST provide shared dependencies across MFEs.

#### Scenario: Share dependencies

- **WHEN** MFEs are loaded
- **THEN** the system MUST ensure shared dependencies are reused
- **AND** duplicate instances MUST be avoided
