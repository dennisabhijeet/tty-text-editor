import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleArrowDownKey implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    // Get Buffer
    let rerender = false;
    const currentLineIndex =
      thisArg.cursorPosition.row + thisArg.currentScreenSize.startRow;
    const buffer = thisArg.buffer;

    if (!buffer || currentLineIndex === buffer.length - 1) {
      return true;
    }

    const currentLine = buffer[currentLineIndex];
    const downLine = buffer[currentLineIndex + 1];

    let newCursorColumnPosition = 0;
    if (downLine.length < currentLine.length) {
      newCursorColumnPosition = downLine.length;
    }

    if (
      thisArg.cursorPosition.row <
      thisArg.currentScreenSize.endRow - thisArg.currentScreenSize.startRow - 1
    ) {
      thisArg.cursorPosition.row += 1;
    } else {
      thisArg.currentScreenSize.startRow += 1;
      thisArg.currentScreenSize.endRow += 1;
      rerender = true;
    }
    thisArg.cursorPosition.column =
      thisArg.cursorPosition.column <= downLine.length
        ? thisArg.cursorPosition.column
        : newCursorColumnPosition;

    // move cursor position to down
    thisArg.moveCursorTo(
      thisArg.cursorPosition.column,
      thisArg.cursorPosition.row,
    );

    // if screen size changed
    if (rerender) {
      callbackFunction();
    }
    return true;
  }
}
