import { Key } from "readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleEnterKey implements EventRegistryInterface {
  handleEvent(
    key: Key,
    thisArg: Editor,
    callbackFunction: (...args: any) => void,
  ): boolean {
    // current row of cursor
    const currentLine = thisArg.buffer[thisArg.cursorPosition.row];

    const splitedParts = currentLine.split("");
    splitedParts.splice(thisArg.cursorPosition.column, 0, "\\n");
    const joinedSplitedParts = splitedParts.join("");
    const updatedRow = joinedSplitedParts.split("\\n");

    thisArg.buffer.splice(thisArg.cursorPosition.row, 1, ...updatedRow);

    // Moved cursor position
    thisArg.cursorPosition.column = 0;
    thisArg.cursorPosition.row += 1;

    callbackFunction();
    return true;
  }
}
