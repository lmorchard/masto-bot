import fs from "fs/promises";

export const readTextFile = async (name) =>
  fs.readFile(name, { encoding: "utf8" });

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const loadTextLines = async (name) =>
  (await readTextFile(name))
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => !!line)
    .filter((line) => line.substr(0, 1) !== "#");
