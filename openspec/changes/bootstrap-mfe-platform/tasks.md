## 1. Workspace Foundation

- [x] 1.1 Add and configure the Module Federation tooling required by the shell and all three remote applications
- [x] 1.2 Update workspace package configuration so shared dependencies and local package imports resolve consistently across apps
- [x] 1.3 Expand `packages/contracts` to include the shared event and domain contract surface needed for bootstrap integration

## 2. Remote Exposure

- [ ] 2.1 Configure `mfe-yard` to expose a remote entry and replace the starter screen with a domain placeholder view
- [ ] 2.2 Configure `mfe-planning` to expose a remote entry and replace the starter screen with a domain placeholder view
- [ ] 2.3 Configure `mfe-analytics` to expose a remote entry and replace the starter screen with a domain placeholder view

## 3. Shell Composition

- [ ] 3.1 Add shell routing and primary navigation for yard operations, planning, and analytics
- [ ] 3.2 Configure the shell to consume the three remotes through Module Federation and render them inside a shared application frame
- [ ] 3.3 Add loading or fallback states so remote routes remain usable while modules are being resolved

## 4. Shared Communication

- [ ] 4.1 Implement the initial typed event bus pattern used by shell and remotes
- [ ] 4.2 Wire the shell and remotes to the shared contracts and communication primitives without direct cross-domain imports
- [ ] 4.3 Add a simple cross-MFE interaction path that proves events can be emitted and consumed across the platform

## 5. Validation

- [ ] 5.1 Verify the shell can run locally and navigate to each remote successfully
- [ ] 5.2 Verify shared React runtime behavior and confirm duplicate dependency instances are avoided
- [ ] 5.3 Document any follow-up gaps that should be handled in later yard, planning, or analytics changes
