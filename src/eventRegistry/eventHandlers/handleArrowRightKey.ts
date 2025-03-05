import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleArrowRightKey implements EventRegistryInterface {
  handleEvent(key: Key, thisArg: Editor): boolean {
    // Get Buffer
    const buffer = thisArg.buffer;
    if (!buffer) {
      return true;
    }
    const currentLineIndex =
      thisArg.cursorPosition.row + thisArg.currentScreenSize.startRow;

    const currentLine = buffer[currentLineIndex];

    if (thisArg.cursorPosition.column === currentLine.length) {
      return true;
    }

    thisArg.cursorPosition.column += 1;

    // move cursor position to right
    thisArg.moveCursorTo(
      thisArg.cursorPosition.column,
      thisArg.cursorPosition.row,
    );
    return true;
  }
}
