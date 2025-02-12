import readLine, { createInterface, Key } from "node:readline";
import fs from "node:fs";
import { ReadStream, WriteStream } from "node:tty";
import { KeyBoardKey, NavigationKeys } from "./constants/keyboard";
import { printOnFile } from "./utils/printOnFile";

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

    // Handle space key press
    if (key.name === "space") {
      const line = this.buffer[this.cursorPosition.row] ?? "";
      const windowColumnSize = this.writeStream!.getWindowSize()[0];

      if (line.length < windowColumnSize) {
        this.buffer[this.cursorPosition.row] =
          line.slice(0, this.cursorPosition.column) +
          " " +
          line.slice(this.cursorPosition.column);

        this.cursorPosition.column += 1;
        this.refreshScreen();
      }
    }

    // handle cursor position handling
    if (!!key?.name && NavigationKeys.includes(key?.name)) {
      this.handleCursorNavigation(key?.name as KeyBoardKey);
    }

    if (
      !!key?.sequence &&
      !!key.name &&
      ![
        KeyBoardKey.RETURN,
        KeyBoardKey.SPACE,
        KeyBoardKey.BACKSPACE,
        KeyBoardKey.TAB,
      ].includes(key.name as KeyBoardKey) &&
      !NavigationKeys.includes(key.name) &&
      this.windowSize[0] > this.buffer[this.cursorPosition.row].length
    ) {
      this.handleCharacterInput(key);
    }

    // handle TAB key
    if (this.windowSize[0] > this.buffer[this.cursorPosition.row].length) {
      if (!!key?.name && key.name === KeyBoardKey.TAB) {
        this.handleTabKey();
      }
    }

    printOnFile(`${JSON.stringify(this.cursorPosition)}`);
  }

  handleTabKey() {
    const tabSize = 2;
    const currentLine = this.buffer[this.cursorPosition.row];

    const newLine =
      currentLine.slice(0, this.cursorPosition.column) +
      " ".repeat(tabSize) +
      currentLine.slice(this.cursorPosition.column);

    // Update the buffer with the new line
    this.buffer[this.cursorPosition.row] = newLine;
    this.cursorPosition.column += tabSize;

    // Redraw the current line
    this.writeStream?.cursorTo(0, this.cursorPosition.row);
    this.writeStream?.clearLine(1);
    this.writeStream?.write(newLine);

    // Move the cursor to the new position
    this.writeStream?.cursorTo(
      this.cursorPosition.column,
      this.cursorPosition.row,
    );
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

  /**
   * Handles the input of a single character in the text editor.
   * This method is responsible for inserting a character into the current row of the text buffer
   * at the cursor's position, moving the cursor forward, and re-displaying the updated buffer on the screen.
   */
  async handleCharacterInput(key: Key) {
    const currentRow = this.buffer[this.cursorPosition.row];

    if (currentRow) {
      // Insert the character at the cursor position in the row
      this.buffer[this.cursorPosition.row] =
        currentRow.slice(0, this.cursorPosition.column) +
        key.sequence +
        currentRow.slice(this.cursorPosition.column);

      // Move the cursor forward after the inserted character
      this.cursorPosition.column += 1;

      // Re-display the buffer with the new content
      this.clearScreen(this.writeStream);
      // sending the row and colum for giving the right position of cursor for the next time
      this.display(this.cursorPosition.row, this.cursorPosition.column);
    }
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
