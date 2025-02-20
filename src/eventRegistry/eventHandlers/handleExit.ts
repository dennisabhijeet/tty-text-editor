import { Key } from "node:readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";

export class HandleExit implements EventRegistryInterface {
  handleEvent(key: Key, thisArg: Editor): boolean {
    thisArg.clearScreen(thisArg.writeStream);
    process.exit(0);
    return true;
  }
}
