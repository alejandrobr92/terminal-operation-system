## MODIFIED Requirements

### Requirement 2: Use Module Federation

The system MUST use Module Federation for runtime integration, with the shell consuming independently exposed remote entry points from yard, planning, and analytics.

#### Scenario: Runtime integration

- **WHEN** the platform is started
- **THEN** the shell MUST load each microfrontend through Module Federation
- **AND** each remote MUST be mounted into the shell at runtime rather than bundled directly into the shell codebase

#### Scenario: Shared runtime dependencies

- **WHEN** microfrontends are composed in the shell
- **THEN** shared dependencies such as React and React DOM MUST be reused across applications
- **AND** the platform MUST avoid duplicate runtime instances that could break rendering behavior

### Requirement 3: Enable communication via event bus

The system MUST use an event bus for communication between MFEs, and the event contracts MUST be defined in a shared typed contract package.

#### Scenario: Cross-MFE communication

- **WHEN** an event is emitted by one MFE
- **THEN** other MFEs MUST be able to subscribe and react through a shared event bus abstraction
- **AND** communication MUST remain decoupled from direct imports between domain MFEs

#### Scenario: Typed event payloads

- **WHEN** a platform event is published or consumed
- **THEN** its payload MUST conform to the shared event contract definitions
- **AND** producers and consumers MUST use the same typed event names and payload shapes

### Requirement 4: Use shared contracts

The system MUST use shared TypeScript interfaces for consistency, and those contracts MUST be imported from a common workspace package used by shell and remotes.

#### Scenario: Contract usage

- **WHEN** data is exchanged between MFEs
- **THEN** it MUST conform to shared contracts
- **AND** type safety MUST be enforced

#### Scenario: Shared contract source

- **WHEN** shell and microfrontends reference shared domain or event types
- **THEN** they MUST import those types from the common contracts package
- **AND** the platform MUST avoid duplicating equivalent contract definitions inside individual MFEs
