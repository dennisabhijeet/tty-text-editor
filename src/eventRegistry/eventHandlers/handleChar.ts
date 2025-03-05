import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleChar implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    // Get Buffer
    const buffer = thisArg.buffer;
    if (!buffer) {
      return true;
    }
    const currentLineIndex =
      thisArg.cursorPosition.row + thisArg.currentScreenSize.startRow;
    const currentLine = buffer[currentLineIndex];
    const currentWindowColumnSize = thisArg.windowSize[0];
    if (currentLine.length >= currentWindowColumnSize) {
      return true;
    }

    buffer[currentLineIndex] =
      currentLine.slice(0, thisArg.cursorPosition.column) +
      key.sequence +
      currentLine.slice(thisArg.cursorPosition.column);

    // Move the cursor forward after the inserted character
    thisArg.cursorPosition.column += 1;

    callbackFunction();

    return true;
  }
}
