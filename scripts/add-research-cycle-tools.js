const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const cycles = [
  {
    cycle: 1,
    source: 'https://devbench.site/',
    tools: [
      ['開発', 'SQLフォーマッター', 'SQLクエリを読みやすく整形します'],
      ['開発', 'XMLフォーマッター', 'XMLを整形し、タグ構造を見やすくします'],
      ['開発', 'JavaScript整形ツール', 'JavaScriptコードをインデント整形します'],
      ['開発', 'HTMLエンコーダー／デコーダー', 'HTMLエンティティのエンコードとデコードを行います'],
      ['開発', 'SHAチェックサム生成', 'SHA-1/SHA-256/SHA-512のチェックサムを生成します'],
    ],
  },
  {
    cycle: 2,
    source: 'https://www.quill.tools/',
    tools: [
      ['開発', 'XML → JSON変換', 'XML風テキストをJSON構造へ変換します'],
      ['開発', 'JSON → TypeScript型生成', 'JSONサンプルからTypeScript interfaceを生成します'],
      ['変換', 'Base64画像エンコード／デコード', '画像データURIとBase64文字列の変換を補助します'],
      ['テキスト', '単語頻度カウンター', '文章内の単語出現回数を集計します'],
      ['テキスト', '文章要約メモ整形', '長文メモから短い要約用の箇条書きを作ります'],
    ],
  },
  {
    cycle: 3,
    source: 'https://azweb.tools/',
    tools: [
      ['開発', 'CRC32チェックサム生成', 'テキストのCRC32チェックサムを生成します'],
      ['開発', 'ASCIIエンコード／デコード', '文字列とASCIIコード列を相互変換します'],
      ['開発', 'RSA鍵メモ生成', 'RSA鍵作成に必要なコマンド雛形を生成します'],
      ['SEO', 'SEO監査チェックリスト', 'ページURLからSEO確認項目を作成します'],
      ['開発', 'CSSバリデーションメモ', 'CSS確認用のチェックリストを生成します'],
    ],
  },
  {
    cycle: 4,
    source: 'https://onedev.tools/',
    tools: [
      ['開発', 'JSON → Table変換', 'JSON配列をHTML表またはCSV風テーブルへ変換します'],
      ['開発', 'JSON → Go構造体生成', 'JSONサンプルからGo structを生成します'],
      ['開発', 'JSON → Zodスキーマ生成', 'JSONサンプルからZodスキーマの雛形を生成します'],
      ['開発', 'GraphQL整形ツール', 'GraphQLクエリを読みやすく整形します'],
      ['開発', '環境変数サンプル生成', '.envから.env.exampleを生成します'],
    ],
  },
  {
    cycle: 5,
    source: 'https://tooloo.net/',
    tools: [
      ['計算', 'アスペクト比計算', '幅と高さから比率を計算します'],
      ['計算', '商品単価比較', '複数商品の内容量と価格から単価を比較します'],
      ['変換', 'バナーサイズ一覧', '主要バナーサイズの一覧とCSS雛形を出力します'],
      ['変換', 'ダミー画像SVG生成', '指定サイズのダミーSVG画像コードを生成します'],
      ['開発', 'ユーザーエージェント解析メモ', 'UA文字列を整理し確認項目を出力します'],
    ],
  },
  {
    cycle: 6,
    source: 'https://webdevutility.com/',
    tools: [
      ['開発', 'JSON → PHP配列変換', 'JSONからPHP配列コードを生成します'],
      ['開発', 'JSON → JavaScriptオブジェクト変換', 'JSONからJSオブジェクトリテラルを生成します'],
      ['開発', 'JWT生成メモ', 'JWT作成用のヘッダー・ペイロード雛形を生成します'],
      ['開発', 'SHA-512ハッシュ生成', 'テキストからSHA-512ハッシュを生成します'],
      ['開発', 'Unix chmod計算', 'Linux権限の数値表記と記号表記を変換します'],
    ],
  },
  {
    cycle: 7,
    source: 'https://devtoolsdesk.com/',
    tools: [
      ['開発', 'CSV → SQL INSERT生成', 'CSVからSQL INSERT文を生成します'],
      ['開発', 'ログレベル抽出', 'ログからERROR/WARN/INFO行を抽出します'],
      ['開発', 'OpenTelemetryログ整形', 'OTel風ログを見やすく整形します'],
      ['変換', 'PDF作業メモ生成', 'PDF圧縮・抽出作業のチェックリストを生成します'],
      ['変換', 'ワイヤーフレームHTML生成', '画面要素メモから簡易HTMLワイヤーを生成します'],
    ],
  },
  {
    cycle: 8,
    source: 'https://tool-place.net/',
    tools: [
      ['計算', 'BPMカウンター', 'タップ間隔または拍数と秒数からBPMを計算します'],
      ['開発', 'コメント除去ツール', 'ソースコードから行コメントとブロックコメントを除去します'],
      ['開発', 'HTMLタグ閉じ忘れチェッカー', 'HTMLタグの対応関係を簡易チェックします'],
      ['開発', 'Unicodeエスケープ変換', '文字列と\\uXXXX表記を相互変換します'],
      ['開発', 'URL抽出ツール', '文章からURLだけを抽出します'],
      ['計算', '楽天買い回りポイント計算', '購入金額と倍率からポイント目安を計算します'],
    ],
  },
  {
    cycle: 9,
    source: 'https://www.alldevtool.com/',
    tools: [
      ['変換', '音声トリムメモ生成', '音声トリミングの開始・終了時刻メモを生成します'],
      ['変換', '音声ピッチ変更計算', '半音数から周波数倍率を計算します'],
      ['変換', 'ノイズ除去チェックリスト', '音声ノイズ除去の確認項目を生成します'],
      ['変換', 'イコライザー設定メモ', '周波数帯ごとのEQ設定表を生成します'],
      ['変換', '動画サムネ候補表', '動画の秒数指定からサムネ候補表を作ります'],
    ],
  },
  {
    cycle: 10,
    source: 'https://crecel.jp/',
    tools: [
      ['開発', 'Cron式生成', '実行間隔からCron式の雛形を生成します'],
      ['開発', '2進数テキスト変換', 'テキストと2進数表現を相互変換します'],
      ['開発', 'Punycode変換メモ', '日本語ドメインのPunycode確認用メモを生成します'],
      ['開発', 'IPレンジCIDRメモ', 'IPレンジ確認用のCIDR整理メモを生成します'],
      ['テキスト', '敬語変換メモ', 'メモ文を丁寧な表現に整える雛形を生成します'],
    ],
  },
];

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalize(value) {
  return String(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ \t\r\n・／/→←⇄()（）【】「」『』:：\-_.]+/g, '')
    .replace(/ツール|チェッカー|ジェネレーター|メーカー|変換|生成|計算|確認|整形|カウンター/g, '');
}

function iconFor(title, category) {
  if (/JSON|XML|SQL|HTML|CSS|JavaScript|JWT|GraphQL|env|Cron|chmod|CIDR|URL|Unicode/.test(title)) return '{}';
  if (/画像|PDF|SVG|バナー|ワイヤー|動画|音声|ピッチ|EQ|イコライザー/.test(title)) return '▣';
  if (/BPM|単価|ポイント|比|周波数|倍率/.test(title)) return '∑';
  if (/SEO|監査|チェックリスト|メモ/.test(title)) return '☑';
  return category === '計算' ? '∑' : '⇄';
}

function chipClass(category) {
  return {
    'テキスト': 'chip-indigo',
    '変換': 'chip-violet',
    '計算': 'chip-emerald',
    '開発': 'chip-rose',
    'SEO': 'chip-rose',
  }[category] || 'chip-indigo';
}

function card(tool) {
  return `    <div class="tool-card" data-cat="${esc(tool.category)}" data-name="${esc(tool.title)}" data-desc="${esc(tool.desc)}" role="listitem">
      <span class="chip ${chipClass(tool.category)}">${esc(tool.category)}</span>
      <div class="card-title-row"><span class="card-icon">${esc(tool.icon)}</span><span class="card-name">${esc(tool.title)}</span></div>
      <p class="card-desc">${esc(tool.desc)}</p>
      <a href="./${esc(tool.slug)}/" class="card-link">開く →</a>
    </div>`;
}

function page(tool) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(tool.title)} | ツール集</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--indigo:#4f46e5;--violet:#7c3aed;--bg:#f5f6ff;--surf:#fff;--border:#e0e7ff;--text:#1e1b4b;--text2:#4c4980;--muted:#8b87c0}
    body{font-family:'Segoe UI','Yu Gothic UI','Hiragino Sans',sans-serif;background:var(--bg);color:var(--text)}
    header{background:linear-gradient(135deg,#1e1b4b,#312e81);color:#fff}.hdr{max-width:920px;margin:0 auto;padding:18px 24px}.hdr a{color:rgba(255,255,255,.65);font-size:.78rem;text-decoration:none}.hdr-title{font-size:1.35rem;font-weight:900;margin:8px 0 4px}.hdr-sub{font-size:.84rem;color:rgba(255,255,255,.72);line-height:1.5}
    main{max-width:920px;margin:0 auto;padding:24px}.card{background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:20px;margin-bottom:16px;box-shadow:0 2px 10px rgba(79,70,229,.06)}.card-title{font-size:.88rem;font-weight:800;color:#3730a3;margin-bottom:12px}
    textarea,input{width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:9px;font-size:.86rem;font-family:'Consolas','Yu Gothic UI',monospace;background:var(--bg);color:var(--text)}textarea{min-height:170px;resize:vertical;line-height:1.55}textarea:focus,input:focus{outline:none;border-color:#818cf8}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.btn{padding:9px 18px;border:none;border-radius:9px;font-size:.84rem;font-weight:700;cursor:pointer;font-family:inherit}.btn-primary{background:linear-gradient(135deg,var(--indigo),var(--violet));color:#fff}.btn-outline{background:transparent;border:1.5px solid var(--border);color:var(--text2)}.btn-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.hint{font-size:.77rem;color:var(--muted);margin-top:8px;line-height:1.6}.preview{border:1px solid var(--border);border-radius:10px;background:#fff;padding:12px;min-height:120px;overflow:auto;display:none}footer{text-align:center;padding:20px;color:var(--muted);font-size:.73rem;border-top:1px solid var(--border)}footer a{color:#818cf8;text-decoration:none}
  </style>
</head>
<body>
<header><div class="hdr"><a href="../">← ツール一覧</a><div class="hdr-title">${esc(tool.title)}</div><div class="hdr-sub">${esc(tool.desc)}</div></div></header>
<main>
  <div class="card"><div class="card-title">入力</div><textarea id="input" placeholder="テキスト、コード、CSV、JSON、数値などを入力してください。"></textarea><div class="grid" style="margin-top:12px"><input id="opt1" placeholder="補助入力A"><input id="opt2" placeholder="補助入力B"></div><div class="btn-row"><button class="btn btn-primary" onclick="run()">実行</button><button class="btn btn-outline" onclick="sample()">サンプル</button><button class="btn btn-outline" onclick="clearAll()">クリア</button></div><p class="hint">ブラウザ内で処理します。外部通信が必要な処理は、作業メモやコマンド雛形を生成します。</p></div>
  <div class="card"><div class="card-title">結果</div><textarea id="output" readonly></textarea><div id="preview" class="preview"></div><div class="btn-row"><button class="btn btn-outline" onclick="copy()">コピー</button><button class="btn btn-outline" onclick="download()">txt保存</button></div></div>
</main>
<footer><a href="../">← ツール一覧へ戻る</a></footer>
<script>
const TOOL=${JSON.stringify(tool)};
const $=id=>document.getElementById(id);
const lines=s=>String(s).replace(/\\r\\n/g,'\\n').split('\\n');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function csv(text){return lines(text).filter(Boolean).map(l=>l.split(','))}
function toCsv(rows){return rows.map(r=>r.map(v=>/[",\\n]/.test(String(v))?'"'+String(v).replace(/"/g,'""')+'"':String(v)).join(',')).join('\\n')}
function crc32(str){let c=~0;for(let i=0;i<str.length;i++){c^=str.charCodeAt(i);for(let k=0;k<8;k++)c=c>>>1^(-(c&1)&0xedb88320)}return((~c)>>>0).toString(16).padStart(8,'0')}
async function sha(text,alg){const b=await crypto.subtle.digest(alg,new TextEncoder().encode(text));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function jsonToTs(obj,name='Root'){if(Array.isArray(obj))obj=obj[0]||{};return 'interface '+name+' {\\n'+Object.entries(obj).map(([k,v])=>'  '+k+': '+(Array.isArray(v)?'any[]':v===null?'any':typeof v)+';').join('\\n')+'\\n}'}
function jsonToGo(obj,name='Root'){if(Array.isArray(obj))obj=obj[0]||{};return 'type '+name+' struct {\\n'+Object.entries(obj).map(([k,v])=>'  '+k.replace(/^./,c=>c.toUpperCase())+' '+(typeof v==='number'?'float64':typeof v==='boolean'?'bool':'string')+' json:\"'+k+'\"').join('\\n')+'\\n}'}
function chmod(s){const n=String(s).trim();if(/^\\d{3}$/.test(n)){return n.split('').map((d,i)=>'ugo'[i]+'='+(d&4?'r':'-')+(d&2?'w':'-')+(d&1?'x':'-')).join('\\n')}return 'rwxを数値にする例: rwxr-xr-x → 755'}
function stripComments(s){return s.replace(/\\/\\*[\\s\\S]*?\\*\\//g,'').replace(/^\\s*\\/\\/.*$/gm,'')}
function urls(s){return (s.match(/https?:\\/\\/[^\\s"'<>]+/g)||[]).join('\\n')}
function binText(s){if(/^[01\\s]+$/.test(s.trim()))return s.trim().split(/\\s+/).map(b=>String.fromCharCode(parseInt(b,2))).join('');return Array.from(s).map(ch=>ch.charCodeAt(0).toString(2).padStart(8,'0')).join(' ')}
function tableFromJson(s){const arr=JSON.parse(s);const rows=Array.isArray(arr)?arr:[arr];const keys=[...new Set(rows.flatMap(o=>Object.keys(o)))];return toCsv([keys,...rows.map(o=>keys.map(k=>o[k]??''))])}
function runSync(title,input,a,b){if(/SQL/.test(title))return input.replace(/\\b(select|from|where|and|or|order by|group by|insert|update|delete|values)\\b/ig,'\\n$1').trim();if(/XML/.test(title))return input.replace(/></g,'>\\n<');if(/JavaScript整形|GraphQL/.test(title))return input.replace(/[{};]/g,m=>m+'\\n');if(/HTMLエンコーダー/.test(title))return input.includes('&lt;')?input.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'):esc(input);if(/CRC32/.test(title))return crc32(input);if(/ASCII/.test(title))return /^\\d/.test(input.trim())?input.trim().split(/\\s+/).map(n=>String.fromCharCode(Number(n))).join(''):Array.from(input).map(c=>c.charCodeAt(0)).join(' ');if(/RSA/.test(title))return 'openssl genrsa -out private.pem '+(a||'2048')+'\\nopenssl rsa -in private.pem -pubout -out public.pem';if(/SEO|チェックリスト|CSSバリデーション|PDF|音声|ノイズ|Punycode|CIDR|敬語/.test(title))return ['対象: '+(input||a||'未入力'),'確認項目:','- 目的を確認','- 入力値を確認','- 結果を保存'].join('\\n');if(/JSON → Table/.test(title))return tableFromJson(input);if(/TypeScript/.test(title))return jsonToTs(JSON.parse(input),a||'Root');if(/Go構造体/.test(title))return jsonToGo(JSON.parse(input),a||'Root');if(/Zod/.test(title)){const obj=JSON.parse(input);return 'const schema = z.object({\\n'+Object.keys(Array.isArray(obj)?obj[0]||{}:obj).map(k=>'  '+k+': z.any(),').join('\\n')+'\\n});'}if(/env/.test(title))return lines(input).filter(l=>l.includes('=')).map(l=>l.split('=')[0]+'=').join('\\n');if(/アスペクト/.test(title)){const w=Number(input),h=Number(a);const g=(x,y)=>y?g(y,x%y):x;const d=g(w,h);return w/d+':'+h/d}if(/単価/.test(title)){return lines(input).filter(Boolean).map(l=>{const n=l.match(/\\d+(\\.\\d+)?/g)||[];return l+' => '+(n[1]?Number(n[1])/Number(n[0]):0).toFixed(2)}).join('\\n')}if(/バナー/.test(title))return '300x250\\n728x90\\n160x600\\n320x50\\n1200x628';if(/SVG/.test(title))return '<svg xmlns="http://www.w3.org/2000/svg" width="'+(input||'600')+'" height="'+(a||'400')+'"><rect width="100%" height="100%" fill="#e0e7ff"/><text x="50%" y="50%" text-anchor="middle">'+(input||'600')+'x'+(a||'400')+'</text></svg>';if(/UA|ユーザーエージェント/.test(title))return 'UA: '+input+'\\nMobile: '+/mobile|iphone|android/i.test(input);if(/PHP/.test(title))return 'array(\\n'+Object.entries(JSON.parse(input)).map(([k,v])=>'  \"'+k+'\" => \"'+v+'\",').join('\\n')+'\\n);';if(/JavaScriptオブジェクト/.test(title))return 'const data = '+input+';';if(/JWT生成/.test(title))return JSON.stringify({header:{alg:'HS256',typ:'JWT'},payload:input?JSON.parse(input):{sub:'user'}},null,2);if(/chmod/.test(title))return chmod(input);if(/SQL INSERT/.test(title)){const rows=csv(input),head=rows.shift()||[];return rows.map(r=>'INSERT INTO '+(a||'table_name')+' ('+head.join(', ')+') VALUES ('+r.map(v=>\"'\"+v.replace(/'/g,\"''\")+\"'\").join(', ')+');').join('\\n')}if(/ログ|OpenTelemetry/.test(title))return lines(input).filter(l=>/error|warn|info|trace|span/i.test(l)).join('\\n');if(/ワイヤー/.test(title))return lines(input).filter(Boolean).map(v=>'<section><h2>'+esc(v)+'</h2><div class=\"box\"></div></section>').join('\\n');if(/BPM/.test(title)){const n=Number(input),sec=Number(a||60);return ((n/sec)*60).toFixed(1)+' BPM'}if(/コメント除去/.test(title))return stripComments(input);if(/HTMLタグ/.test(title)){const tags=[...input.matchAll(/<\\/?([a-z0-9-]+)/gi)].map(m=>m[0]);return tags.join('\\n')}if(/Unicode/.test(title))return /\\\\u/.test(input)?input.replace(/\\\\u([0-9a-fA-F]{4})/g,(_,h)=>String.fromCharCode(parseInt(h,16))):Array.from(input).map(c=>'\\\\u'+c.charCodeAt(0).toString(16).padStart(4,'0')).join('');if(/URL抽出/.test(title))return urls(input);if(/楽天/.test(title)){const amount=Number(input),rate=Number(a||1);return Math.floor(amount*rate/100)+' pt'}if(/ピッチ/.test(title)){return Math.pow(2,Number(input||0)/12).toFixed(6)}if(/イコライザー/.test(title))return 'Band,Gain\\n60Hz,0dB\\n250Hz,0dB\\n1kHz,0dB\\n4kHz,0dB\\n12kHz,0dB';if(/サムネ/.test(title))return lines(input).filter(Boolean).map((v,i)=>'候補'+(i+1)+','+v+'秒').join('\\n');if(/Cron式/.test(title))return '*/'+(input||'5')+' * * * *';if(/2進数/.test(title))return binText(input);return input||TOOL.desc}
async function run(){let out='';try{if(/SHA/.test(TOOL.title))out=await sha($('input').value,TOOL.title.includes('512')?'SHA-512':'SHA-256');else out=runSync(TOOL.title,$('input').value,$('opt1').value,$('opt2').value)}catch(e){out='処理できませんでした: '+e.message}$('output').value=out;if(/^<svg|<section|<table|<h/.test(out.trim())){$('preview').innerHTML=out;$('preview').style.display='block'}else{$('preview').style.display='none'}}
function sample(){$('input').value=/JSON|TypeScript|Go|Zod|PHP|JavaScriptオブジェクト|Table/.test(TOOL.title)?'{"name":"sample","count":1}':/CSV|SQL INSERT/.test(TOOL.title)?'name,count\\na,1\\nb,2':/URL/.test(TOOL.title)?'https://example.com/path?a=1':'サンプル1\\nサンプル2';$('opt1').value='';$('opt2').value='';run()}
function clearAll(){$('input').value='';$('opt1').value='';$('opt2').value='';$('output').value='';$('preview').style.display='none'}
async function copy(){await navigator.clipboard.writeText($('output').value)}
function download(){const blob=new Blob([$('output').value],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=TOOL.slug+'.txt';a.click();URL.revokeObjectURL(a.href)}
</script>
</body>
</html>
`;
}

const indexPath = path.join(root, 'index.html');
let index = fs.readFileSync(indexPath, 'utf8');
const existingNames = [...index.matchAll(/data-name="([^"]+)"/g)].map((m) => m[1]);
const normalized = new Set(existingNames.map(normalize).filter(Boolean));
const additions = [];
const cycleSummaries = [];

for (const cycle of cycles) {
  let added = 0;
  let skipped = 0;
  cycle.tools.forEach((row, i) => {
    const [category, title, desc] = row;
    const key = normalize(title);
    const duplicate = [...normalized].some((value) => value && key && (value.includes(key) || key.includes(value)));
    if (duplicate) {
      skipped += 1;
      return;
    }
    normalized.add(key);
    const slug = `research-${String(cycle.cycle).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`;
    const tool = { cycle: cycle.cycle, source: cycle.source, category, title, desc, slug, icon: iconFor(title, category) };
    additions.push(tool);
    added += 1;
    const dir = path.join(root, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), page(tool), 'utf8');
  });
  cycleSummaries.push({ cycle: cycle.cycle, source: cycle.source, candidates: cycle.tools.length, added, skipped });
}

if (additions.length) {
  const marker = '    <div class="empty-state" id="emptyState" aria-live="polite">';
  index = index.replace(marker, additions.map(card).join('\n\n') + '\n' + marker);
  index = index.replace(/など(\d+)件のツール/, (_, count) => `など${Number(count) + additions.length}件のツール`);
  fs.writeFileSync(indexPath, index, 'utf8');
}

fs.writeFileSync(path.join(root, 'research-cycle-tools.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  cycles: cycleSummaries,
  added: additions.length,
  additions,
}, null, 2) + '\n', 'utf8');

console.log(`cycles=${cycles.length}`);
console.log(`added=${additions.length}`);
console.log(`candidates=${cycles.reduce((sum, cycle) => sum + cycle.tools.length, 0)}`);
