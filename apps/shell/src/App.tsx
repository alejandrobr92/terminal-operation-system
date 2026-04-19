import { Suspense, lazy, useEffect, useState, type ComponentType } from "react";
import {
  getLastPlatformEvent,
  subscribeToPlatformEvent,
  type JobStatus,
  type PlatformRoute,
  type RemoteDefinition,
} from "@tos/contracts";
import "./App.css";

const YardRemote = lazy(() => loadRemoteComponent(() => import("yard/App")));
const PlanningRemote = lazy(() => loadRemoteComponent(() => import("planning/App")));
const AnalyticsRemote = lazy(() => loadRemoteComponent(() => import("analytics/App")));

const remoteDefinitions: RemoteDefinition[] = [
  {
    id: "yard",
    displayName: "Yard Operations",
    route: "/yard",
    module: "yard/App",
  },
  {
    id: "planning",
    displayName: "Move Planning",
    route: "/planning",
    module: "planning/App",
  },
  {
    id: "analytics",
    displayName: "Analytics",
    route: "/analytics",
    module: "analytics/App",
  },
];

const routeSet = new Set<PlatformRoute>(["/", "/yard", "/planning", "/analytics"]);

function getCurrentRoute(): PlatformRoute {
  const pathname = window.location.pathname as PlatformRoute;
  return routeSet.has(pathname) ? pathname : "/";
}

function App() {
  const [route, setRoute] = useState<PlatformRoute>(() => getCurrentRoute());
  const [lastEvent, setLastEvent] = useState<string>(() => {
    const latestJob = getLastPlatformEvent("jobUpdated");
    if (latestJob) {
      return `Planning changed ${latestJob.id} to ${formatJobStatus(latestJob.status)}.`;
    }

    const latestContainer = getLastPlatformEvent("containerSelected");
    if (latestContainer) {
      return `Container ${latestContainer.id} was selected from yard operations.`;
    }

    return "No cross-MFE event received yet.";
  });

  useEffect(() => {
    const handlePopState = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const unsubscribeContainer = subscribeToPlatformEvent("containerSelected", ({ id }) => {
      setLastEvent(`Container ${id} was selected from yard operations.`);
    });

    const unsubscribeJob = subscribeToPlatformEvent("jobUpdated", ({ id, status }) => {
      setLastEvent(`Planning changed ${id} to ${formatJobStatus(status)}.`);
    });

    return () => {
      unsubscribeContainer();
      unsubscribeJob();
    };
  }, []);

  const navigate = (nextRoute: PlatformRoute) => {
    if (nextRoute === route) {
      return;
    }

    window.history.pushState({}, "", nextRoute);
    setRoute(nextRoute);
  };

  const activeRemote = remoteDefinitions.find((definition) => definition.route === route);

  return (
    <main className="shell-app">
      <section className="shell-hero">
        <div>
          <p className="eyebrow">Shell Application</p>
          <h1>Terminal operations, composed from independent remotes.</h1>
          <p className="hero-copy">
            The shell owns navigation, route state, and remote composition while
            each domain keeps its own UI and contract surface.
          </p>
        </div>

        <div className="status-card">
          <span>Runtime composition</span>
          <strong>{activeRemote ? activeRemote.displayName : "Platform overview"}</strong>
          <p>{activeRemote ? activeRemote.module : "Select a route to mount a remote."}</p>
        </div>
      </section>

      <section className="event-banner">
        <span>Shared event bus</span>
        <strong>{lastEvent}</strong>
      </section>

      <nav className="shell-nav" aria-label="Platform navigation">
        <button
          className={route === "/" ? "nav-link active" : "nav-link"}
          onClick={() => navigate("/")}
          type="button"
        >
          Overview
        </button>
        {remoteDefinitions.map((definition) => (
          <button
            key={definition.id}
            className={route === definition.route ? "nav-link active" : "nav-link"}
            onClick={() => navigate(definition.route)}
            type="button"
          >
            {definition.displayName}
          </button>
        ))}
      </nav>

      <section className="shell-frame">
        {route === "/" ? (
          <Overview onNavigate={navigate} />
        ) : (
          <Suspense fallback={<RouteFallback route={route} />}>
            <RemoteOutlet route={route} />
          </Suspense>
        )}
      </section>
    </main>
  );
}

function Overview({ onNavigate }: { onNavigate: (route: PlatformRoute) => void }) {
  return (
    <div className="overview-grid">
      {remoteDefinitions.map((definition) => (
        <article key={definition.id} className="overview-card">
          <div>
            <p className="overview-label">{definition.displayName}</p>
            <h2>{definition.route}</h2>
            <p className="overview-copy">
              Remote module <code>{definition.module}</code> is ready for shell-driven composition.
            </p>
          </div>
          <button type="button" className="card-action" onClick={() => onNavigate(definition.route)}>
            Open remote
          </button>
        </article>
      ))}
    </div>
  );
}

function RouteFallback({ route }: { route: PlatformRoute }) {
  return (
    <div className="fallback-panel" role="status" aria-live="polite">
      <p className="fallback-label">Loading remote</p>
      <strong>{route.replace("/", "") || "overview"}</strong>
      <p>The shell frame stays active while the domain bundle is resolved.</p>
    </div>
  );
}

function RemoteOutlet({ route }: { route: PlatformRoute }) {
  if (route === "/yard") {
    return <YardRemote />;
  }

  if (route === "/planning") {
    return <PlanningRemote />;
  }

  if (route === "/analytics") {
    return <AnalyticsRemote />;
  }

  return null;
}

function formatJobStatus(status: JobStatus) {
  if (status === "InProgress") {
    return "In Progress";
  }

  return status;
}

function loadRemoteComponent(
  loader: () => Promise<{
    default?: unknown;
  }>,
) {
  return loader().then((module) => ({
    default: resolveRemoteComponent(module),
  }));
}

function resolveRemoteComponent(module: { default?: unknown }): ComponentType {
  if (typeof module.default === "function") {
    return module.default as ComponentType;
  }

  if (
    module.default &&
    typeof module.default === "object" &&
    "default" in module.default &&
    typeof module.default.default === "function"
  ) {
    return module.default.default as ComponentType;
  }

  throw new Error("Remote module did not resolve to a React component.");
}

export default App;
