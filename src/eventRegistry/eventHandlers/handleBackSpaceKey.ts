import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleBackSpaceKey implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    const currentLineIndex =
      thisArg.cursorPosition.row + thisArg.currentScreenSize.startRow;

    if (currentLineIndex === 0 && thisArg.cursorPosition.column === 0) {
      return true;
    }

    const currentLine = thisArg.buffer[currentLineIndex];

    if (thisArg.cursorPosition.column > 0) {
      // Remove the character before the cursor
      const newLine =
        currentLine.slice(0, thisArg.cursorPosition.column - 1) +
        currentLine.slice(thisArg.cursorPosition.column);
      thisArg.buffer[currentLineIndex] = newLine;

      // Move cursor back
      thisArg.cursorPosition.column--;
    } else if (currentLineIndex > 0) {
      const previousLine = thisArg.buffer[currentLineIndex - 1];
      const currentLine = thisArg.buffer[currentLineIndex];

      // Merge with previous line
      thisArg.buffer[currentLineIndex - 1] = previousLine + currentLine;

      // Remove current line
      thisArg.buffer.splice(currentLineIndex, 1);

      // Move cursor to end of previous line
      if (
        thisArg.cursorPosition.row === 0 &&
        thisArg.currentScreenSize.startRow !== 0
      ) {
        thisArg.currentScreenSize.startRow -= 1;
        thisArg.currentScreenSize.endRow -= 1;
      } else {
        thisArg.cursorPosition.row -= 1;
      }
      // thisArg.cursorPosition.row -= 1;
      thisArg.cursorPosition.column = previousLine.length;
    }

    callbackFunction();
    return true;
  }
}
