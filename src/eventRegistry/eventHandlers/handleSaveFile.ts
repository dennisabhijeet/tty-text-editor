import { Key } from "readline";
import { Editor } from "../../editor";
import { EventRegistryInterface } from "../eventRegistryInterface";
import * as fs from "fs";

export class HandleSaveFile implements EventRegistryInterface {
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
    fs.writeFile("output.txt", buffer.join("\n"), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      }
    });
    callbackFunction();

    return true;
  }
}
