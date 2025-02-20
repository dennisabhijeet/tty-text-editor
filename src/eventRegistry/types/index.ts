import { HandleArrowDownKey } from "../eventHandlers/handleArrowDownKey";
import { HandleArrowLeftKey } from "../eventHandlers/handleArrowLeftKey";
import { HandleArrowRightKey } from "../eventHandlers/handleArrowRightKey";
import { HandleArrowUpKey } from "../eventHandlers/handleArrowUpKey";
import { HandleBackSpaceKey } from "../eventHandlers/handleBackSpaceKey";
import { HandleChar } from "../eventHandlers/handleChar";
import { HandleExit } from "../eventHandlers/handleExit";
import { HandleSpaceKey } from "../eventHandlers/handleSpaceKey";
import { HandleTabKey } from "../eventHandlers/handleTabKey";
import { EventRegistryInterface } from "../eventRegistryInterface";

export enum EventNames {
  Space = "space",
  Tab = "tab",
  BackSpace = "backspace",
  ArrowUp = "up",
  ArrowDown = "down",
  ArrowLeft = "left",
  ArrowRight = "right",
  CtrlPlusQ = "ctrl+q",
  Char = "char",
}

export const MapEventsToHandler: Map<EventNames, EventRegistryInterface> =
  new Map([
    [EventNames.Space, new HandleSpaceKey()],
    [EventNames.ArrowUp, new HandleArrowUpKey()],
    [EventNames.ArrowDown, new HandleArrowDownKey()],
    [EventNames.ArrowLeft, new HandleArrowLeftKey()],
    [EventNames.ArrowRight, new HandleArrowRightKey()],
    [EventNames.CtrlPlusQ, new HandleExit()],
    [EventNames.BackSpace, new HandleBackSpaceKey()],
    [EventNames.Tab, new HandleTabKey()],
    [EventNames.Char, new HandleChar()],
  ]);
