import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleChar implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    if (
      thisArg.windowSize[0] > thisArg.buffer[thisArg.cursorPosition.row].length
    ) {
      const currentRow = thisArg.buffer[thisArg.cursorPosition.row];

      if (currentRow) {
        // Insert the character at the cursor position in the row
        thisArg.buffer[thisArg.cursorPosition.row] =
          currentRow.slice(0, thisArg.cursorPosition.column) +
          key.sequence +
          currentRow.slice(thisArg.cursorPosition.column);

        // Move the cursor forward after the inserted character
        thisArg.cursorPosition.column += 1;

        callbackFunction();
      }
    }

    return true;
  }
}
