import { Key } from "readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleEnterKey implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    //  Get Buffer
    const buffer = thisArg.buffer;
    if (!buffer) {
      return true;
    }
    const currentLineIndex =
      thisArg.cursorPosition.row + thisArg.currentScreenSize.startRow;

    const currentLine = buffer[currentLineIndex];

    const firstPart = currentLine.slice(0, thisArg.cursorPosition.column);
    const secondPart = currentLine.slice(thisArg.cursorPosition.column);

    buffer.splice(currentLineIndex, 1, firstPart, secondPart);

    // Moved cursor position
    thisArg.cursorPosition.column = 0;

    if (
      thisArg.cursorPosition.row <
      thisArg.currentScreenSize.endRow - thisArg.currentScreenSize.startRow - 1
    ) {
      thisArg.cursorPosition.row += 1;
    } else {
      thisArg.currentScreenSize.startRow += 1;
      thisArg.currentScreenSize.endRow += 1;
    }

    callbackFunction();

    return true;
  }
}
