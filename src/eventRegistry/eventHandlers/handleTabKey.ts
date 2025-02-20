import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleTabKey implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    if (
      thisArg.windowSize[0] >=
      thisArg.buffer[thisArg.cursorPosition.row].length + 2
    ) {
      const tabSize = 2;
      const currentLine = thisArg.buffer[thisArg.cursorPosition.row];

      const newLine =
        currentLine.slice(0, thisArg.cursorPosition.column) +
        " ".repeat(tabSize) +
        currentLine.slice(thisArg.cursorPosition.column);

      // Update the buffer with the new line
      thisArg.buffer[thisArg.cursorPosition.row] = newLine;
      thisArg.cursorPosition.column += tabSize;

      callbackFunction();
    }

    return true;
  }
}
