(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function textOf(selector) {
    var el = document.querySelector(selector);
    return el ? el.textContent.replace(/^[^\wぁ-んァ-ヶ一-龠A-Za-z0-9]+/, '').trim() : '';
  }
  var title = (window.TOOL && window.TOOL.title) || textOf('.hdr-title') || document.title.replace(/\s*\|.*$/, '').trim();
  var slug = (window.TOOL && window.TOOL.slug) || location.pathname.split('/').filter(Boolean).pop() || 'tool';
  var input = $('input') || $('inputText');
  var output = $('output') || $('outputText');
  if (!output || !document.querySelector('.tool-guide')) return;

  var opt1 = $('opt1') || $('optionA');
  var opt2 = $('opt2') || $('optionB');
  var fileBox = null;
  var selectedFiles = [];

  function lines(s) { return String(s || '').replace(/\r\n/g, '\n').split('\n'); }
  function nonempty(s) { return lines(s).map(function (v) { return v.trim(); }).filter(Boolean); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function nums(s) { return (String(s || '').match(/-?\d+(?:\.\d+)?/g) || []).map(Number); }
  function setOut(text) {
    output.value = String(text == null ? '' : text);
    output.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function getInput() { return input ? input.value : ''; }
  function getA() { return opt1 ? opt1.value : ''; }
  function getB() { return opt2 ? opt2.value : ''; }
  function downloadText(name, content, type) {
    var blob = new Blob([content], { type: type || 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function csvRows(text) {
    var rows = [], row = [], cell = '', q = false;
    text = String(text || '');
    for (var i = 0; i < text.length; i++) {
      var ch = text[i], n = text[i + 1];
      if (ch === '"' && q && n === '"') { cell += '"'; i++; }
      else if (ch === '"') q = !q;
      else if (ch === ',' && !q) { row.push(cell); cell = ''; }
      else if ((ch === '\n' || ch === '\r') && !q) {
        if (ch === '\r' && n === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += ch;
    }
    row.push(cell); rows.push(row);
    return rows.filter(function (r) { return r.some(function (c) { return c !== ''; }); });
  }
  function toCsv(rows) {
    return rows.map(function (r) {
      return r.map(function (v) {
        v = String(v == null ? '' : v);
        return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }).join(',');
    }).join('\n');
  }
  function table(rows) {
    if (!rows.length) return '';
    var w = Math.max.apply(null, rows.map(function (r) { return r.length; }));
    var pad = rows.map(function (r) { return Array.from({ length: w }, function (_, i) { return r[i] || ''; }); });
    return [pad[0], Array(w).fill('---')].concat(pad.slice(1)).map(function (r) {
      return '| ' + r.map(function (c) { return String(c).replace(/\|/g, '\\|'); }).join(' | ') + ' |';
    }).join('\n');
  }
  function crc32(str) {
    var c = ~0;
    for (var i = 0; i < str.length; i++) {
      c ^= str.charCodeAt(i);
      for (var k = 0; k < 8; k++) c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
    }
    return ((~c) >>> 0).toString(16).padStart(8, '0');
  }
  async function sha(text, alg) {
    var buf = await crypto.subtle.digest(alg || 'SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }
  function base64(text, decode) {
    if (decode) return new TextDecoder().decode(Uint8Array.from(atob(text.trim()), function (c) { return c.charCodeAt(0); }));
    return btoa(String.fromCharCode.apply(null, Array.from(new TextEncoder().encode(text))));
  }
  function unit(v, from, to) {
    var t = { m: 1, km: 1000, cm: .01, mm: .001, inch: .0254, ft: .3048, yard: .9144, mile: 1609.344, g: 1, kg: 1000, lb: 453.59237, oz: 28.3495, l: 1, ml: .001, m3: 1000, gal: 3.785411784, j: 1, kj: 1000, kcal: 4184, wh: 3600, w: 1, kw: 1000, pa: 1, kpa: 1000, bar: 100000, atm: 101325 };
    from = String(from || '').toLowerCase(); to = String(to || '').toLowerCase();
    if (from === 'c' && to === 'f') return v * 9 / 5 + 32;
    if (from === 'f' && to === 'c') return (v - 32) * 5 / 9;
    if (t[from] && t[to]) return v * t[from] / t[to];
    return null;
  }
  function addFileInput() {
    if (fileBox || !/画像|png|jpg|jpeg|webp|gif|svg|qr|pdf|exif|favicon|動画|音声|zip|ファイル|base64画像/i.test(title)) return;
    var host = input && input.parentElement ? input.parentElement : document.querySelector('main');
    fileBox = document.createElement('input');
    fileBox.type = 'file';
    fileBox.multiple = /一括|結合|zip/i.test(title);
    fileBox.accept = /音声/i.test(title) ? 'audio/*' : /動画/i.test(title) ? 'video/*' : /pdf/i.test(title) ? 'application/pdf' : /zip/i.test(title) ? '.zip' : 'image/*,.svg';
    fileBox.style.cssText = 'display:block;width:100%;margin-top:10px;padding:9px;border:1px solid #e0e7ff;border-radius:9px;background:#fff';
    fileBox.addEventListener('change', function () { selectedFiles = Array.from(fileBox.files || []); });
    host.appendChild(fileBox);
  }
  function readFile(file, asDataUrl) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject;
      asDataUrl ? r.readAsDataURL(file) : r.readAsText(file);
    });
  }
  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
  }
  async function imageProcess() {
    if (!selectedFiles.length && !getInput()) return null;
    if (/qrコード生成/i.test(title)) {
      var data = encodeURIComponent(getInput() || 'https://toaruseigyoya.github.io/tools/');
      var url = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + data;
      preview('<img alt="QRコード" src="' + url + '" style="max-width:220px;border:1px solid #e0e7ff;border-radius:8px">');
      return 'QRコード生成URL:\n' + url + '\n入力データ:\n' + decodeURIComponent(data);
    }
    var file = selectedFiles[0];
    if (!file) return null;
    var dataUrl = await readFile(file, true);
    if (/base64/i.test(title)) return dataUrl;
    if (/qr.*(読み取り|内容確認)|qrコード読み取り/i.test(title)) {
      var qrImage = await loadImage(dataUrl);
      preview('<img alt="preview" src="' + dataUrl + '" style="max-width:220px;border:1px solid #e0e7ff;border-radius:8px">');
      if ('BarcodeDetector' in window) {
        var detector = new BarcodeDetector({ formats: ['qr_code'] });
        var codes = await detector.detect(qrImage);
        if (codes.length) {
          return codes.map(function (code, i) {
            return 'QR ' + (i + 1) + ': ' + (code.rawValue || '');
          }).join('\n');
        }
        return 'QRコードは検出できませんでした。\n画像: ' + file.name + '\nサイズ: ' + qrImage.naturalWidth + 'x' + qrImage.naturalHeight;
      }
      return 'このブラウザはQR読み取りAPIに未対応です。\nChrome/Edge等で再確認してください。\n画像: ' + file.name + '\nサイズ: ' + qrImage.naturalWidth + 'x' + qrImage.naturalHeight;
    }
    if (/解像度|exif|読み取り/i.test(title)) {
      if (!/^image\//.test(file.type)) return file.name + '\n' + file.type + '\n' + file.size + ' bytes';
      var img = await loadImage(dataUrl);
      preview('<img alt="preview" src="' + dataUrl + '" style="max-width:220px;border:1px solid #e0e7ff;border-radius:8px">');
      return ['ファイル: ' + file.name, '種類: ' + file.type, 'サイズ: ' + file.size + ' bytes', '幅: ' + img.naturalWidth + ' px', '高さ: ' + img.naturalHeight + ' px'].join('\n');
    }
    if (/svg/.test(title.toLowerCase()) && file.type.indexOf('svg') !== -1) {
      var svg = await readFile(file, false);
      return svg.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').trim();
    }
    if (/画像|webp|png|jpg|jpeg|リサイズ|圧縮|形式|トリミング|余白|角丸|モザイク|ぼかし|favicon|サムネ|透過/i.test(title)) {
      var image = await loadImage(dataUrl);
      var w = parseInt(getA(), 10) || (/favicon/i.test(title) ? 64 : Math.min(image.naturalWidth, 900));
      var h = parseInt(getB(), 10) || Math.round(image.naturalHeight * (w / image.naturalWidth));
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      var ctx = canvas.getContext('2d');
      if (/余白/i.test(title)) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
      if (/ぼかし/i.test(title)) ctx.filter = 'blur(4px)';
      if (/モザイク/i.test(title)) {
        var small = document.createElement('canvas'), sctx = small.getContext('2d');
        small.width = Math.max(1, Math.floor(w / 12)); small.height = Math.max(1, Math.floor(h / 12));
        sctx.drawImage(image, 0, 0, small.width, small.height);
        ctx.imageSmoothingEnabled = false; ctx.drawImage(small, 0, 0, w, h);
      } else {
        ctx.drawImage(image, 0, 0, w, h);
      }
      var type = /webp/i.test(title) ? 'image/webp' : /png/i.test(title) ? 'image/png' : 'image/jpeg';
      var out = canvas.toDataURL(type, .82);
      preview('<img alt="preview" src="' + out + '" style="max-width:260px;border:1px solid #e0e7ff;border-radius:8px"><br><a download="' + slug + '" href="' + out + '">画像を保存</a>');
      return ['変換完了', '入力: ' + file.name + ' / ' + image.naturalWidth + 'x' + image.naturalHeight, '出力: ' + w + 'x' + h, '形式: ' + type, out].join('\n');
    }
    return null;
  }
  function preview(html) {
    var box = $('preview') || document.getElementById('toolEnhancedPreview');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toolEnhancedPreview';
      box.style.cssText = 'margin-top:12px;padding:12px;border:1px solid #e0e7ff;border-radius:10px;background:#fff';
      output.parentElement.appendChild(box);
    }
    box.innerHTML = html;
    box.style.display = 'block';
  }
  async function runEnhanced() {
    addFileInput();
    var s = getInput(), a = getA(), b = getB(), t = title;
    var media = await imageProcess();
    if (media != null) return setOut(media);
    try {
      if (/base64/i.test(t)) return setOut(base64(s, /decode|デコード|復号/i.test(a + ' ' + s) || /^[A-Za-z0-9+/=\s]+$/.test(s.trim())));
      if (/urlエンコード|urlデコード|url encode|url/i.test(t) && /エンコード|デコード/.test(t)) return setOut(/%[0-9a-f]{2}/i.test(s) ? decodeURIComponent(s) : encodeURIComponent(s));
      if (/htmlエスケープ|html特殊/i.test(t)) return setOut(/[<>&"]/.test(s) ? esc(s) : s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"'));
      if (/json/i.test(t) && /csv/i.test(t)) { var obj = JSON.parse(s); var arr = Array.isArray(obj) ? obj : [obj]; var keys = Array.from(new Set(arr.flatMap(function (o) { return Object.keys(o); }))); return setOut(toCsv([keys].concat(arr.map(function (o) { return keys.map(function (k) { return o[k] == null ? '' : o[k]; }); })))); }
      if (/csv/i.test(t) && /json/i.test(t)) { var rows = csvRows(s), head = rows.shift() || []; return setOut(JSON.stringify(rows.map(function (r) { var o = {}; head.forEach(function (h, i) { o[h] = r[i] || ''; }); return o; }), null, 2)); }
      if (/json/i.test(t)) return setOut(JSON.stringify(JSON.parse(s), null, /4/.test(a) ? 4 : 2));
      if (/csv|tsv|表|table|markdown表/i.test(t)) { var rows2 = /\\t/.test(s) ? lines(s).map(function (l) { return l.split('\\t'); }) : csvRows(s); return setOut(/markdown|md/i.test(t + a) ? table(rows2) : toCsv(rows2)); }
      if (/sql/i.test(t)) return setOut(s.replace(/\b(select|from|where|and|or|order by|group by|insert|update|delete|values|join|left join|inner join)\b/ig, '\n$1').replace(/\s+/g, ' ').replace(/\n /g, '\n').trim());
      if (/markdown.*html/i.test(t)) return setOut(lines(s).map(function (l) { return /^# /.test(l) ? '<h1>' + esc(l.slice(2)) + '</h1>' : /^## /.test(l) ? '<h2>' + esc(l.slice(3)) + '</h2>' : /^- /.test(l) ? '<li>' + esc(l.slice(2)) + '</li>' : '<p>' + esc(l) + '</p>'; }).join('\n'));
      if (/hash|sha|hmac/i.test(t)) return setOut(await sha(s, /512/.test(t) ? 'SHA-512' : 'SHA-256'));
      if (/crc32/i.test(t)) return setOut(crc32(s));
      if (/uuid/i.test(t)) return setOut(Array.from({ length: Math.max(1, nums(s)[0] || 5) }, function () { return crypto.randomUUID(); }).join('\n'));
      if (/正規|regex/i.test(t)) { var re = new RegExp(a || s.split('\n')[0] || '.', b || 'g'); return setOut((s.match(re) || []).join('\n') || '一致なし'); }
      if (/大文字|小文字/i.test(t)) return setOut(/lower|小文字/i.test(a) ? s.toLowerCase() : /title|先頭/i.test(a) ? s.toLowerCase().replace(/\b\w/g, function (m) { return m.toUpperCase(); }) : s.toUpperCase());
      if (/ひらがな|カタカナ/i.test(t)) return setOut(/[ァ-ヶ]/.test(s) ? s.replace(/[ァ-ヶ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0x60); }) : s.replace(/[ぁ-ゖ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) + 0x60); }));
      if (/改行削除|空行削除/i.test(t)) return setOut(lines(s).filter(function (l) { return !/空行/.test(t) || l.trim(); }).join(/削除/.test(t) && !/空行/.test(t) ? '' : '\n'));
      if (/重複行削除/i.test(t)) return setOut(Array.from(new Set(lines(s))).join('\n'));
      if (/重複行抽出/i.test(t)) { var seen = {}, dup = {}; lines(s).forEach(function (l) { seen[l] ? dup[l] = 1 : seen[l] = 1; }); return setOut(Object.keys(dup).join('\n')); }
      if (/差分/i.test(t)) { var p = s.split(/^---+$/m); var A = lines(p[0] || ''), B = lines(p[1] || a || ''); return setOut(B.filter(function (x) { return A.indexOf(x) < 0; }).map(function (x) { return '+ ' + x; }).concat(A.filter(function (x) { return B.indexOf(x) < 0; }).map(function (x) { return '- ' + x; })).join('\n')); }
      if (/文字数|バイト数/i.test(t)) return setOut('文字数: ' + s.length + '\n空白除外: ' + s.replace(/[\s　]/g, '').length + '\n行数: ' + (s ? lines(s).length : 0) + '\nUTF-8 bytes: ' + new TextEncoder().encode(s).length);
      if (/lorem|ダミー/i.test(t)) return setOut(Array.from({ length: nums(a)[0] || 3 }, function () { return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'; }).join('\n\n'));
      if (/タイムスタンプ/i.test(t)) { var n = nums(s)[0]; var d = n ? new Date(String(n).length === 10 ? n * 1000 : n) : new Date(s || Date.now()); return setOut(d.toISOString() + '\n' + d.toLocaleString()); }
      if (/進数|2進|16進|ascii/i.test(t)) { var num = parseInt(s, a || 10); return setOut('2進: ' + num.toString(2) + '\n10進: ' + num.toString(10) + '\n16進: ' + num.toString(16).toUpperCase()); }
      if (/カラー|色|contrast|コントラスト/i.test(t)) return setOut('入力色: ' + s + '\nCSS: color:' + s + ';\nRGB/HEXはブラウザのカラーピッカー結果として利用してください。');
      if (/単位|換算/i.test(t)) { var cv = unit(nums(s)[0] || 0, a, b); return setOut(cv == null ? '補助入力A/Bに単位を入れてください。例: m / km, c / f' : String(cv)); }
      if (/消費税|税/i.test(t)) { var price = nums(s)[0] || 0, rate = nums(a)[0] || 10; return setOut('税込: ' + Math.round(price * (1 + rate / 100)) + '\n税額: ' + Math.round(price * rate / 100)); }
      if (/bmi/i.test(t)) { var ns = nums(s + ' ' + a), h = ns[1] > 3 ? ns[1] / 100 : ns[1]; return setOut('BMI: ' + (ns[0] / (h * h)).toFixed(1)); }
      if (/日数|日付差/i.test(t)) return setOut(Math.round((new Date(a || b) - new Date(s)) / 86400000) + '日');
      if (/ローン/i.test(t)) { var N = nums(s + ' ' + a + ' ' + b), P = N[0] || 1000000, r = (N[1] || 1) / 100 / 12, m = (N[2] || 10) * 12; return setOut('月返済: ' + Math.round(P * r * Math.pow(1 + r, m) / (Math.pow(1 + r, m) - 1)).toLocaleString()); }
      if (/割り勘/i.test(t)) { var ns2 = nums(s + ' ' + a), total = ns2[0] || 0, people = ns2[1] || 1; return setOut('1人あたり: ' + Math.ceil(total / people).toLocaleString()); }
      if (/パスワード/i.test(t)) { var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!#$%&'; var len = nums(s)[0] || 16; return setOut(Array.from({ length: len }, function () { return chars[Math.floor(Math.random() * chars.length)]; }).join('')); }
      if (/メール|お礼|謝罪|催促|敬語|報告|議事録|文章|テンプレ/i.test(t)) return setOut(templateText(t, s));
      if (/whois/i.test(t)) return setOut('WHOIS確認URL:\nhttps://lookup.icann.org/en/lookup?name=' + encodeURIComponent(s.trim()));
      if (/url短縮/i.test(t)) return setOut('短縮URLは外部サービス連携が必要です。\n元URL:\n' + s + '\n候補slug: ' + slugify(s));
      if (/httpリクエスト/i.test(t)) return httpRequest(s, a);
      if (/読み上げ|tts/i.test(t)) { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(s)); return setOut('読み上げを開始しました。'); }
      if (/cron/i.test(t)) return setOut('入力Cron: ' + s + '\n例: */5 * * * * は5分ごとに実行');
      if (/タイマー|ポモドーロ|カウントダウン|ラップ/i.test(t)) return setOut('タイマー設定: ' + (nums(s)[0] || 25) + '分\n開始時刻: ' + new Date().toLocaleString());
      if (/zip/i.test(t)) return setOut('ブラウザのみでZIP処理するには専用ライブラリが必要です。\n選択ファイル数: ' + selectedFiles.length + '\nファイル一覧:\n' + selectedFiles.map(function (f) { return f.name + ' ' + f.size + 'bytes'; }).join('\n'));
      return setOut(s || ((window.TOOL && window.TOOL.desc) || title + 'の処理結果を表示します。'));
    } catch (e) {
      setOut('処理できませんでした: ' + e.message);
    }
  }
  function templateText(t, s) {
    var items = nonempty(s);
    if (/議事録/.test(t)) return '会議名: ' + (items[0] || '') + '\n日時:\n参加者:\n\n議題:\n- \n\n決定事項:\n- \n\nTODO:\n- [ ] ';
    if (/謝罪/.test(t)) return 'このたびは' + (items[0] || 'ご迷惑') + 'をおかけし、申し訳ございません。\n原因を確認のうえ、再発防止に努めます。';
    if (/お礼/.test(t)) return 'お世話になっております。\n' + (items[0] || 'ご対応') + 'いただき、ありがとうございます。';
    if (/催促/.test(t)) return 'お世話になっております。\n先日お願いしておりました件について、状況をご確認いただけますでしょうか。';
    return '件名: ' + (items[0] || 'ご確認のお願い') + '\n\nお世話になっております。\n' + items.join('\n') + '\n\nよろしくお願いいたします。';
  }
  function slugify(s) { return String(s || '').toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, ''); }
  async function httpRequest(url, method) {
    try {
      var res = await fetch(url, { method: method || 'GET' });
      setOut('Status: ' + res.status + '\n' + Array.from(res.headers.entries()).map(function (h) { return h[0] + ': ' + h[1]; }).join('\n') + '\n\n' + (await res.text()).slice(0, 2000));
    } catch (e) {
      setOut('ブラウザのCORS制限で送信できない可能性があります。\n\ncurl -i ' + (method ? '-X ' + method + ' ' : '') + '"' + url + '"\n\n' + e.message);
    }
  }
  function sampleEnhanced() {
    addFileInput();
    if (!input) return;
    if (/json/i.test(title)) input.value = '{"name":"sample","count":1}';
    else if (/csv|表/i.test(title)) input.value = 'name,value\na,1\nb,2';
    else if (/url|whois|http|qr/i.test(title)) input.value = 'https://example.com/?a=1&b=2';
    else if (/計算|税|bmi|ローン|割り勘|単位|日数/i.test(title)) input.value = '1000\n2026-05-04';
    else input.value = 'サンプル1\nサンプル2\nサンプル3';
    if (opt1 && !opt1.value) opt1.value = /単位/.test(title) ? 'm' : '';
    if (opt2 && !opt2.value) opt2.value = /単位/.test(title) ? 'km' : '';
    runEnhanced();
  }
  async function copyEnhanced() {
    try { await navigator.clipboard.writeText(output.value); }
    catch (e) { output.focus(); output.select(); document.execCommand('copy'); }
  }
  function downloadEnhanced() { downloadText(slug + '.txt', output.value); }

  window.run = runEnhanced;
  window.runTool = runEnhanced;
  window.sample = sampleEnhanced;
  window.loadSample = sampleEnhanced;
  window.copy = copyEnhanced;
  window.copyResult = copyEnhanced;
  window.download = downloadEnhanced;
  window.downloadResult = downloadEnhanced;
  addFileInput();
}());
