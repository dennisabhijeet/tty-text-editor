import { EventRegistryInterface } from "../eventRegistryInterface";
import { Editor } from "../../editor";
import { Key } from "node:readline";

export class HandleSpaceKey implements EventRegistryInterface {
  constructor() {}
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    // Get Buffer
    const buffer = thisArg.buffer;
    if (!buffer) {
      return true;
    }

    const currentLine = buffer[thisArg.cursorPosition.row];
    const currentWindowSize = thisArg.windowSize[0];

    if (currentLine.length >= currentWindowSize) {
      return true;
    }

    buffer[thisArg.cursorPosition.row] =
      currentLine.slice(0, thisArg.cursorPosition.column) +
      " " +
      currentLine.slice(thisArg.cursorPosition.column);

    // Moved cursor position
    thisArg.cursorPosition.column += 1;

    callbackFunction();
    return true;
  }
}
