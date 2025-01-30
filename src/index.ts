import readLine from "node:readline";
import fs, { writeFile } from "node:fs";

let buffer: string[] = [];
// let slidingWindow: string[] = [];

function inputHandling() {
  const readStream = process.stdin;
  const writeStream = process.stdout;
  readStream.setEncoding("utf-8");
  readLine.emitKeypressEvents(readStream);
  readStream.setRawMode(true);

  const filePath = process.argv[2] || "file.txt";

  const windowSize = writeStream.getWindowSize();

  const fileHandler = fs.openSync("terminal.txt", "w");

  if (fs.existsSync(filePath)) {
    let fileReadStream = fs.createReadStream(filePath, { encoding: "utf-8" });
    fileReadStream.on("data", (chunk: string) => {
      if (chunk.includes("\n")) {
        const lines = chunk.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (i > windowSize[1] - 1) {
            fileReadStream.close();
            break;
          }
          buffer[i] = lines[i] + " ";
        }
      } else {
        console.log("hit!!!!");
        buffer[0] = chunk;
      }
    });

    fileReadStream.on("end", () => {});

    fileReadStream.on("error", (err) => {});

    fileReadStream.on("close", () => {
      buffer = buffer.slice(0, windowSize[1]);
      writeStream.write(buffer.join("\n"));
      writeStream.cursorTo(0, 0);
    });
  }

  let cursorPosition = { row: 0, column: 0 };
  let screenMaxRows = windowSize[1];
  let screenMaxColumns = windowSize[0];
  let screenStartRow = 0;
  let screenEndRow = screenMaxRows;
  let reservedRows = 1; // reserved rows for row column info

  writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
  writeStream.clearScreenDown();

  readStream.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") {
      writeStream.cursorTo(0, 0);
      writeStream.clearScreenDown();
      process.exit(0);
    }

    if (
      !!str &&
      key.name !== "return" &&
      key.name !== "space" &&
      key.name !== "backspace"
    ) {
      const charArray = buffer[cursorPosition.row].split("");
      charArray.splice(cursorPosition.column, 0, str);
      buffer[cursorPosition.row] = charArray.join("");

      writeStream.cursorTo(0, 0);
      writeStream.clearScreenDown();

      writeStream.write(buffer.join("\n"));
      cursorPosition.column += 1;
      writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
    }
    if (key.name === "return") {
      cursorPosition.column = 0;
      cursorPosition.row += 1;
      buffer.splice(cursorPosition.row, 0, " ");

      writeStream.cursorTo(0, 0);
      writeStream.clearScreenDown();
      writeStream.write(buffer.join("\n"));
      writeFile("terminal.txt", buffer.join("\n"), (err) => {});
      writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
    }

    if (key.name === "space") {
      if (
        screenMaxRows > cursorPosition.row &&
        screenMaxColumns > cursorPosition.column + 1
      ) {
        const newContent = buffer[cursorPosition.row].split("");
        newContent.splice(cursorPosition.column, 0, " ");
        buffer[cursorPosition.row] = newContent.join("");
        writeStream.cursorTo(0, 0);
        writeStream.clearScreenDown();
        writeStream.write(buffer.join("\n"));
        cursorPosition.column += 1;
        writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
      }
    }

    if (key.name === "backspace") {
      if (
        buffer?.[cursorPosition.row]?.length > 0 &&
        cursorPosition.column > 0
      ) {
        const newContent = buffer[cursorPosition.row].split("");
        cursorPosition.column -= 1;
        newContent.splice(cursorPosition.column, 1);
        buffer[cursorPosition.row] = newContent.join("");
        writeStream.cursorTo(0, 0);
        writeStream.clearScreenDown();
        writeStream.write(buffer.join("\n"));
        writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
      } else {
        if (cursorPosition.row - 1 >= 0) {
          cursorPosition.row -= 1;
          cursorPosition.column = buffer[cursorPosition.row].length - 1;
          writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
        }
      }
    }

    // handle cursor position handling
    switch (key.name) {
      case "up":
        if (buffer?.[cursorPosition.row - 1]) {
          screenEndRow = screenMaxRows;
          screenStartRow = 0;
          if (
            buffer?.[cursorPosition.row - 1].length >= cursorPosition.column
          ) {
            cursorPosition.row -= 1;
            writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
          } else {
            cursorPosition.row -= 1;
            cursorPosition.column = buffer[cursorPosition.row].length - 1;
            writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
          }
        }

        break;
      case "down":
        if (buffer?.[cursorPosition.row + 1]) {
          screenEndRow = screenMaxRows;
          screenStartRow = 0;
          if (
            buffer?.[cursorPosition.row + 1].length >= cursorPosition.column
          ) {
            cursorPosition.row += 1;
            writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
          } else {
            cursorPosition.row += 1;
            cursorPosition.column = buffer[cursorPosition.row].length - 1;
            writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
          }
        }

        break;
      case "left":
        if (
          buffer?.[cursorPosition.row] &&
          buffer?.[cursorPosition.row]?.[cursorPosition.column - 1]
        ) {
          cursorPosition.column -= 1;
          writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
        }
        break;
      case "right":
        if (
          buffer?.[cursorPosition.row] &&
          buffer?.[cursorPosition.row]?.[cursorPosition.column + 1]
        ) {
          cursorPosition.column += 1;
          writeStream.cursorTo(cursorPosition.column, cursorPosition.row);
        }
        break;
    }
  });
}

inputHandling();

function printOnFile(fileHandler: number, data: string) {
  writeFile(fileHandler, data, (err) => {});
}

// What done
// 1. Read file and display the content in the screen based on terminal size.
// 2. Basic input handling exit from program.
// 3. Cursor navigation in terminal through buffer.
// 4. Added enter support to add new line in buffer and display on screen.
// 5. Added backspace support to delete the char from buffer and display on screen.
// 6. Added space support to add space in buffer and display on screen.
// 7. Add add character in buffer and display on screen.

// What to do
// 1. Add Scroll support when buffer content is more than terminal size.
