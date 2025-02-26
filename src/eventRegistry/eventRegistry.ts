import { Key } from "readline";
import { EventRegistryInterface } from "./eventRegistryInterface";
import {
  EventNames,
  MapEventsToHandler,
} from "./eventMapping/event-to-handler-mapping";

export class EventRegistry {
  static #registryInstance: EventRegistry = new EventRegistry();

  #eventsHandlerMap: Map<EventNames, EventRegistryInterface> = new Map<
    EventNames,
    EventRegistryInterface
  >();

  // avoid creating instance using new keyword
  private constructor() {}

  /**
   * Function to get the event handler from registry
   * @param key
   */
  public getEventHandlerFromRegistry(
    key: Key,
  ): EventRegistryInterface | undefined {
    const eventName = this.getEventKey(key);
    return this.#eventsHandlerMap.get(eventName as EventNames);
  }

  /**
   * Function to get the event key name
   * @param key
   */
  public getEventKey(key: Key): string | undefined {
    return key.ctrl
      ? `ctrl+${key.name}`
      : key.sequence!.charCodeAt(0) > 32 && key.sequence!.charCodeAt(0) <= 126
        ? EventNames.Char
        : key.name;
  }

  /**
   * Function to set the event handler in registry
   * @param eventName
   * @param handler
   */
  public setEventHandlerToRegistry(
    eventName: EventNames,
    handler: EventRegistryInterface,
  ): Map<EventNames, EventRegistryInterface> {
    return this.#eventsHandlerMap.set(eventName, handler);
  }

  /**
   * Function to Setup Event name to Handler mapping
   */
  static #setupEventHandlers(): void {
    if (EventRegistry.#registryInstance.#eventsHandlerMap.size === 0) {
      EventRegistry.#registryInstance.#eventsHandlerMap = MapEventsToHandler;
    }
  }

  /**
   * Function to get the Event Registry Class Instance or throws an error if Instance not found.
   */
  static getInstance(): EventRegistry {
    if (EventRegistry.#registryInstance) {
      // setup event registry
      EventRegistry.#setupEventHandlers();
      return EventRegistry.#registryInstance;
    }
    throw new Error("Instance not found");
  }
}
