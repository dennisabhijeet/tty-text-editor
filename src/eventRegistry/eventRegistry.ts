import { Key } from "readline";
import { EventRegistryInterface } from "./eventRegistryInterface";
import { EventNames, MapEventsToHandler } from "./types";

export class EventRegistry {
  static #registryInstance: EventRegistry = new EventRegistry();

  #eventsHandlerMap: Map<EventNames, EventRegistryInterface> = new Map<
    EventNames,
    EventRegistryInterface
  >();

  // avoid creating instance using new keyword
  private constructor() {}

  getEventHandlerFromRegistry(key: Key): EventRegistryInterface | undefined {
    const eventName = this.getEventKey(key);
    return this.#eventsHandlerMap.get(eventName as EventNames);
  }

  getEventKey(key: Key) {
    return key.ctrl
      ? `ctrl+${key.name}`
      : key.sequence!.charCodeAt(0) > 32 && key.sequence!.charCodeAt(0) <= 126
        ? EventNames.Char
        : key.name;
  }

  setEventHandlerToRegistry(
    eventName: EventNames,
    handler: EventRegistryInterface,
  ) {
    return this.#eventsHandlerMap.set(eventName, handler);
  }

  static #setupEventHandlers() {
    if (EventRegistry.#registryInstance.#eventsHandlerMap.size === 0) {
      EventRegistry.#registryInstance.#eventsHandlerMap = MapEventsToHandler;
    }
  }

  static getInstance(): EventRegistry {
    if (EventRegistry.#registryInstance) {
      // setup event registry
      EventRegistry.#setupEventHandlers();
      return EventRegistry.#registryInstance;
    }
    throw new Error("Instance not found");
  }
}
