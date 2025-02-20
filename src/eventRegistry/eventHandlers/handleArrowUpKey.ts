import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleArrowUpKey implements EventRegistryInterface {
  handleEvent(key: Key, thisArg: Editor): boolean {
    if (thisArg.buffer?.[thisArg.cursorPosition.row - 1]) {
      if (
        thisArg.buffer?.[thisArg.cursorPosition.row - 1].length >=
        thisArg.cursorPosition.column
      ) {
        thisArg.cursorPosition.row -= 1;
        thisArg.writeStream?.cursorTo(
          thisArg.cursorPosition.column,
          thisArg.cursorPosition.row,
        );
      } else {
        thisArg.cursorPosition.row -= 1;
        thisArg.cursorPosition.column =
          thisArg.buffer[thisArg.cursorPosition.row].length - 1;
        thisArg.writeStream?.cursorTo(
          thisArg.cursorPosition.column,
          thisArg.cursorPosition.row,
        );
      }
    }
    return true;
  }
}
