import { writeFile } from "fs";

export const printOnFile = (data: string) => {
  writeFile("output.txt", data, { flag: "r+" }, () => {});
};
