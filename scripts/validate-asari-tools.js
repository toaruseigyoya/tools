const fs = require('fs');

function scriptsOf(html) {
  const scripts = [];
  const re = /<script>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = re.exec(html))) scripts.push(match[1]);
  return scripts;
}

const data = JSON.parse(fs.readFileSync('asari-tools.json', 'utf8'));
const dirs = fs.readdirSync('.').filter((name) => /^asari-\d{3}$/.test(name));
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

console.log(`source=${data.sourceTotal}`);
console.log(`added=${data.added}`);
console.log(`skipped=${data.skippedAsExisting}`);
console.log(`dirs=${dirs.length}`);
console.log(`indexCards=${cards}`);

if (data.added !== dirs.length) bad.push(`added count mismatch: ${data.added} !== ${dirs.length}`);
if (bad.length) {
  console.log(bad.join('\n'));
  process.exit(1);
}
