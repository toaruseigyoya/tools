const fs = require('fs');

function scriptsOf(html) {
  const scripts = [];
  const re = /<script>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = re.exec(html))) scripts.push(match[1]);
  return scripts;
}

const indexHtml = fs.readFileSync('index.html', 'utf8');
const cardCount = indexHtml.split('class="tool-card"').length - 1;
console.log(`indexCards=${cardCount}`);
console.log(`hasTool002=${indexHtml.includes('./tool-002/')}`);
console.log(`hasToolIdeasCard=${indexHtml.includes('./tool-ideas/')}`);
for (const script of scriptsOf(indexHtml)) new Function(script);

const dirs = fs.readdirSync('.').filter((name) => /^tool-\d{3}$/.test(name));
const bad = [];
for (const dir of dirs) {
  const html = fs.readFileSync(`${dir}/index.html`, 'utf8');
  try {
    for (const script of scriptsOf(html)) new Function(script);
  } catch (error) {
    bad.push(`${dir}: ${error.message}`);
  }
}

console.log(`generatedPages=${dirs.length}`);
if (bad.length) {
  console.log(bad.slice(0, 20).join('\n'));
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync('tool-ideas/ideas.json', 'utf8'));
console.log(`ideas=${data.ideas.length}`);
console.log(`omitted=${data.omitted.length}`);
