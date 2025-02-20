import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleBackSpaceKey implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    if (
      thisArg.cursorPosition.row === 0 &&
      thisArg.cursorPosition.column === 0
    ) {
      return true;
    }

    const currentLine = thisArg.buffer[thisArg.cursorPosition.row];

    if (thisArg.cursorPosition.column > 0) {
      // Remove the character before the cursor
      const newLine =
        currentLine.slice(0, thisArg.cursorPosition.column - 1) +
        currentLine.slice(thisArg.cursorPosition.column);
      thisArg.buffer[thisArg.cursorPosition.row] = newLine;

      // Move cursor back
      thisArg.cursorPosition.column--;
    } else if (thisArg.cursorPosition.row > 0) {
      const previousLine = thisArg.buffer[thisArg.cursorPosition.row - 1];
      const currentLine = thisArg.buffer[thisArg.cursorPosition.row];

      // Merge with previous line
      thisArg.buffer[thisArg.cursorPosition.row - 1] =
        previousLine + currentLine;

      // Remove current line
      thisArg.buffer.splice(thisArg.cursorPosition.row, 1);

      // Move cursor to end of previous line
      thisArg.cursorPosition.row--;
      thisArg.cursorPosition.column = previousLine.length;
    }
    callbackFunction();
    return true;
  }
}
