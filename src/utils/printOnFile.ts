import { openSync, writeFile } from "fs";

const fileHandler = openSync("output.txt", "r+");
export const printOnFile = (data: string) => {
  writeFile(fileHandler, data, () => {});
};
