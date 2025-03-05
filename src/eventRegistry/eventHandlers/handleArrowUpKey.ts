import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleArrowUpKey implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    // Get Buffer
    const buffer = thisArg.buffer;
    if (
      !buffer ||
      (thisArg.cursorPosition.row === 0 &&
        thisArg.currentScreenSize.startRow === 0)
    ) {
      return true;
    }

    let rerender = false;
    const currentLineIndex =
      thisArg.cursorPosition.row + thisArg.currentScreenSize.startRow;

    const currentLine = buffer[currentLineIndex];
    const upLine = buffer[currentLineIndex - 1];

    let newCursorColumnPosition = 0;
    if (upLine.length < currentLine.length) {
      newCursorColumnPosition = upLine.length;
    }

    if (
      thisArg.cursorPosition.row === 0 &&
      thisArg.currentScreenSize.startRow !== 0
    ) {
      thisArg.currentScreenSize.startRow -= 1;
      thisArg.currentScreenSize.endRow -= 1;
      rerender = true;
    } else {
      thisArg.cursorPosition.row -= 1;
    }
    thisArg.cursorPosition.column =
      thisArg.cursorPosition.column <= upLine.length
        ? thisArg.cursorPosition.column
        : newCursorColumnPosition;

    // move cursor position to up
    thisArg.moveCursorTo(
      thisArg.cursorPosition.column,
      thisArg.cursorPosition.row,
    );

    if (rerender) {
      callbackFunction();
    }

    return true;
  }
}
