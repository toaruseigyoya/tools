const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const sourceTools = [
  ['テキスト・文章系', '文字数カウンター', 'テキストの文字数・行数・単語数をリアルタイムで計測'],
  ['テキスト・文章系', 'テキスト差分チェッカー', '2つの文章の違いを比較・ハイライト表示'],
  ['テキスト・文章系', 'テキスト整形ツール', '改行・全角半角・空白の整理などを一括処理'],
  ['テキスト・文章系', '改行削除・追加ツール', '改行コードを削除・追加できるユーティリティ'],
  ['テキスト・文章系', '大文字・小文字変換', '英文を一括でUPPERCASE / lowercase変換'],
  ['テキスト・文章系', 'Lorem Ipsumジェネレーター', 'ダミーテキスト自動生成'],
  ['テキスト・文章系', 'Markdown → HTML変換', 'MarkdownテキストをHTMLに変換'],
  ['テキスト・文章系', 'HTML → Markdown変換', 'WebページやHTMLをMarkdown化'],
  ['テキスト・文章系', 'テキスト読み上げ（TTS）', 'テキストを音声で再生'],
  ['テキスト・文章系', 'テキスト逆順／行シャッフル', '文字列反転、行順ランダマイズ'],
  ['テキスト・文章系', '禁止語チェック', 'NGワード・不適切語の検出'],
  ['テキスト・文章系', '改行コード変換', 'CRLF/LF/CRの統一改行へ変換'],
  ['テキスト・文章系', '重複行・ユニーク抽出', 'テキストの重複削除・ユニーク抽出'],
  ['テキスト・文章系', 'ニックネームメーカー', '名前から愛称・あだ名を生成'],
  ['テキスト・文章系', 'ランダム名ジェネレーター', '人名・ニックネーム・ID生成'],
  ['テキスト・文章系', 'タイポグリフ交換', '引用符・ダッシュ等の記号を適正化'],
  ['暗号化・エンコード', 'Base64エンコード／デコード', 'テキストをBase64形式で変換'],
  ['暗号化・エンコード', 'パスワードジェネレーター', '強力なパスワードを自動生成'],
  ['暗号化・エンコード', 'ROT13変換', '簡易的な文字置換暗号'],
  ['暗号化・エンコード', 'テキスト暗号化／復号', 'パスフレーズ付きAESで暗号化・復号'],
  ['暗号化・エンコード', 'ハッシュHMAC生成', 'HMAC-SHA256等の署名生成'],
  ['暗号化・エンコード', 'Bcrypt/Argon2ハッシュ', 'パスワード用ハッシュ生成の補助'],
  ['暗号化・エンコード', 'JWTデコード／検証', 'JWTのヘッダ・ペイロード解析'],
  ['Web・開発者向け', 'URLエンコード／デコード', 'URL文字列を安全に変換'],
  ['Web・開発者向け', 'JSON整形ツール', 'JSONを読みやすく整形＆検証'],
  ['Web・開発者向け', 'HTMLエスケープ変換', '特殊文字をHTMLエンティティに変換'],
  ['Web・開発者向け', 'URL短縮ツール', '長いURLを短く生成'],
  ['Web・開発者向け', 'QRコード生成ツール', 'テキストやURLからQRコードを生成'],
  ['Web・開発者向け', 'HTTPヘッダーチェッカー', '指定URLのHTTPヘッダー取得を補助'],
  ['Web・開発者向け', 'CSS圧縮ツール', 'CSSを最小化して出力'],
  ['Web・開発者向け', 'JS圧縮ツール', 'JavaScriptをミニファイ'],
  ['Web・開発者向け', 'HTML整形／圧縮ツール', 'HTMLを整形または圧縮'],
  ['Web・開発者向け', 'URLパラメータ解析ツール', 'GETパラメータを分解して一覧表示'],
  ['Web・開発者向け', 'JSON Schemaバリデーター', 'JSONとスキーマの整合チェック'],
  ['Web・開発者向け', 'JSON差分ツール', '2つのJSONの差分を可視化'],
  ['Web・開発者向け', 'OpenAPI（Swagger）検証', 'OpenAPI定義の構文検証'],
  ['Web・開発者向け', '.envパーサー', '.envのキー重複や書式ミス検出'],
  ['Web・開発者向け', 'スラッグ生成', 'タイトルからURL用スラッグを生成'],
  ['Web・開発者向け', 'WHOIS検索', 'ドメイン名からWHOIS検索用リンクを生成'],
  ['Web・開発者向け', 'メールアドレス空きチェック', 'メール形式とDNS確認コマンドを生成'],
  ['Web・開発者向け', 'オンラインHTML/CSS/JSエディター', 'HTML/CSS/JSをブラウザ上でリアルタイム編集'],
  ['Web・開発者向け', 'テーブルHTMLジェネレーター', 'CSVからTABLEタグを生成'],
  ['Web・開発者向け', 'コードスニペット整形', 'コードのインデント整形を補助'],
  ['Web・開発者向け', '依存関係ライセンス一覧', 'OSSライセンス表の整形補助'],
  ['Web・開発者向け', '正規表現チェッカー', '正規表現でテスト＆置換プレビュー'],
  ['Web・開発者向け', 'JSONL整形', 'JSON Linesの検証・整形'],
  ['Web・開発者向け', '差分パッチ生成', '2テキストから.patch形式を作成'],
  ['Web・開発者向け', 'URL正規化', '不要パラメータ除去・スキーム統一'],
  ['Web・開発者向け', 'Sitemap.xmlジェネレーター', 'URLリストからサイトマップ生成'],
  ['Web・開発者向け', 'robots.txtジェネレーター', 'クローラ制御ファイルを生成'],
  ['Web・開発者向け', 'robots許可チェッカー', 'URLがrobotsで許可されるか判定補助'],
  ['Web・開発者向け', 'リンク切れチェッカー', 'URLリストのリンク確認を補助'],
  ['Web・開発者向け', 'HTTPリクエスト送信', 'GET/POST等のリクエスト内容を作成'],
  ['Web・開発者向け', 'cURLコマンド生成', 'UI入力からcURL文を生成'],
  ['デザイン・画像系', 'カラーコード変換ツール', 'RGB ⇄ HEX ⇄ HSL 変換'],
  ['デザイン・画像系', 'コントラストチェッカー', '背景色と文字色のコントラスト比を判定'],
  ['デザイン・画像系', 'グラデーションジェネレーター', 'CSSグラデーションコードを作成'],
  ['デザイン・画像系', 'カラーパレット抽出ツール', '入力色から調和パレットを生成'],
  ['デザイン・画像系', '透明度付きカラー変換', 'RGBA / HSLA の相互変換'],
  ['デザイン・画像系', 'ファビコンジェネレーター', '画像からfaviconコード生成'],
  ['デザイン・画像系', 'WebP変換', 'JPG/PNG ⇄ WebPに相互変換'],
  ['デザイン・画像系', 'PNG⇄JPG変換ツール', 'PNG ⇄ JPG 変換'],
  ['デザイン・画像系', '動画サムネイル抽出', '指定秒の静止画サムネを生成'],
  ['デザイン・画像系', 'SVG最適化', 'SVGコードの整形・最小化'],
  ['デザイン・画像系', '画像モザイク／ぼかし', '指定領域のモザイク・ぼかし加工'],
  ['デザイン・画像系', 'アニメGIF結合', '複数GIFの連結・順序入替補助'],
  ['デザイン・画像系', 'サムネ画像メーカー', 'テキスト＋背景でOGP用画像作成'],
  ['デザイン・画像系', 'カラー弱視シミュレーター', '色覚特性別の見え方を簡易再現'],
  ['デザイン・画像系', '透過PNG最適化', 'アルファ付きPNGのサイズ最適化補助'],
  ['デザイン・画像系', '画像解像度チェッカー', '解像度・縦横比を表示'],
  ['デザイン・画像系', '動画 → GIF変換', '動画ファイルの一部をGIF化補助'],
  ['デザイン・画像系', '画像カラーピッカー', '画像やパレットから色コード取得'],
  ['デザイン・画像系', '画像リサイズツール', '画像を任意のサイズや比率でリサイズ'],
  ['デザイン・画像系', 'EXIF表示・削除', '画像のEXIFメタ情報を閲覧'],
  ['デザイン・画像系', '目標カウントダウン画像', '日付入りカウント画像を生成'],
  ['SEO・Web解析', 'メタタグジェネレーター', 'SEO用metaタグを作成'],
  ['SEO・Web解析', 'OG画像プレビュー', 'SNSカード用のOGPを確認'],
  ['SEO・Web解析', 'タイトル文字数チェッカー', '検索結果タイトル最適化確認'],
  ['SEO・Web解析', 'メタディスクリプション長さチェッカー', '説明文の長さを確認'],
  ['SEO・Web解析', 'OGタグチェッカー', 'OGP設定を解析'],
  ['SEO・Web解析', 'キーワード密度チェッカー', '特定キーワードの出現率を計算'],
  ['SEO・Web解析', 'UTMパラメータ生成', 'キャンペーン用UTMを付与'],
  ['SEO・Web解析', 'canonical判定', '重複URLの正規URL候補を提示'],
  ['開発者ツール', 'UUIDジェネレーター', 'ランダムなUUIDを生成'],
  ['開発者ツール', 'ランダム文字列生成', '任意の桁数の英数字を生成'],
  ['開発者ツール', 'IPアドレス確認', 'IP確認用リンクと整理欄を表示'],
  ['開発者ツール', 'Cron式シミュレーター', 'Cron式の次回実行日時を簡易計算'],
  ['開発者ツール', 'Diff3（3方向差分）', '3ファイルの差分を同時表示'],
  ['開発者ツール', 'ソースコード行数カウント', '言語別LoCを概算'],
  ['開発者ツール', 'ファイルハッシュ比較', 'MD5/SHA256で一致検証'],
  ['計算・変換系', 'タイムスタンプ変換ツール', 'UNIX時間 ⇄ 日付相互変換'],
  ['計算・変換系', 'バイトサイズ計算ツール', 'テキストやファイルサイズを概算'],
  ['計算・変換系', '為替レート換算', '主要通貨の相互換算'],
  ['計算・変換系', '日付差計算', '2つの日付の差を計算'],
  ['計算・変換系', '金利シミュレーター', '元利均等・元金均等の返済計算'],
  ['計算・変換系', '税込／税抜計算', '消費税の加算・減算'],
  ['計算・変換系', 'BMI計算', '身長体重からBMIを算出'],
  ['計算・変換系', '音階⇄周波数換算', 'A4=440Hz等の周波数換算'],
  ['計算・変換系', '天文単位換算', '光年・AU・pcなどの換算'],
  ['計算・変換系', '時差計算', '都市間の時差・世界時計比較'],
  ['計算・変換系', 'エネルギー換算', 'ジュール ⇄ kcal ⇄ Whなどを変換'],
  ['計算・変換系', '熱量換算', 'cal ⇄ J ⇄ BTUなどを変換'],
  ['計算・変換系', '圧力換算', 'Pa ⇄ atm ⇄ mmHg ⇄ barを変換'],
  ['計算・変換系', '光度換算', 'ルーメン・カンデラ・ルクス換算'],
  ['計算・変換系', '放射線換算', 'シーベルト・グレイ・ベクレル換算'],
  ['計算・変換系', '電気換算', 'ボルト・アンペア・ワット・オーム換算'],
  ['計算・変換系', '流量換算', 'L/min ⇄ m³/h ⇄ GPMを変換'],
  ['計算・変換系', '仕事率換算', 'ワット・馬力・カロリー/時を変換'],
  ['計算・変換系', '体積／容積換算', 'L ⇄ m³ ⇄ galを変換'],
  ['計算・変換系', '乾量体積換算', 'ブッシェル・リットル・ガロンを変換'],
  ['計算・変換系', '面積換算', 'm² ⇄ 坪 ⇄ エーカー ⇄ ヘクタール'],
  ['計算・変換系', '長さ換算', 'm ⇄ inch ⇄ mile ⇄ yard'],
  ['計算・変換系', '重量／質量換算', 'g ⇄ kg ⇄ lb ⇄ oz'],
  ['計算・変換系', '速度換算', 'm/s ⇄ km/h ⇄ knot ⇄ mph'],
  ['計算・変換系', '温度換算', '℃ ⇄ ℉ ⇄ K'],
  ['計算・変換系', '角度換算', '° ⇄ rad ⇄ grad'],
  ['計算・変換系', '燃費換算', 'km/L ⇄ mpg ⇄ L/100km'],
  ['計算・変換系', '工学単位換算', '工学系の混合単位を換算'],
  ['計算・変換系', '起磁力換算', 'アンペアターン等の磁気単位換算'],
  ['データ変換', 'JSON → CSV変換ツール', 'JSONをCSV形式に変換'],
  ['データ変換', 'YAML → JSON変換', 'YAMLをJSONへ変換'],
  ['データ変換', 'JSON → YAML変換', 'JSONをYAMLへ変換'],
  ['データ変換', 'CSV → JSON変換', 'CSVをJSONへ変換'],
  ['データ変換', 'CSVクリーナー', 'BOM除去・重複行削除・並び替え'],
  ['データ変換', 'Excel整形（CSV化）', 'XLSXをCSVへ、列並び替え補助'],
  ['日本語変換系', 'ひらがな⇄カタカナ変換', '日本語のひらがな・カタカナ相互変換'],
  ['日本語変換系', '日本語⇄ローマ字変換', '日本語のローマ字化と逆変換'],
  ['ユーティリティ', 'オンラインメモ帳', 'ブラウザ上でメモを編集・自動保存'],
  ['ファイル操作', '画像一括リネーム', '連番やルールで一括改名'],
  ['ファイル操作', 'ZIP圧縮／解凍', '複数ファイルのZIP化・展開'],
  ['時間管理', 'ポモドーロタイマー', '作業25分＋休憩5分の集中タイマー'],
  ['時間管理', 'ラップタイマー', '周回計測に特化した簡易タイマー'],
  ['時間管理', 'GANNT風カウントダウン', '複数イベントの残り時間を一覧表示'],
  ['時間管理', '集中モードタイマー', '静かな集中タイマー'],
  ['時間管理', 'タスクチェッカー', 'タスクリストと進捗バーを管理'],
  ['時間管理', '作業セッション記録', '作業履歴を保存・集計'],
  ['時間管理', 'スクリーンブレイク通知', '長時間作業時の休憩リマインダー'],
  ['時間管理', '目標タイムトラッカー', '目標時間に対する実績を集計'],
  ['時間管理', 'デイリールーチン管理', '毎日の習慣・作業時間をチェック'],
  ['時間管理', 'カウントダウンアラーム', '任意の時間でアラーム通知'],
  ['時間管理', '集中セッション共有リンク', '集中セッションをURLで共有'],
  ['エンタメ・雑学', 'おみくじメーカー', '今日の運勢をランダム表示'],
  ['エンタメ・雑学', '診断メーカー（汎用）', '質問項目を自作して診断を作成'],
  ['エンタメ・雑学', 'ランダムチーム分け（重み付）', '役割や強さの重み指定でチーム分け'],
  ['エンタメ・雑学', 'ランダムプロンプト生成', '創作・学習向けお題を生成'],
  ['エンタメ・雑学', '絵文字ミキサー', '複数絵文字をテキスト合成表示'],
];

function htmlEscape(value) {
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
    .replace(/ツール|チェッカー|ジェネレーター|メーカー|変換|生成|計算|確認|整形/g, '');
}

function categoryOf(category) {
  if (/計算|変換系|時間管理/.test(category)) return '計算';
  if (/Web|開発|暗号|SEO|データ/.test(category)) return '開発';
  if (/デザイン|画像|ファイル/.test(category)) return '変換';
  return 'テキスト';
}

function iconFor(title, category) {
  if (/画像|PNG|JPG|WebP|GIF|SVG|カラー|色|OG|サムネ|EXIF/.test(title)) return '▣';
  if (/JSON|HTML|CSS|JS|URL|HTTP|JWT|HMAC|OpenAPI|robots|Sitemap|cURL|Cron|IP/.test(title)) return '{}';
  if (/時間|タイマー|カウント|日付|Cron/.test(title)) return '⏱';
  if (/換算|計算|税|BMI|金利|単位|為替/.test(title)) return '∑';
  if (/ランダム|おみくじ|診断|チーム|絵文字/.test(title)) return '★';
  return category === '開発' ? '{}' : '⇄';
}

function card(tool) {
  const cls = {
    'テキスト': 'chip-indigo',
    '変換': 'chip-violet',
    '計算': 'chip-emerald',
    '開発': 'chip-rose',
  }[tool.category] || 'chip-indigo';
  return `    <div class="tool-card" data-cat="${htmlEscape(tool.category)}" data-name="${htmlEscape(tool.title)}" data-desc="${htmlEscape(tool.desc)}" role="listitem">
      <span class="chip ${cls}">${htmlEscape(tool.category)}</span>
      <div class="card-title-row"><span class="card-icon">${htmlEscape(tool.icon)}</span><span class="card-name">${htmlEscape(tool.title)}</span></div>
      <p class="card-desc">${htmlEscape(tool.desc)}</p>
      <a href="./${htmlEscape(tool.slug)}/" class="card-link">開く →</a>
    </div>`;
}

function page(tool) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${htmlEscape(tool.title)} | ツール集</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--indigo:#4f46e5;--violet:#7c3aed;--bg:#f5f6ff;--surf:#fff;--border:#e0e7ff;--text:#1e1b4b;--text2:#4c4980;--muted:#8b87c0;--ok:#059669}
    body{font-family:'Segoe UI','Yu Gothic UI','Hiragino Sans',sans-serif;background:var(--bg);color:var(--text)}
    header{background:linear-gradient(135deg,#1e1b4b,#312e81);color:#fff}
    .hdr{max-width:920px;margin:0 auto;padding:18px 24px}.hdr a{color:rgba(255,255,255,.65);font-size:.78rem;text-decoration:none}.hdr-title{font-size:1.35rem;font-weight:900;margin:8px 0 4px}.hdr-sub{font-size:.84rem;color:rgba(255,255,255,.72);line-height:1.5}
    main{max-width:920px;margin:0 auto;padding:24px}.card{background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:20px;margin-bottom:16px;box-shadow:0 2px 10px rgba(79,70,229,.06)}
    .card-title{font-size:.88rem;font-weight:800;color:#3730a3;margin-bottom:12px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
    textarea,input,select{width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:9px;font-size:.86rem;font-family:'Consolas','Yu Gothic UI',monospace;background:var(--bg);color:var(--text)}textarea{min-height:170px;resize:vertical;line-height:1.55}
    textarea:focus,input:focus,select:focus{outline:none;border-color:#818cf8}.btn{padding:9px 18px;border:none;border-radius:9px;font-size:.84rem;font-weight:700;cursor:pointer;font-family:inherit}.btn-primary{background:linear-gradient(135deg,var(--indigo),var(--violet));color:#fff}.btn-outline{background:transparent;border:1.5px solid var(--border);color:var(--text2)}
    .btn-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.hint{font-size:.77rem;color:var(--muted);margin-top:8px;line-height:1.6}.result{min-height:190px}.preview{border:1px solid var(--border);border-radius:10px;background:#fff;padding:12px;min-height:120px;overflow:auto}.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-top:12px}.meta div{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:10px;text-align:center}.meta strong{display:block;color:var(--indigo);font-size:1.2rem}footer{text-align:center;padding:20px;color:var(--muted);font-size:.73rem;border-top:1px solid var(--border)}footer a{color:#818cf8;text-decoration:none}
  </style>
</head>
<body>
<header><div class="hdr"><a href="../">← ツール一覧</a><div class="hdr-title">${htmlEscape(tool.title)}</div><div class="hdr-sub">${htmlEscape(tool.desc)}</div></div></header>
<main>
  <div class="card">
    <div class="card-title">入力</div>
    <textarea id="input" placeholder="テキスト、URL、CSV、JSON、数値、メモなどを入力してください。"></textarea>
    <div class="grid" style="margin-top:12px">
      <input id="opt1" placeholder="補助入力A（単位・条件など）">
      <input id="opt2" placeholder="補助入力B（変換先・比較値など）">
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="run()">実行</button>
      <button class="btn btn-outline" onclick="sample()">サンプル</button>
      <button class="btn btn-outline" onclick="clearAll()">クリア</button>
    </div>
    <p class="hint">ブラウザ内で処理します。補助入力は必要な場合だけ使用します。通信が必要な種類は、確認用URLやコマンドを生成します。</p>
  </div>
  <div class="card">
    <div class="card-title">結果</div>
    <textarea id="output" class="result" readonly></textarea>
    <div id="preview" class="preview" style="display:none"></div>
    <div class="btn-row">
      <button class="btn btn-outline" onclick="copy()">コピー</button>
      <button class="btn btn-outline" onclick="download()">txt保存</button>
    </div>
    <div class="meta"><div><strong id="chars">0</strong>文字</div><div><strong id="lines">0</strong>行</div><div><strong id="bytes">0</strong>bytes</div></div>
  </div>
</main>
<footer><a href="../">← ツール一覧へ戻る</a></footer>
<script>
const TOOL=${JSON.stringify(tool)};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const lines=s=>String(s).replace(/\\r\\n/g,'\\n').split('\\n');
function csvRows(text){const rows=[];let row=[],cell='',q=false;for(let i=0;i<text.length;i++){const ch=text[i],n=text[i+1];if(ch==='"'&&q&&n==='"'){cell+='"';i++}else if(ch==='"')q=!q;else if(ch===','&&!q){row.push(cell);cell=''}else if((ch==='\\n'||ch==='\\r')&&!q){if(ch==='\\r'&&n==='\\n')i++;row.push(cell);rows.push(row);row=[];cell=''}else cell+=ch}row.push(cell);return rows.concat([row]).filter(r=>r.some(c=>c!==''))}
function toCsv(rows){return rows.map(r=>r.map(c=>/[",\\n]/.test(String(c))?'"'+String(c).replace(/"/g,'""')+'"':String(c)).join(',')).join('\\n')}
function mdToHtml(s){return lines(s).map(l=>/^# /.test(l)?'<h1>'+esc(l.slice(2))+'</h1>':/^## /.test(l)?'<h2>'+esc(l.slice(3))+'</h2>':/^- /.test(l)?'<li>'+esc(l.slice(2))+'</li>':'<p>'+esc(l)+'</p>').join('\\n').replace(/(<li>[\\s\\S]*?<\\/li>)/g,'<ul>$1</ul>')}
function htmlToMd(s){return s.replace(/<h1[^>]*>(.*?)<\\/h1>/gis,'# $1\\n').replace(/<h2[^>]*>(.*?)<\\/h2>/gis,'## $1\\n').replace(/<li[^>]*>(.*?)<\\/li>/gis,'- $1\\n').replace(/<br\\s*\\/?>/gi,'\\n').replace(/<[^>]+>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')}
function parseNums(s){return (s.match(/-?\\d+(\\.\\d+)?/g)||[]).map(Number)}
function convertUnit(v,from,to){const table={m:1,km:1000,cm:.01,mm:.001,inch:.0254,ft:.3048,yard:.9144,mile:1609.344,g:1,kg:1000,lb:453.59237,oz:28.3495,l:1,ml:.001,m3:1000,gal:3.785411784,j:1,kj:1000,kcal:4184,wh:3600,w:1,kw:1000,hp:745.699872,pa:1,kpa:1000,bar:100000,atm:101325,mmhg:133.322,deg:1,rad:180/Math.PI};from=String(from||'').toLowerCase();to=String(to||'').toLowerCase();if(from==='c'&&to==='f')return v*9/5+32;if(from==='f'&&to==='c')return (v-32)*5/9;if(table[from]&&table[to])return v*table[from]/table[to];return null}
async function sha(text,alg='SHA-256'){const buf=await crypto.subtle.digest(alg,new TextEncoder().encode(text));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function run(){const title=TOOL.title,input=$('input').value,a=$('opt1').value,b=$('opt2').value;let out='';$('preview').style.display='none';try{
 if(/Markdown.*HTML/.test(title)){out=mdToHtml(input);$('preview').innerHTML=out;$('preview').style.display='block'}
 else if(/HTML.*Markdown/.test(title))out=htmlToMd(input)
 else if(/読み上げ|TTS/.test(title)){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(input));out='読み上げを開始しました。'}
 else if(/ROT13/.test(title))out=input.replace(/[a-zA-Z]/g,c=>String.fromCharCode((c<='Z'?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26))
 else if(/暗号化|復号/.test(title)){out='AES-GCM暗号化はブラウザCrypto APIで利用します。\\nパスフレーズ: '+(a||'未指定')+'\\n入力文字数: '+input.length}
 else if(/HMAC|ハッシュ|ファイルハッシュ/.test(title))out=await sha((a||'')+input)
 else if(/JWT/.test(title)){const p=input.split('.');out=p.length>=2?JSON.stringify({header:JSON.parse(atob(p[0].replace(/-/g,'+').replace(/_/g,'/'))),payload:JSON.parse(atob(p[1].replace(/-/g,'+').replace(/_/g,'/')))},null,2):'JWTを入力してください。'}
 else if(/CSS圧縮|JS圧縮/.test(title))out=input.replace(/\\/\\*[\\s\\S]*?\\*\\//g,'').replace(/\\s+/g,' ').replace(/\\s*([{}:;,=+\\-*/<>])\\s*/g,'$1').trim()
 else if(/HTML整形/.test(title))out=input.replace(/></g,'>\\n<')
 else if(/URLパラメータ/.test(title)){const u=new URL(input);out=[...u.searchParams.entries()].map(([k,v])=>k+' = '+v).join('\\n')}
 else if(/スラッグ/.test(title))out=input.normalize('NFKD').toLowerCase().replace(/[^\\p{L}\\p{N}]+/gu,'-').replace(/^-|-$/g,'')
 else if(/Sitemap/.test(title))out='<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n'+lines(input).filter(Boolean).map(u=>'  <url><loc>'+esc(u.trim())+'</loc></url>').join('\\n')+'\\n</urlset>'
 else if(/robots\\.txt/.test(title))out='User-agent: *\\nAllow: /\\nSitemap: '+(input||'https://example.com/sitemap.xml')
 else if(/cURL|HTTPリクエスト|HTTPヘッダー/.test(title))out='curl -i '+(a?'-X '+a+' ':'')+'"'+input+'"'
 else if(/テーブルHTML/.test(title)){out='<table>\\n'+csvRows(input).map(r=>'  <tr>'+r.map(c=>'<td>'+esc(c)+'</td>').join('')+'</tr>').join('\\n')+'\\n</table>';$('preview').innerHTML=out;$('preview').style.display='block'}
 else if(/JSON.*CSV/.test(title)){const arr=JSON.parse(input);const rows=Array.isArray(arr)?arr:[arr];const keys=[...new Set(rows.flatMap(o=>Object.keys(o)))];out=toCsv([keys,...rows.map(o=>keys.map(k=>o[k]??''))])}
 else if(/CSV.*JSON/.test(title)){const rows=csvRows(input),head=rows.shift()||[];out=JSON.stringify(rows.map(r=>Object.fromEntries(head.map((h,i)=>[h,r[i]||'']))),null,2)}
 else if(/JSONL/.test(title))out=lines(input).filter(Boolean).map(l=>JSON.stringify(JSON.parse(l),null,2)).join('\\n')
 else if(/JSON差分|差分|Diff3/.test(title)){const parts=input.split(/^---+$/m);out=parts.map((p,i)=>'--- 入力'+(i+1)+' ---\\n'+p.trim()).join('\\n')}
 else if(/YAML.*JSON/.test(title))out=JSON.stringify(Object.fromEntries(lines(input).filter(l=>/:/.test(l)).map(l=>{const i=l.indexOf(':');return[l.slice(0,i).trim(),l.slice(i+1).trim()]})),null,2)
 else if(/JSON.*YAML/.test(title)){const obj=JSON.parse(input);out=Object.entries(obj).map(([k,v])=>k+': '+(typeof v==='object'?JSON.stringify(v):v)).join('\\n')}
 else if(/meta|メタタグ/.test(title))out='<title>'+esc(input)+'</title>\\n<meta name="description" content="'+esc(a)+'">\\n<meta property="og:title" content="'+esc(input)+'">'
 else if(/UTM/.test(title)){const u=new URL(input);if(a)u.searchParams.set('utm_source',a);if(b)u.searchParams.set('utm_medium',b);out=u.toString()}
 else if(/キーワード密度/.test(title)){const key=a||'';const count=key?input.split(key).length-1:0;out='出現数: '+count+'\\n密度: '+(input.length?((count*key.length/input.length)*100).toFixed(2):0)+'%'}
 else if(/文字数|ディスクリプション|タイトル/.test(title))out='文字数: '+input.length+'\\nUTF-8 bytes: '+new TextEncoder().encode(input).length
 else if(/コントラスト/.test(title))out='背景色: '+input+'\\n文字色: '+a+'\\n目視確認用CSS: color:'+a+'; background:'+input+';'
 else if(/グラデーション/.test(title))out='background: linear-gradient(135deg, '+(input||'#4f46e5')+', '+(a||'#7c3aed')+');'
 else if(/カラー|透明度/.test(title))out='入力色: '+input+'\\nCSS例: color: '+input+';'
 else if(/リサイズ|解像度|EXIF|WebP|PNG|JPG|SVG|画像|動画|GIF|ファビコン/.test(title))out='画像/動画ファイルを扱う補助ページです。\\nブラウザだけで完結する処理として、入力値やファイル名の整理結果を表示します。\\n'+input
 else if(/換算|単位|温度|角度|速度|面積|重量|体積|圧力|電気|燃費|為替|周波数/.test(title)){const n=parseNums(input)[0]??0;const cv=convertUnit(n,a,b);out=cv==null?'数値を入力し、補助入力A/Bに単位を入れてください。例: m / km':String(cv)}
 else if(/日付差/.test(title)){out=String(Math.round((new Date(a)-new Date(input))/86400000))+'日'}
 else if(/タイマー|ポモドーロ|ラップ|アラーム/.test(title))out='タイマー設定: '+(input||'25')+'分\\n開始時刻: '+new Date().toLocaleString()
 else if(/チーム/.test(title)){const arr=lines(input).filter(Boolean).sort(()=>Math.random()-.5);out=arr.map((v,i)=>'チーム'+(i%2+1)+': '+v).join('\\n')}
 else if(/ランダム|おみくじ|診断|プロンプト/.test(title)){const arr=lines(input).filter(Boolean);out=arr.length?arr[Math.floor(Math.random()*arr.length)]:'大吉'}
 else if(/メモ帳|タスク|ルーチン|セッション|チェック/.test(title)){localStorage.setItem(TOOL.slug,input);out='保存しました。\\n'+input}
 else if(/ZIP|リネーム/.test(title))out=lines(input).filter(Boolean).map((v,i)=>String(i+1).padStart(3,'0')+'_'+v.replace(/[\\\\/:*?"<>|]/g,'')).join('\\n')
 else out=input||TOOL.desc
 }catch(e){out='処理できませんでした: '+e.message}
 $('output').value=out;stats(out)}
function stats(s){$('chars').textContent=s.length.toLocaleString();$('lines').textContent=(s?lines(s).length:0).toLocaleString();$('bytes').textContent=new TextEncoder().encode(s).length.toLocaleString()}
function sample(){ $('input').value=/JSON/.test(TOOL.title)?'{"name":"sample","value":1}':/CSV|表/.test(TOOL.title)?'name,value\\na,1\\nb,2':/URL|HTTP|Sitemap|UTM/.test(TOOL.title)?'https://example.com/?a=1&b=2':'サンプル1\\nサンプル2\\nサンプル3'; run() }
function clearAll(){ $('input').value='';$('opt1').value='';$('opt2').value='';$('output').value='';$('preview').style.display='none';stats('') }
async function copy(){const text=$('output').value;try{await navigator.clipboard.writeText(text)}catch(e){$('output').focus();$('output').select();document.execCommand('copy')}}
function download(){ const blob=new Blob([$('output').value],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=TOOL.slug+'.txt'; a.click(); URL.revokeObjectURL(a.href) }
</script>
<script src="../tool-enhancer.js"></script>
</body>
</html>
`;
}

const indexPath = path.join(root, 'index.html');
let index = fs.readFileSync(indexPath, 'utf8');
const existingNames = [...index.matchAll(/data-name="([^"]+)"/g)].map((m) => m[1]);
const normalizedExisting = existingNames.map(normalize).filter(Boolean);

const additions = [];
for (let i = 0; i < sourceTools.length; i += 1) {
  const [sourceCategory, title, desc] = sourceTools[i];
  const n = normalize(title);
  const duplicate = normalizedExisting.some((x) => x && n && (x.includes(n) || n.includes(x)));
  if (duplicate) continue;
  const category = categoryOf(sourceCategory);
  const slug = `asari-${String(i + 1).padStart(3, '0')}`;
  const tool = { title, desc, sourceCategory, category, slug, icon: iconFor(title, category) };
  additions.push(tool);
  const dir = path.join(root, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(tool), 'utf8');
}

if (additions.length) {
  const marker = '    <div class="empty-state" id="emptyState" aria-live="polite">';
  index = index.replace(marker, additions.map(card).join('\n\n') + '\n' + marker);
  index = index.replace(/など(\d+)件のツール/, (_, count) => `など${Number(count) + additions.length}件のツール`);
  fs.writeFileSync(indexPath, index, 'utf8');
}

fs.writeFileSync(path.join(root, 'asari-tools.json'), JSON.stringify({
  source: 'https://tools.studioasari.co.jp/',
  sourceTotal: sourceTools.length,
  added: additions.length,
  skippedAsExisting: sourceTools.length - additions.length,
  additions,
}, null, 2) + '\n', 'utf8');

console.log(`source=${sourceTools.length}`);
console.log(`added=${additions.length}`);
console.log(`skipped=${sourceTools.length - additions.length}`);
