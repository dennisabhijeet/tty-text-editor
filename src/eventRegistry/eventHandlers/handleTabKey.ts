import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleTabKey implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    const tabSize = 2;
    // Get Buffer
    const buffer = thisArg.buffer;
    if (!buffer) {
      return true;
    }

    const currentLine = buffer[thisArg.cursorPosition.row];
    const currentWindowColumnSize = thisArg.windowSize[0];

    if (currentLine.length + tabSize > currentWindowColumnSize) {
      return true;
    }

    buffer[thisArg.cursorPosition.row] =
      currentLine.slice(0, thisArg.cursorPosition.column) +
      " ".repeat(tabSize) +
      currentLine.slice(thisArg.cursorPosition.column);

    // Moved cursor position
    thisArg.cursorPosition.column += tabSize;
    callbackFunction();

    return true;
  }
}
