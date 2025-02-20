import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleArrowLeftKey implements EventRegistryInterface {
  handleEvent(key: Key, thisArg: Editor): boolean {
    if (
      thisArg.buffer?.[thisArg.cursorPosition.row] &&
      thisArg.buffer?.[thisArg.cursorPosition.row]?.[
        thisArg.cursorPosition.column - 1
      ]
    ) {
      thisArg.cursorPosition.column -= 1;
      thisArg.writeStream?.cursorTo(
        thisArg.cursorPosition.column,
        thisArg.cursorPosition.row,
      );
    }
    return true;
  }
}
