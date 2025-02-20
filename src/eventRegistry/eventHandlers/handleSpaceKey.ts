import { EventRegistryInterface } from "../eventRegistryInterface";
import { Editor } from "../../editor";
import { Key } from "node:readline";

export class HandleSpaceKey implements EventRegistryInterface {
  constructor() {}
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    // console.log("handling space key");
    const line = thisArg.buffer[thisArg.cursorPosition.row] ?? "";
    const windowColumnSize = thisArg.writeStream!.getWindowSize()[0];
    if (line.length < windowColumnSize) {
      thisArg.buffer[thisArg.cursorPosition.row] =
        line.slice(0, thisArg.cursorPosition.column) +
        " " +
        line.slice(thisArg.cursorPosition.column);

      thisArg.cursorPosition.column += 1;
    }
    callbackFunction(thisArg.cursorPosition.row, thisArg.cursorPosition.column);
    return true;
  }
}
