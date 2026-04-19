## 1. Domain Data Foundations

- [x] 1.1 Create yard data access modules for containers, filters, and operational event metadata outside the yard UI components
- [x] 1.2 Create planning data access modules for jobs, assignments, and status transition helpers outside the planning UI components
- [x] 1.3 Create analytics aggregation modules that derive KPI and insight inputs from yard and planning domain data plus shared events

## 2. Yard Operations Workflows

- [x] 2.1 Replace the yard placeholder list with a structured container table or card list sourced from the yard data layer
- [x] 2.2 Implement yard filter controls for type, status, block, location, and priority with reset behavior
- [x] 2.3 Implement the yard detail view with container attributes, operational events, and loading, empty, and error states
- [x] 2.4 Keep yard-to-platform communication aligned with the selected container so downstream domains receive the active context

## 3. Planning Workflows

- [x] 3.1 Replace the planning placeholder queue with a job list sourced from the planning data layer
- [x] 3.2 Implement planning actions for assigning movements, advancing status, completing tasks, and reprogramming operations
- [x] 3.3 Implement priority updates and queue presentation changes that reflect the latest planning state
- [x] 3.4 Publish planning updates through shared contracts so the shell and analytics stay consistent with job changes

## 4. Analytics Dashboard

- [x] 4.1 Replace placeholder analytics cards with KPI panels derived from analytics aggregation logic
- [x] 4.2 Implement pseudo realtime refresh behavior that updates dashboard values every 2 seconds while the analytics view is active
- [x] 4.3 Add a monitoring or insight panel that summarizes relevant yard and planning changes
- [x] 4.4 Ensure analytics reacts to shared yard and planning events without coupling to remote component internals

## 5. Testing And Delivery Readiness

- [x] 5.1 Add focused automated tests for yard filtering and detail rendering against structured domain data
- [x] 5.2 Add focused automated tests for planning actions and the resulting shared event updates
- [x] 5.3 Add focused automated tests for analytics aggregation behavior from yard and planning inputs
- [x] 5.4 Update README, validation notes, and any delivery-facing documentation to reflect the completed workflows and testing approach
