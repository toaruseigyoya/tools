const fs = require('fs');

function scriptsOf(html) {
  const scripts = [];
  const re = /<script>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = re.exec(html))) scripts.push(match[1]);
  return scripts;
}

const data = JSON.parse(fs.readFileSync('research-cycle-tools.json', 'utf8'));
const dirs = fs.readdirSync('.').filter((name) => /^research-\d{2}-\d{3}$/.test(name));
const index = fs.readFileSync('index.html', 'utf8');
const cards = index.split('class="tool-card"').length - 1;
const bad = [];

for (const dir of dirs) {
  const html = fs.readFileSync(`${dir}/index.html`, 'utf8');
  try {
    for (const script of scriptsOf(html)) new Function(script);
  } catch (error) {
    bad.push(`${dir}: ${error.message}`);
  }
}

console.log(`cycles=${data.cycles.length}`);
console.log(`added=${data.added}`);
console.log(`dirs=${dirs.length}`);
console.log(`indexCards=${cards}`);

if (data.added !== dirs.length) bad.push(`added count mismatch: ${data.added} !== ${dirs.length}`);
if (data.cycles.length !== 10) bad.push(`cycle count mismatch: ${data.cycles.length}`);
if (bad.length) {
  console.log(bad.join('\n'));
  process.exit(1);
}
