import { emitPlatformEvent } from "@tos/contracts";
import { useState } from "react";
import { getYardContainers, type YardContainerRecord } from "./domain/yard-data";
import "./App.css";

const containers = getYardContainers();

function App() {
  const [selectedContainerId, setSelectedContainerId] = useState<string>(containers[0].id);

  const handleSelectContainer = (container: YardContainerRecord) => {
    setSelectedContainerId(container.id);
    emitPlatformEvent("containerSelected", { id: container.id });
  };

  return (
    <main className="yard-shell">
      <section className="yard-hero">
        <p className="eyebrow">Remote: Yard Operations</p>
        <h1>Yard visibility is ready for shell composition.</h1>
        <p className="summary">
          This placeholder proves the yard remote can own its own domain surface
          while sharing contracts with the rest of the platform.
        </p>
      </section>

      <section className="yard-grid">
        <article className="signal-card">
          <span>Active blocks</span>
          <strong>12</strong>
          <p>Inbound, hold, and outbound stacks are now represented by typed container data.</p>
        </article>

        <article className="signal-card accent">
          <span>Priority watch</span>
          <strong>3 containers</strong>
          <p>High-attention units can be surfaced to planning and analytics through shared events next.</p>
        </article>
      </section>

      <section className="manifest">
        <div className="manifest-header">
          <h2>Bootstrap manifest</h2>
          <p>Sample units held locally inside the yard remote.</p>
        </div>

        <ul className="container-list">
          {containers.map((container) => (
            <li key={container.id}>
              <div>
                <p className="container-id">{container.id}</p>
                <p className="container-meta">
                  {container.status} · {container.location} · {container.block}
                </p>
              </div>
              <div className="container-actions">
                <span className="priority-badge">P{container.priority}</span>
                <button
                  className={selectedContainerId === container.id ? "select-button active" : "select-button"}
                  onClick={() => handleSelectContainer(container)}
                  type="button"
                >
                  {selectedContainerId === container.id ? "Broadcasting" : "Broadcast selection"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
