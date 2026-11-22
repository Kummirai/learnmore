import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(dirname, "../../mobile_app/dist");
const destination = path.resolve(dirname, "../public/app");

if (!fs.existsSync(source)) {
  throw new Error(`Missing web export: ${source}`);
}

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.cpSync(source, destination, { recursive: true });

console.log(`Copied ${source} -> ${destination}`);
