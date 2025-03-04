import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleBackSpaceKey implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    // Get Buffer
    const buffer = thisArg.buffer;
    if (!buffer || thisArg.cursorPosition.column === 0) {
      return true;
    }

    const currentLine = buffer[thisArg.cursorPosition.row];
    const splitedParts = currentLine.split("");

    splitedParts.splice(thisArg.cursorPosition.column - 1, 1);
    const newLine = splitedParts.join("");
    buffer[thisArg.cursorPosition.row] = newLine;
    thisArg.cursorPosition.column -= 1;

    callbackFunction();
    return true;
  }
}
