import readLine, { createInterface, Key } from "node:readline";
import fs from "node:fs";
import { ReadStream, WriteStream } from "node:tty";
import { EventRegistry } from "./eventRegistry/eventRegistry";

export class Editor {
  constructor() {}

  cursorPosition = { row: 0, column: 0 };
  writeStream: (WriteStream & { fd: 1 }) | null = null;
  readStream: (ReadStream & { fd: 0 }) | null = null;
  buffer: string[] = [];
  windowSize: number[] = [];
  eventRegistry = EventRegistry.getInstance();

  async init(filePath: string) {
    this.readStream = process.stdin;
    this.writeStream = process.stdout;
    this.readStream.setEncoding("utf-8");
    readLine.emitKeypressEvents(this.readStream);
    this.readStream.setRawMode(true);
    this.windowSize = this.writeStream.getWindowSize();

    this.buffer = await this.handleFileInput(filePath);
    this.clearScreen(this.writeStream);

    this.display();

    this.readStream.on("keypress", (str, key: Key) =>
      this.eventRegistry
        .getEventHandlerFromRegistry(key)
        ?.handleEvent(key, this, this.refreshScreen.bind(this)),
    );
  }

  display(row: number = 0, column: number = 0) {
    this.writeStream?.write(this.buffer.join("\n"));
    this.writeStream?.cursorTo(column, row);
  }

  /**
   * read given file add file content in the buffer
   * @param filePath
   */
  async handleFileInput(filePath: string): Promise<string[]> {
    const buffer: string[] = [];
    if (!fs.existsSync(filePath)) {
      return buffer;
    }

    const fileReadStream = fs.createReadStream(filePath, { encoding: "utf-8" });

    const readLine = createInterface({
      input: fileReadStream,
      terminal: true,
    });

    return new Promise((res, rej) => {
      readLine.on("line", (data) => {
        buffer.push(data + " ");
      });

      readLine.on("close", () => {
        res(buffer);
      });

      readLine.on("SIGINT", rej);
      readLine.on("SIGCONT", rej);
      readLine.on("SIGTSTP", rej);
    });
  }

  /**
   * clear terminal screen
   */
  clearScreen(
    writeStream:
      | (WriteStream & {
          fd: 1;
        })
      | null,
    cursorPosition = { row: 0, column: 0 },
  ) {
    if (!!writeStream) {
      writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
      writeStream.clearScreenDown();
    }
  }

  public refreshScreen() {
    this.clearScreen(this.writeStream);
    this.display();
    this.writeStream?.cursorTo(
      this.cursorPosition.column,
      this.cursorPosition.row,
    );
  }
}
