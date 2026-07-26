import fs from 'fs';
const data = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
data.scripts.dev = "tsx server.ts";
data.scripts.build = "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs";
data.scripts.start = "node dist/server.cjs";
fs.writeFileSync('package.json', JSON.stringify(data, null, 2));
console.log("Patched package.json");
