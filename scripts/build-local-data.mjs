import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const dailyDir = path.join(rootDir, "daily");
const indexPath = path.join(dailyDir, "index.json");
const outputPath = path.join(rootDir, "daily-data.js");

const index = readJson(indexPath);
const dates = unique([...(index.dates || []), ...(index.previewDates || [])]);
const entries = {};

for (const date of dates) {
  const entryPath = path.join(dailyDir, `${date}.json`);
  if (!fs.existsSync(entryPath)) continue;
  entries[date] = readJson(entryPath);
}

const payload = {
  index,
  entries,
};

const source = `window.GOGYO_DAILY_DATA = ${JSON.stringify(payload)};\n`;
fs.writeFileSync(outputPath, source);
console.log(`Built daily-data.js with ${Object.keys(entries).length} daily entries.`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}
