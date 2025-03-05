import { openSync, writeFile, existsSync, mkdirSync } from "fs";
import path from "path";

class Logger {
  #filePath: string | null = null;
  #fileDescriptor: number | null = null;
  constructor(logFilePath: string) {
    // Ensure the logs directory exists
    if (!existsSync(path.dirname(logFilePath))) {
      mkdirSync(path.dirname(logFilePath), { recursive: true });
    }
    this.#filePath = logFilePath;
    this.#fileDescriptor = openSync(this.#filePath, "a+");
  }

  /**
   * Function to output the logs on the file output.log.txt
   * @param data
   */
  public print(data: string) {
    if (this.#fileDescriptor === null) {
      return;
    }
    writeFile(this.#fileDescriptor, data, () => {});
  }
}

export const logger = new Logger(
  path.join(__dirname, "../../logs", "output.log.txt"),
);
