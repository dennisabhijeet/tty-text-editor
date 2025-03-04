import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleArrowLeftKey implements EventRegistryInterface {
  handleEvent(key: Key, thisArg: Editor): boolean {
    // Get Buffer
    const buffer = thisArg.buffer;
    if (!buffer || thisArg.cursorPosition.column === 0) {
      return true;
    }

    thisArg.cursorPosition.column -= 1;

    // move cursor position to left
    thisArg.moveCursorTo(
      thisArg.cursorPosition.column,
      thisArg.cursorPosition.row,
    );
    return true;
  }
}
