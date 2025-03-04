import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleArrowUpKey implements EventRegistryInterface {
  handleEvent(key: Key, thisArg: Editor): boolean {
    // Get Buffer
    const buffer = thisArg.buffer;
    if (!buffer || thisArg.cursorPosition.row === 0) {
      return true;
    }

    const currentLine = buffer[thisArg.cursorPosition.row];
    const upLine = buffer[thisArg.cursorPosition.row - 1];

    let newCusrorColumnPostion = 0;
    if (upLine.length < currentLine.length) {
      newCusrorColumnPostion = upLine.length;
    }

    thisArg.cursorPosition.row -= 1;
    thisArg.cursorPosition.column =
      thisArg.cursorPosition.column <= upLine.length
        ? thisArg.cursorPosition.column
        : newCusrorColumnPostion;

    // move cursor position to up
    thisArg.moveCursorTo(
      thisArg.cursorPosition.column,
      thisArg.cursorPosition.row,
    );
    return true;
  }
}
