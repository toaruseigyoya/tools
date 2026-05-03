const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'tool-ideas', 'ideas.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const existingTools = [
  ['テキスト', '文字数カウンター', 'テキストの文字数・行数・単語数・バイト数をリアルタイム計測', 'char-count', '🔤'],
  ['テキスト', '大文字・小文字変換', '英字テキストの大文字・小文字・先頭大文字を一括変換', 'case-convert', '🔠'],
  ['テキスト', '改行削除・変換', '改行の削除・変換・統一を一括処理', 'line-break', '↵'],
  ['テキスト', 'ひらがな⇔カタカナ変換', '日本語のひらがな・カタカナを相互変換', 'kana-convert', 'あ'],
  ['テキスト', 'テキスト差分比較', '2つのテキストの違いを行単位で比較・ハイライト表示', 'text-diff', '🆚'],
  ['テキスト', 'ダミーテキスト生成', 'Lorem Ipsum・日本語ダミー文章を段落数・文字数指定で生成', 'lorem-ipsum', '📄'],
  ['変換', 'Base64エンコード・デコード', 'テキストをBase64形式に変換・復号', 'base64', '🔐'],
  ['変換', 'URLエンコード・デコード', 'URLの特殊文字をパーセントエンコード・デコード', 'url-encode', '🔗'],
  ['変換', 'タイムスタンプ変換', 'Unixタイムスタンプと日時を相互変換', 'timestamp', '⏱'],
  ['変換', '進数変換', '2進数・8進数・10進数・16進数を相互変換', 'number-base', '🔢'],
  ['変換', 'カラーコード変換', 'HEX・RGB・HSLカラーコードを相互変換・プレビュー', 'color-convert', '🎨'],
  ['変換', 'HTMLエスケープ', 'HTMLの特殊文字をエスケープ・アンエスケープ変換', 'html-escape', '🏷'],
  ['変換', '単位変換', '長さ・重量・温度・面積・速度などの単位を一括変換', 'unit-convert', '📏'],
  ['変換', 'CSV・TSV変換', 'CSVとTSVを相互変換。引用符付きセルや改行入りセルにも対応', 'csv-tsv', '📊'],
  ['計算', '消費税計算', '税込・税抜価格の計算と消費税額の確認', 'tax-calc', '💴'],
  ['計算', 'BMI計算', '身長・体重からBMIと肥満度を計算', 'bmi', '⚖'],
  ['計算', '日数計算', '2つの日付の間の日数・週数・月数を計算', 'date-diff', '📅'],
  ['計算', 'ローン計算', '借入額・金利・返済期間から月額返済額と総返済額を計算', 'loan-calc', '🏠'],
  ['計算', '割り勘計算', '合計金額・人数・端数処理から割り勘金額を計算', 'split-bill', '🍽'],
  ['計算', '年齢計算', '生年月日から現在の年齢・次の誕生日までの日数を計算', 'age-calc', '🎂'],
  ['開発', 'JSONフォーマッター', 'JSONの整形・圧縮・バリデーション', 'json-format', '{}'],
  ['開発', 'パスワード生成', '安全なランダムパスワードを即時生成', 'password-gen', '🔑'],
  ['開発', 'UUID生成', 'UUID v4をワンクリックで生成・コピー', 'uuid-gen', '🆔'],
  ['開発', 'ハッシュ生成', 'テキストやファイルのSHA-256・SHA-1・SHA-512ハッシュ値を生成', 'hash-gen', '#️⃣'],
  ['開発', '正規表現テスター', '正規表現のマッチ確認・キャプチャグループの確認', 'regex-test', '🔎'],
];

const chipClass = {
  'テキスト': 'chip-indigo',
  '変換': 'chip-violet',
  '計算': 'chip-emerald',
  '開発': 'chip-rose',
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function cleanCategory(category) {
  return String(category || '汎用ツール').replace(/^#+\s*/, '').trim() || '汎用ツール';
}

function mapCategory(category) {
  const c = cleanCategory(category);
  if (/計算|数値|単位|日付|時間|Excel|表/.test(c)) return '計算';
  if (/変換|整形|文章|補助|文書|画像|色/.test(c)) return '変換';
  if (/開発|IT|JSON|CSV|URL|Base64|HTML|QR|正規/.test(c)) return '開発';
  return 'テキスト';
}

function iconFor(title, category) {
  if (/CSV|Excel|表|台帳|一覧/.test(title)) return '📊';
  if (/日付|曜日|期限|時間|履歴/.test(title)) return '📅';
  if (/文章|文|メール|Word|議事録|報告|謝罪|お礼/.test(title)) return '📝';
  if (/画像|色|カラー|QR/.test(title)) return '🖼';
  if (/計算|割合|合計|平均|最大|最小|税|金額|単位/.test(title)) return '🧮';
  if (/JSON|HTML|URL|Base64|IP|HTTP|正規|ハッシュ|UUID|パスワード/.test(title)) return '⌘';
  if (category === '変換') return '⇄';
  if (category === '計算') return '🧮';
  if (category === '開発') return '{}';
  return '🔧';
}

function pageTemplate(tool) {
  const meta = JSON.stringify(tool);
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(tool.title)} | ツール集</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --indigo:#4f46e5; --violet:#7c3aed; --emerald:#059669; --bg:#f5f6ff; --surf:#fff; --border:#e0e7ff; --text:#1e1b4b; --text2:#4c4980; --muted:#8b87c0; }
    body { font-family:'Segoe UI','Yu Gothic UI','Hiragino Sans',sans-serif; background:var(--bg); color:var(--text); }
    header { background:linear-gradient(135deg,#1e1b4b,#312e81); color:#fff; }
    .hdr { max-width:900px; margin:0 auto; padding:18px 24px; }
    .hdr-back { display:inline-flex; color:rgba(255,255,255,.62); text-decoration:none; font-size:.78rem; margin-bottom:8px; }
    .hdr-back:hover { color:#fff; }
    .hdr-title { font-size:1.4rem; font-weight:900; margin-bottom:4px; line-height:1.35; }
    .hdr-sub { color:rgba(255,255,255,.72); font-size:.84rem; line-height:1.55; }
    main { max-width:900px; margin:0 auto; padding:24px; }
    .card { background:var(--surf); border:1px solid var(--border); border-radius:14px; padding:20px; margin-bottom:16px; box-shadow:0 2px 10px rgba(79,70,229,.06); }
    .card-title { font-size:.88rem; font-weight:800; color:#3730a3; margin-bottom:12px; }
    textarea, input, select { width:100%; padding:10px 12px; border:1.5px solid var(--border); border-radius:9px; font-size:.86rem; font-family:'Consolas','Yu Gothic UI',monospace; background:var(--bg); color:var(--text); }
    textarea { min-height:180px; resize:vertical; line-height:1.55; }
    textarea:focus, input:focus, select:focus { outline:none; border-color:#818cf8; }
    .btn { padding:9px 18px; border:none; border-radius:9px; font-size:.84rem; font-weight:700; cursor:pointer; font-family:inherit; transition:all .15s; }
    .btn-primary { background:linear-gradient(135deg,var(--indigo),var(--violet)); color:#fff; box-shadow:0 3px 10px rgba(79,70,229,.25); }
    .btn-primary:hover { transform:translateY(-1px); }
    .btn-outline { background:transparent; border:1.5px solid var(--border); color:var(--text2); }
    .btn-outline:hover { border-color:#818cf8; color:var(--indigo); }
    .btn-row { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:10px; }
    .hint { color:var(--muted); font-size:.78rem; margin-top:8px; line-height:1.6; }
    .stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:10px; margin-top:12px; }
    .stat-box { background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:12px; text-align:center; }
    .stat-val { font-size:1.3rem; font-weight:900; color:var(--indigo); font-family:'Consolas',monospace; }
    .stat-lbl { font-size:.72rem; color:var(--muted); margin-top:2px; }
    footer { text-align:center; padding:20px; font-size:.73rem; color:var(--muted); border-top:1px solid var(--border); margin-top:8px; }
    footer a { color:#818cf8; text-decoration:none; }
  </style>
</head>
<body>
<header>
  <div class="hdr">
    <a href="../" class="hdr-back">← ツール一覧</a>
    <div class="hdr-title">${escapeHtml(tool.title)}</div>
    <div class="hdr-sub">${escapeHtml(tool.desc)}</div>
  </div>
</header>
<main>
  <div class="card">
    <div class="card-title">入力</div>
    <textarea id="inputText" placeholder="ここにテキスト、CSV、メモ、数値、日付などを入力してください。"></textarea>
    <div class="grid" style="margin-top:12px">
      <input id="optionA" placeholder="補助入力A（必要な場合）">
      <input id="optionB" placeholder="補助入力B（必要な場合）">
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="runTool()">実行</button>
      <button class="btn btn-outline" onclick="loadSample()">サンプル</button>
      <button class="btn btn-outline" onclick="clearAll()">クリア</button>
    </div>
    <p class="hint">このページはブラウザ内だけで処理します。入力内容は外部へ送信されません。</p>
  </div>
  <div class="card">
    <div class="card-title">結果</div>
    <textarea id="outputText" readonly></textarea>
    <div class="btn-row">
      <button class="btn btn-outline" onclick="copyResult()">コピー</button>
      <button class="btn btn-outline" onclick="downloadResult()">txt保存</button>
    </div>
    <div class="stat-grid">
      <div class="stat-box"><div class="stat-val" id="statChars">0</div><div class="stat-lbl">文字</div></div>
      <div class="stat-box"><div class="stat-val" id="statLines">0</div><div class="stat-lbl">行</div></div>
      <div class="stat-box"><div class="stat-val" id="statBytes">0</div><div class="stat-lbl">UTF-8 bytes</div></div>
    </div>
  </div>
</main>
<footer>
  <a href="../">← ツール一覧へ戻る</a>
  &nbsp;|&nbsp;
  <a href="../../index.html">ホームへ</a>
</footer>
<script>
  const TOOL = ${meta};
  const $ = (id) => document.getElementById(id);
  const lines = (text) => text.replace(/\\r\\n/g, '\\n').split('\\n');
  function csvRows(text) {
    const rows = []; let row = [], cell = '', quote = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i], next = text[i + 1];
      if (ch === '"' && quote && next === '"') { cell += '"'; i++; }
      else if (ch === '"') quote = !quote;
      else if (ch === ',' && !quote) { row.push(cell); cell = ''; }
      else if ((ch === '\\n' || ch === '\\r') && !quote) {
        if (ch === '\\r' && next === '\\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += ch;
    }
    row.push(cell); rows.push(row);
    return rows.filter(r => r.some(c => c !== ''));
  }
  function toCsv(rows) {
    return rows.map(r => r.map(c => /[",\\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c).join(',')).join('\\n');
  }
  function mdTable(rows) {
    if (!rows.length) return '';
    const width = Math.max(...rows.map(r => r.length));
    const padded = rows.map(r => Array.from({ length: width }, (_, i) => r[i] || ''));
    return [padded[0], Array(width).fill('---'), ...padded.slice(1)]
      .map(r => '| ' + r.map(c => String(c).replace(/\\|/g, '\\\\|')).join(' | ') + ' |').join('\\n');
  }
  function normalizeFullHalf(text, toFull) {
    if (!toFull) return text.normalize('NFKC');
    return text.replace(/[!-~]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0xFEE0)).replace(/ /g, '　');
  }
  function template(title, input) {
    const items = lines(input).map(v => v.trim()).filter(Boolean);
    if (/議事録/.test(title)) return '会議名：' + (items[0] || '') + '\\n日時：\\n参加者：\\n\\n議題：\\n- \\n\\n決定事項：\\n- \\n\\nTODO：\\n- [ ] ';
    if (/報告/.test(title)) return '件名：' + (items[0] || '作業報告') + '\\n\\n背景：\\n\\n実施内容：\\n' + items.map(v => '- ' + v).join('\\n') + '\\n\\n結果：\\n\\n課題：\\n\\n次回予定：';
    if (/謝罪/.test(title)) return 'このたびは' + (items[0] || 'ご迷惑') + 'をおかけし、申し訳ございません。\\n原因を確認のうえ、再発防止に努めます。\\n何卒よろしくお願いいたします。';
    if (/お礼/.test(title)) return 'お世話になっております。\\n' + (items[0] || 'ご対応') + 'いただき、ありがとうございます。\\n引き続きよろしくお願いいたします。';
    if (/催促/.test(title)) return 'お世話になっております。\\n先日お願いしておりました件について、状況をご確認いただけますでしょうか。\\nお忙しいところ恐れ入りますが、よろしくお願いいたします。';
    if (/メール|本文化/.test(title)) return '件名：' + (items[0] || 'ご確認のお願い') + '\\n\\nお世話になっております。\\n' + items.join('\\n') + '\\n\\nご確認のほど、よろしくお願いいたします。';
    if (/チェック|TODO/.test(title)) return items.map(v => '- [ ] ' + v).join('\\n');
    if (/表|台帳|一覧|Excel/.test(title)) return toCsv([['No','項目','内容','担当','期限','状態'], ...items.map((v, i) => [String(i + 1), v, '', '', '', '未'])]);
    return items.length ? items.join('\\n') : input;
  }
  function process(title, input, a, b) {
    try {
      if (/バイト数/.test(title)) return 'UTF-8 bytes: ' + new TextEncoder().encode(input).length + '\\n文字数: ' + input.length + '\\n行数: ' + (input ? lines(input).length : 0);
      if (/全角.*半角|半角.*全角/.test(title)) return normalizeFullHalf(input, /全角/.test(a));
      if (/空行削除/.test(title)) return lines(input).filter(v => v.trim() !== '').join('\\n');
      if (/連続スペース/.test(title)) return input.replace(/[ \\t　]+/g, ' ');
      if (/句読点/.test(title)) return input.includes('，') || input.includes('．') ? input.replace(/，/g, '、').replace(/．/g, '。') : input.replace(/、/g, '，').replace(/。/g, '．');
      if (/カッコ/.test(title)) return input.includes('（') || input.includes('）') ? input.replace(/（/g, '(').replace(/）/g, ')') : input.replace(/\\(/g, '（').replace(/\\)/g, '）');
      if (/引用符/.test(title)) return input.replace(/"([^"]*)"/g, '“$1”').replace(/'([^']*)'/g, '‘$1’');
      if (/文章逆順/.test(title)) return lines(input).reverse().join('\\n');
      if (/文字列逆順/.test(title)) return Array.from(input).reverse().join('');
      if (/重複行削除/.test(title)) return [...new Set(lines(input))].join('\\n');
      if (/重複行抽出/.test(title)) { const seen = new Set(), dup = new Set(); lines(input).forEach(v => seen.has(v) ? dup.add(v) : seen.add(v)); return [...dup].join('\\n'); }
      if (/行番号追加/.test(title)) return lines(input).map((v, i) => (i + 1) + '. ' + v).join('\\n');
      if (/行番号削除/.test(title)) return lines(input).map(v => v.replace(/^\\s*\\d+[.)、:：\\-\\s]+/, '')).join('\\n');
      if (/シャッフル/.test(title)) return lines(input).sort(() => Math.random() - .5).join('\\n');
      if (/五十音|英字ソート|ソート/.test(title)) return lines(input).sort((x, y) => x.localeCompare(y, 'ja')).join('\\n');
      if (/CSV整形/.test(title)) return csvRows(input).map(r => r.join(' | ')).join('\\n');
      if (/CSV.*JSON/.test(title)) { const rows = csvRows(input), head = rows.shift() || []; return JSON.stringify(rows.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] || '']))), null, 2); }
      if (/JSON.*CSV/.test(title)) { const arr = JSON.parse(input); const rows = Array.isArray(arr) ? arr : [arr]; const keys = [...new Set(rows.flatMap(o => Object.keys(o)))]; return toCsv([keys, ...rows.map(o => keys.map(k => String(o[k] ?? '')))]); }
      if (/JSON整形/.test(title)) return JSON.stringify(JSON.parse(input), null, 2);
      if (/JSON圧縮/.test(title)) return JSON.stringify(JSON.parse(input));
      if (/URLエンコード/.test(title)) return encodeURIComponent(input);
      if (/URLデコード/.test(title)) return decodeURIComponent(input);
      if (/Base64エンコード/.test(title)) return btoa(unescape(encodeURIComponent(input)));
      if (/Base64デコード/.test(title)) return decodeURIComponent(escape(atob(input)));
      if (/HTMLアンエスケープ/.test(title)) { const el = document.createElement('textarea'); el.innerHTML = input; return el.value; }
      if (/Markdown表|CSV→表/.test(title)) return mdTable(csvRows(input));
      if (/Markdownリンク/.test(title)) return '[' + (a || input || 'リンク') + '](' + (b || input || '') + ')';
      if (/箇条書き/.test(title)) return lines(input).filter(Boolean).map(v => '- ' + v).join('\\n');
      if (/カンマ区切り/.test(title)) return lines(input).map(v => v.trim()).filter(Boolean).join(', ');
      if (/改行区切り/.test(title)) return input.split(',').map(v => v.trim()).filter(Boolean).join('\\n');
      if (/ファイル名安全化/.test(title)) return input.replace(/[\\\\/:*?"<>|]/g, '').replace(/\\s+/g, '_');
      if (/曜日/.test(title)) return new Date(input || a).toLocaleDateString('ja-JP', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      if (/日付加算|カウントダウン/.test(title)) { const d = new Date(input || new Date()); d.setDate(d.getDate() + Number(a || 0)); return d.toLocaleDateString('ja-JP'); }
      if (/時間差/.test(title)) return String((new Date(b) - new Date(a || input)) / 60000) + ' 分';
      if (/合計|平均|最大|最小|割合|割引/.test(title)) { const nums = input.match(/-?\\d+(\\.\\d+)?/g)?.map(Number) || []; if (!nums.length) return ''; const sum = nums.reduce((x,y)=>x+y,0); return '合計: ' + sum + '\\n平均: ' + (sum / nums.length) + '\\n最大: ' + Math.max(...nums) + '\\n最小: ' + Math.min(...nums); }
      return template(title, input);
    } catch (err) {
      return '処理できませんでした: ' + err.message;
    }
  }
  function runTool() {
    const input = $('inputText').value;
    const result = process(TOOL.title, input, $('optionA').value, $('optionB').value);
    $('outputText').value = result;
    updateStats(result);
  }
  function updateStats(text) {
    $('statChars').textContent = text.length.toLocaleString();
    $('statLines').textContent = (text ? lines(text).length : 0).toLocaleString();
    $('statBytes').textContent = new TextEncoder().encode(text).length.toLocaleString();
  }
  function loadSample() {
    $('inputText').value = /CSV|表|Excel/.test(TOOL.title) ? '項目,内容\\nA,確認\\nB,対応' : 'サンプル1\\nサンプル2\\nサンプル1';
    $('optionA').value = '';
    $('optionB').value = '';
    runTool();
  }
  function clearAll() { $('inputText').value = ''; $('optionA').value = ''; $('optionB').value = ''; $('outputText').value = ''; updateStats(''); }
  async function copyResult() { await navigator.clipboard.writeText($('outputText').value); }
  function downloadResult() {
    const blob = new Blob([$('outputText').value], { type:'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = TOOL.slug + '.txt'; a.click(); URL.revokeObjectURL(a.href);
  }
</script>
</body>
</html>
`;
}

function card(tool) {
  const cls = chipClass[tool.category] || 'chip-indigo';
  return `    <div class="tool-card" data-cat="${escapeAttr(tool.category)}" data-name="${escapeAttr(tool.title)}" data-desc="${escapeAttr(tool.desc)}" role="listitem">
      <span class="chip ${cls}">${escapeHtml(tool.category)}</span>
      <div class="card-title-row"><span class="card-icon">${escapeHtml(tool.icon)}</span><span class="card-name">${escapeHtml(tool.title)}</span></div>
      <p class="card-desc">${escapeHtml(tool.desc)}</p>
      <a href="./${escapeAttr(tool.slug)}/" class="card-link">開く →</a>
    </div>`;
}

function indexTemplate(tools) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ツール集 | とある制御屋の備忘録</title>
  <meta name="description" content="登録不要・無料で使えるWebツール集。文字、変換、計算、開発、文章補助、表作成など${tools.length}件のツールを揃えています。">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --indigo:#4f46e5; --violet:#7c3aed; --emerald:#059669; --rose:#e11d48; --bg:#f5f6ff; --surf:#fff; --border:#e0e7ff; --text:#1e1b4b; --text2:#4c4980; --muted:#8b87c0; --radius:16px; --shadow:0 4px 24px rgba(79,70,229,.08); }
    html { scroll-behavior:smooth; }
    body { font-family:'Segoe UI','Yu Gothic UI','Hiragino Sans',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; overflow-x:hidden; }
    .announce-banner { background:linear-gradient(135deg,var(--indigo),var(--violet)); color:#fff; text-align:center; padding:10px 16px; font-size:.85rem; font-weight:500; }
    header { position:sticky; top:0; z-index:99; background:rgba(245,246,255,.92); backdrop-filter:blur(16px); border-bottom:1px solid var(--border); padding:14px 24px; }
    .header-inner { max-width:1040px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
    .header-logo { font-size:1.05rem; font-weight:700; white-space:nowrap; }
    .header-logo span, .accent { background:linear-gradient(135deg,var(--indigo),var(--violet)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .header-back { font-size:.85rem; color:var(--indigo); text-decoration:none; font-weight:600; }
    main { max-width:1040px; margin:0 auto; padding:40px 24px 60px; }
    .hero { text-align:center; margin-bottom:28px; }
    .hero h1 { font-size:1.8rem; font-weight:800; line-height:1.3; margin-bottom:10px; }
    .hero p { color:var(--text2); font-size:.95rem; }
    .search-wrap { position:relative; max-width:560px; margin:0 auto 28px; }
    .search-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }
    .search-input { width:100%; padding:13px 16px 13px 44px; border:1.5px solid var(--border); border-radius:12px; font-size:.95rem; font-family:inherit; background:rgba(255,255,255,.9); color:var(--text); outline:none; }
    .search-input:focus { border-color:var(--indigo); box-shadow:0 0 0 3px rgba(79,70,229,.12); }
    .tools-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:18px; }
    .tool-card { background:rgba(255,255,255,.78); border:1px solid var(--border); border-radius:var(--radius); padding:22px 22px 18px; display:flex; flex-direction:column; gap:10px; box-shadow:var(--shadow); transition:transform .2s,box-shadow .2s,border-color .2s; position:relative; overflow:hidden; min-height:180px; }
    .tool-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--indigo),var(--violet)); }
    .tool-card:hover { transform:translateY(-3px); box-shadow:0 8px 32px rgba(79,70,229,.14); border-color:rgba(79,70,229,.3); }
    .tool-card.hidden { display:none; }
    .chip { display:inline-flex; align-items:center; font-size:.72rem; font-weight:700; padding:3px 10px; border-radius:999px; width:fit-content; letter-spacing:.04em; }
    .chip-indigo { background:rgba(79,70,229,.1); color:var(--indigo); }
    .chip-violet { background:rgba(124,58,237,.1); color:var(--violet); }
    .chip-emerald { background:rgba(5,150,105,.1); color:var(--emerald); }
    .chip-rose { background:rgba(225,29,72,.1); color:var(--rose); }
    .card-title-row { display:flex; align-items:center; gap:10px; }
    .card-icon { font-size:1.35rem; line-height:1; flex-shrink:0; min-width:1.5rem; text-align:center; }
    .card-name { font-size:1rem; font-weight:700; line-height:1.35; }
    .card-desc { font-size:.84rem; color:var(--text2); line-height:1.55; flex:1; }
    .card-link { display:inline-flex; align-items:center; gap:4px; font-size:.85rem; font-weight:600; color:var(--indigo); text-decoration:none; padding:7px 14px; border-radius:8px; background:rgba(79,70,229,.07); border:1px solid rgba(79,70,229,.15); align-self:flex-start; margin-top:auto; }
    .card-link:hover { background:var(--indigo); color:#fff; border-color:var(--indigo); }
    .empty-state { display:none; grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--muted); }
    .empty-state.visible { display:block; }
    footer { text-align:center; padding:24px 16px 32px; color:var(--muted); font-size:.82rem; border-top:1px solid var(--border); }
    footer a { color:var(--indigo); text-decoration:none; font-weight:600; }
    @media (max-width:600px) { main { padding:28px 16px 48px; } .hero h1 { font-size:1.42rem; } .tools-grid { grid-template-columns:1fr; } .tool-card { min-height:auto; } }
  </style>
</head>
<body>
<div class="announce-banner">無料で使えるWebツール集・登録不要・全ブラウザ対応</div>
<header>
  <div class="header-inner">
    <div class="header-logo">🛠 <span>ツール集</span> | とある制御屋の備忘録</div>
    <a href="https://toaruseigyoya.github.io/" class="header-back">← ホームへ</a>
  </div>
</header>
<main>
  <section class="hero">
    <h1>無料 <span class="accent">Webツール集</span></h1>
    <p>登録不要・インストール不要。ブラウザですぐに使えるツールを揃えています。</p>
  </section>
  <div class="search-wrap">
    <span class="search-icon" aria-hidden="true">🔎</span>
    <input type="search" class="search-input" id="searchInput" placeholder="ツールを検索… 例: CSV、日付、メール、Excel" aria-label="ツールを検索" autocomplete="off">
  </div>
  <div class="tools-grid" id="toolsGrid" role="list">
${tools.map(card).join('\n\n')}
    <div class="empty-state" id="emptyState" aria-live="polite">
      <p>見つかりませんでした</p>
    </div>
  </div>
</main>
<footer>
  <p>&copy; 2026 とある制御屋の備忘録 | <a href="https://toaruseigyoya.github.io/">ホームページ</a></p>
</footer>
<script>
  (function () {
    var searchInput = document.getElementById('searchInput');
    var grid = document.getElementById('toolsGrid');
    var emptyState = document.getElementById('emptyState');
    var cards = Array.from(grid.querySelectorAll('.tool-card'));
    function filterCards(query) {
      var q = query.trim().toLowerCase();
      var count = 0;
      cards.forEach(function (card) {
        var match = q === '' ||
          (card.getAttribute('data-name') || '').toLowerCase().indexOf(q) !== -1 ||
          (card.getAttribute('data-desc') || '').toLowerCase().indexOf(q) !== -1 ||
          (card.getAttribute('data-cat') || '').toLowerCase().indexOf(q) !== -1;
        card.classList.toggle('hidden', !match);
        if (match) count++;
      });
      emptyState.classList.toggle('visible', count === 0);
    }
    searchInput.addEventListener('input', function () { filterCards(this.value); });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { this.value = ''; filterCards(''); this.blur(); }
    });
  })();
</script>
</body>
</html>
`;
}

const generatedTools = data.ideas.map((idea) => {
  const title = idea.title.trim();
  const category = mapCategory(idea.category);
  return {
    no: idea.no,
    title,
    desc: idea.desc.trim(),
    sourceCategory: cleanCategory(idea.category),
    category,
    slug: `tool-${String(idea.no).padStart(3, '0')}`,
    icon: iconFor(title, category),
  };
});

for (const tool of generatedTools) {
  const dir = path.join(root, tool.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pageTemplate(tool), 'utf8');
}

const allTools = [
  ...existingTools.map(([category, title, desc, slug, icon]) => ({ category, title, desc, slug, icon })),
  ...generatedTools,
];

fs.writeFileSync(path.join(root, 'index.html'), indexTemplate(allTools), 'utf8');

data.ideas = data.ideas.map((idea) => ({
  ...idea,
  category: cleanCategory(idea.category),
  link: `tool-${String(idea.no).padStart(3, '0')}`,
}));
data.registered = data.ideas.length;
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n', 'utf8');

console.log(`Generated ${generatedTools.length} tool pages.`);
console.log(`Index cards: ${allTools.length}.`);
