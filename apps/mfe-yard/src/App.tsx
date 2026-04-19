import { emitPlatformEvent } from "@tos/contracts";
import { useEffect, useMemo, useState } from "react";
import {
  applyYardFilters,
  defaultYardFilters,
  findYardContainerById,
  getYardContainers,
  getYardFilterOptions,
  getYardOverview,
  type YardContainerRecord,
  type YardFilterState,
} from "./domain/yard-data";
import "./App.css";

type DataMode = "live" | "empty" | "error";
type ViewState = "loading" | "ready" | "empty" | "error";

const sourceContainers = getYardContainers();
const filterOptions = getYardFilterOptions();

function App() {
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(sourceContainers[0]?.id ?? null);
  const [filters, setFilters] = useState<YardFilterState>(defaultYardFilters);
  const [dataMode, setDataMode] = useState<DataMode>("live");
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [availableContainers, setAvailableContainers] = useState<YardContainerRecord[]>([]);

  const handleSelectContainer = (container: YardContainerRecord) => {
    setSelectedContainerId(container.id);
    emitPlatformEvent("containerSelected", { id: container.id });
  };

  useEffect(() => {
    setViewState("loading");

    const timeoutId = window.setTimeout(() => {
      if (dataMode === "error") {
        setAvailableContainers([]);
        setViewState("error");
        return;
      }

      const nextContainers = dataMode === "empty" ? [] : sourceContainers;
      setAvailableContainers(nextContainers);
      setViewState(nextContainers.length === 0 ? "empty" : "ready");
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dataMode]);

  const filteredContainers = useMemo(
    () => applyYardFilters(availableContainers, filters),
    [availableContainers, filters],
  );

  const selectedContainer = useMemo(
    () => findYardContainerById(filteredContainers, selectedContainerId),
    [filteredContainers, selectedContainerId],
  );

  const overview = useMemo(
    () => getYardOverview(availableContainers),
    [availableContainers],
  );

  useEffect(() => {
    if (viewState !== "ready") {
      setSelectedContainerId(null);
      return;
    }

    if (filteredContainers.length === 0) {
      setSelectedContainerId(null);
      return;
    }

    if (!selectedContainer) {
      setSelectedContainerId(filteredContainers[0].id);
    }
  }, [filteredContainers, selectedContainer, viewState]);

  useEffect(() => {
    if (selectedContainer) {
      emitPlatformEvent("containerSelected", { id: selectedContainer.id });
    }
  }, [selectedContainer]);

  const handleFilterChange = <TKey extends keyof YardFilterState>(
    key: TKey,
    value: YardFilterState[TKey],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(defaultYardFilters);
  };

  return (
    <main className="yard-shell">
      <section className="yard-hero">
        <div>
          <p className="eyebrow">Remote: Yard Operations</p>
          <h1>Operate the active yard picture with live filters and container detail.</h1>
        </div>
        <div className="mode-switcher" aria-label="Demo data state">
          <button
            className={dataMode === "live" ? "mode-button active" : "mode-button"}
            onClick={() => setDataMode("live")}
            type="button"
          >
            Live data
          </button>
          <button
            className={dataMode === "empty" ? "mode-button active" : "mode-button"}
            onClick={() => setDataMode("empty")}
            type="button"
          >
            Empty state
          </button>
          <button
            className={dataMode === "error" ? "mode-button active" : "mode-button"}
            onClick={() => setDataMode("error")}
            type="button"
          >
            Error state
          </button>
        </div>
        <p className="summary">
          Yard operations now owns its own data layer, filter logic, detail panel,
          and demo states while still publishing the active container to the rest of the platform.
        </p>
      </section>

      <section className="yard-grid">
        <article className="signal-card">
          <span>Active blocks</span>
          <strong>{overview.occupiedBlocks}</strong>
          <p>Unique block occupancy is derived from the local yard data source.</p>
        </article>

        <article className="signal-card accent">
          <span>Priority watch</span>
          <strong>{overview.highPriorityCount} containers</strong>
          <p>Priority-one units stay visible for downstream planning and analytics signals.</p>
        </article>

        <article className="signal-card">
          <span>Hold watch</span>
          <strong>{overview.holdCount}</strong>
          <p>Containers under hold remain visible with operational event context.</p>
        </article>
      </section>

      <section className="yard-panel">
        <div className="manifest-header">
          <div>
            <h2>Container worklist</h2>
            <p>Filter the active yard picture by operational context and attention level.</p>
          </div>
          <button className="ghost-button" onClick={resetFilters} type="button">
            Reset filters
          </button>
        </div>

        <div className="filter-grid">
          <label>
            <span>Type</span>
            <select
              onChange={(event) => handleFilterChange("type", event.target.value as YardFilterState["type"])}
              value={filters.type}
            >
              <option value="All">All</option>
              {filterOptions.types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select
              onChange={(event) => handleFilterChange("status", event.target.value as YardFilterState["status"])}
              value={filters.status}
            >
              <option value="All">All</option>
              {filterOptions.statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Block</span>
            <select
              onChange={(event) => handleFilterChange("block", event.target.value)}
              value={filters.block}
            >
              <option value="All">All</option>
              {filterOptions.blocks.map((block) => (
                <option key={block} value={block}>
                  {block}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Location</span>
            <select
              onChange={(event) => handleFilterChange("location", event.target.value)}
              value={filters.location}
            >
              <option value="All">All</option>
              {filterOptions.locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Priority</span>
            <select
              onChange={(event) =>
                handleFilterChange(
                  "priority",
                  event.target.value === "All" ? "All" : Number(event.target.value),
                )
              }
              value={filters.priority}
            >
              <option value="All">All</option>
              {filterOptions.priorities.map((priority) => (
                <option key={priority} value={priority}>
                  P{priority}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="operations-layout">
          <section className="worklist-column">
            {viewState === "loading" ? (
              <div className="state-panel">
                <h3>Loading yard picture</h3>
                <p>Refreshing container visibility from the local domain data source.</p>
              </div>
            ) : null}

            {viewState === "error" ? (
              <div className="state-panel error">
                <h3>Yard feed unavailable</h3>
                <p>The remote is simulating an operational data access failure. Switch back to Live data to recover.</p>
              </div>
            ) : null}

            {viewState === "empty" ? (
              <div className="state-panel">
                <h3>No containers available</h3>
                <p>The current source state returned no yard units. This validates the empty workflow without leaving the remote.</p>
              </div>
            ) : null}

            {viewState === "ready" && filteredContainers.length === 0 ? (
              <div className="state-panel">
                <h3>No containers match the active filters</h3>
                <p>Reset filters to restore the full worklist or adjust the current criteria.</p>
              </div>
            ) : null}

            {viewState === "ready" && filteredContainers.length > 0 ? (
              <ul className="container-list">
                {filteredContainers.map((container) => (
                  <li
                    key={container.id}
                    className={selectedContainerId === container.id ? "container-item active" : "container-item"}
                  >
                    <button
                      className="container-card"
                      onClick={() => handleSelectContainer(container)}
                      type="button"
                    >
                      <div className="container-card-main">
                        <p className="container-id">{container.id}</p>
                        <p className="container-meta">
                          {container.status} · {container.type} · {container.location}
                        </p>
                        <p className="event-summary">{container.eventSummary}</p>
                      </div>
                      <div className="container-actions">
                        <span className="priority-badge">P{container.priority}</span>
                        <span className="status-pill">{container.block}</span>
                        <span className="select-button active">
                          {selectedContainerId === container.id ? "Selected" : "Inspect"}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <aside className="detail-panel">
            <div className="detail-header">
              <span className="eyebrow">Container Detail</span>
              <h3>{selectedContainer ? selectedContainer.id : "No active selection"}</h3>
            </div>

            {selectedContainer ? (
              <>
                <dl className="detail-grid">
                  <div>
                    <dt>Status</dt>
                    <dd>{selectedContainer.status}</dd>
                  </div>
                  <div>
                    <dt>Type</dt>
                    <dd>{selectedContainer.type}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{selectedContainer.location}</dd>
                  </div>
                  <div>
                    <dt>Block</dt>
                    <dd>{selectedContainer.block}</dd>
                  </div>
                  <div>
                    <dt>Priority</dt>
                    <dd>P{selectedContainer.priority}</dd>
                  </div>
                  <div>
                    <dt>Load state</dt>
                    <dd>{selectedContainer.isEmpty ? "Empty" : "Loaded"}</dd>
                  </div>
                </dl>

                <section className="detail-section">
                  <h4>Operational events</h4>
                  <ul className="event-list">
                    {selectedContainer.events.map((event) => (
                      <li key={`${selectedContainer.id}-${event.type}-${event.timestamp}`}>
                        <strong>{event.type}</strong>
                        <span>{event.timestamp}</span>
                        <p>{event.note}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            ) : (
              <div className="detail-empty">
                <p>Select a visible container to inspect its yard attributes and event history.</p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

export default App;
