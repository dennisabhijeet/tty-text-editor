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
  windowSize: number[] = [];

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

    this.readStream.on("keypress", (str, key) =>
      this.handleKeyEvents(str, key),
    );
  }

  display(row: number = 0, column: number = 0) {
    this.writeStream?.write(this.buffer.join("\n"));
    this.writeStream?.cursorTo(column, row);
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

    if (
      !!key?.sequence &&
      !!key.name &&
      !["return", "space", "backspace", "tab"].includes(key.name) &&
      !NavigationKeys.includes(key.name) &&
      this.windowSize[0] > this.buffer[this.cursorPosition.row].length
    ) {
      this.handleCharacterInput(key);
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
          this.buffer?.[this.cursorPosition.row]?.[this.cursorPosition.column]
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

  //Handles the input of a single character in the text editor.
  //This method is responsible for inserting a character into the current row of the text buffer at the cursor's position, moving the cursor forward, and redisplaying the updated buffer on the screen.
  async handleCharacterInput(key: Key) {
    const currentRow = this.buffer[this.cursorPosition.row];

    if (currentRow) {
      //Insert the character at the cursor position in the row
      this.buffer[this.cursorPosition.row] =
        currentRow.slice(0, this.cursorPosition.column) +
        key.sequence +
        currentRow.slice(this.cursorPosition.column);

      // // Move the cursor forward after the inserted character
      this.cursorPosition.column += 1;

      //Redisplay the buffer with the new content
      this.clearScreen(this.writeStream);
      //sending the row and colum for giving the right position of cursor for the next time
      this.display(this.cursorPosition.row, this.cursorPosition.column);
    }
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
