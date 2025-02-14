import readLine, { createInterface, Key } from "node:readline";
import fs from "node:fs";
import { ReadStream, WriteStream } from "node:tty";
import { KeyBoardKey, NavigationKeys } from "./constants/keybroad";
import { printOnFile } from "./utils/printOnFIle";

export class Editor {
  constructor() {}

  cursorPosition = { row: 0, column: 0 };
  writeStream: (WriteStream & { fd: 1 }) | null = null;
  readStream: (ReadStream & { fd: 0 }) | null = null;
  buffer: string[] = [];

  async init(filePath: string) {
    this.readStream = process.stdin;
    this.writeStream = process.stdout;
    this.readStream.setEncoding("utf-8");
    readLine.emitKeypressEvents(this.readStream);
    this.readStream.setRawMode(true);

    this.buffer = await this.handleFileInput(filePath);
    this.clearScreen(this.writeStream);

    this.display();

    this.readStream.on("keypress", (str, key) =>
      this.handleKeyEvents(str, key),
    );
  }

  display() {
    this.writeStream?.write(this.buffer.join("\n"));
    this.writeStream?.cursorTo(0, 0);
  }

  handleKeyEvents(str: string, key: Key) {
    if (key.ctrl && key.name === "c") {
      this.clearScreen(this.writeStream);
      process.exit(0);
    }

    // handle cursor position handling
    if (!!key?.name && NavigationKeys.includes(key?.name)) {
      this.handleCursorNavigation(key?.name as KeyBoardKey);
    }
    printOnFile(`${JSON.stringify(this.cursorPosition)}`);
  }

  handleCursorNavigation(keyName: KeyBoardKey) {
    switch (keyName) {
      case KeyBoardKey.ARROW_UP:
        if (this.buffer?.[this.cursorPosition.row - 1]) {
          if (
            this.buffer?.[this.cursorPosition.row - 1].length >=
            this.cursorPosition.column
          ) {
            this.cursorPosition.row -= 1;
            this.writeStream?.cursorTo(
              this.cursorPosition.column,
              this.cursorPosition.row,
            );
          } else {
            this.cursorPosition.row -= 1;
            this.cursorPosition.column =
              this.buffer[this.cursorPosition.row].length - 1;
            this.writeStream?.cursorTo(
              this.cursorPosition.column,
              this.cursorPosition.row,
            );
          }
        }

        break;
      case KeyBoardKey.ARROW_DOWN:
        if (this.buffer?.[this.cursorPosition.row + 1]) {
          if (
            this.buffer?.[this.cursorPosition.row + 1].length >=
            this.cursorPosition.column
          ) {
            this.cursorPosition.row += 1;
            this.writeStream?.cursorTo(
              this.cursorPosition.column,
              this.cursorPosition.row,
            );
          } else {
            this.cursorPosition.row += 1;
            this.cursorPosition.column =
              this.buffer[this.cursorPosition.row].length - 1;
            this.writeStream?.cursorTo(
              this.cursorPosition.column,
              this.cursorPosition.row,
            );
          }
        }

        break;
      case KeyBoardKey.ARROW_LEFT:
        if (
          this.buffer?.[this.cursorPosition.row] &&
          this.buffer?.[this.cursorPosition.row]?.[
            this.cursorPosition.column - 1
          ]
        ) {
          this.cursorPosition.column -= 1;
          this.writeStream?.cursorTo(
            this.cursorPosition.column,
            this.cursorPosition.row,
          );
        }
        break;
      case KeyBoardKey.ARROW_RIGHT:
        if (
          this.buffer?.[this.cursorPosition.row] &&
          this.buffer?.[this.cursorPosition.row]?.[
            this.cursorPosition.column + 1
          ]
        ) {
          this.cursorPosition.column += 1;
          this.writeStream?.cursorTo(
            this.cursorPosition.column,
            this.cursorPosition.row,
          );
        }
        break;
    }
  }

  // read given file add file content in the buffer
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
        buffer.push(data);
      });

      readLine.on("close", () => {
        res(buffer);
      });

      readLine.on("SIGINT", rej);
      readLine.on("SIGCONT", rej);
      readLine.on("SIGTSTP", rej);
    });
  }

  // clear terminal screen
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
}
