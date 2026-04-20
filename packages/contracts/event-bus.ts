import type { PlatformEventMap, PlatformEventName } from "./events";

const EVENT_PREFIX = "tos:platform:";
// Keeping the latest payload per event lets newly mounted remotes recover current context immediately.
const latestPayloads = new Map<PlatformEventName, PlatformEventMap[PlatformEventName]>();

type EventDetail<TEventName extends PlatformEventName> = {
  payload: PlatformEventMap[TEventName];
};

function getEventName<TEventName extends PlatformEventName>(eventName: TEventName) {
  // Prefixing avoids collisions with unrelated browser events.
  return `${EVENT_PREFIX}${eventName}`;
}

export function emitPlatformEvent<TEventName extends PlatformEventName>(
  eventName: TEventName,
  payload: PlatformEventMap[TEventName],
) {
  // The event bus works as both a live signal and a tiny in-memory replay buffer.
  latestPayloads.set(eventName, payload);
  window.dispatchEvent(
    new CustomEvent<EventDetail<TEventName>>(getEventName(eventName), {
      detail: { payload },
    }),
  );
}

export function getLastPlatformEvent<TEventName extends PlatformEventName>(eventName: TEventName) {
  return latestPayloads.get(eventName) as PlatformEventMap[TEventName] | undefined;
}

export function subscribeToPlatformEvent<TEventName extends PlatformEventName>(
  eventName: TEventName,
  listener: (payload: PlatformEventMap[TEventName]) => void,
) {
  // Remotes subscribe through shared contracts, so they stay decoupled from each other's implementation files.
  const eventListener = (event: Event) => {
    const customEvent = event as CustomEvent<EventDetail<TEventName>>;
    listener(customEvent.detail.payload);
  };

  window.addEventListener(getEventName(eventName), eventListener as EventListener);

  return () => {
    window.removeEventListener(getEventName(eventName), eventListener as EventListener);
  };
}
