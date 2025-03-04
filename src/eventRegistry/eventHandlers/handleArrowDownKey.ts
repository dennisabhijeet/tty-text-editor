import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleArrowDownKey implements EventRegistryInterface {
  handleEvent(key: Key, thisArg: Editor): boolean {
    // Get Buffer
    const buffer = thisArg.buffer;
    if (!buffer || thisArg.cursorPosition.row === buffer.length - 1) {
      return true;
    }

    const currentLine = buffer[thisArg.cursorPosition.row];
    const downLine = buffer[thisArg.cursorPosition.row + 1];

    let newCusrorColumnPostion = 0;
    if (downLine.length < currentLine.length) {
      newCusrorColumnPostion = downLine.length;
    }

    thisArg.cursorPosition.row += 1;
    thisArg.cursorPosition.column =
      thisArg.cursorPosition.column <= downLine.length
        ? thisArg.cursorPosition.column
        : newCusrorColumnPostion;

    // move cursor position to down
    thisArg.moveCursorTo(
      thisArg.cursorPosition.column,
      thisArg.cursorPosition.row,
    );

    return true;
  }
}
