// Забирает новые видео с канала и дописывает их в data/lessons.json.
// Запуск вручную: npm run sync
// Автоматически: .github/workflows/youtube-sync.yml раз в сутки.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(root, 'data/lessons.json');
const CHANNEL = process.env.YT_CHANNEL_ID || 'UCxOw4gHztFswqyl0ee-vx8w';
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL}`;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

/** Раздел подбирается по названию — те же правила, что и на сайте. */
function guessCategory(title = '') {
  const t = title.toLowerCase();
  if (t.includes('тәпсір') || t.includes('тафсир') || t.includes('сүресі')) return 'tafsir';
  if (t.includes('асма') || t.includes('хусна') || t.includes('есімі')) return 'asma';
  if (t.includes('намаз') || t.includes('ракағат') || t.includes('дәрет')) return 'namaz';
  if (t.includes('анамыз') || t.includes('аналары') || t.includes('бинт')) return 'mothers';
  if (t.includes('әліпби') || t.includes('тәжуид') || t.includes('құранға түсу') || t.includes('харакат')) return 'quran';
  return 'other';
}

const unescapeXml = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, '&');

const hhmmss = (sec) => {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
};

/** Длительность и доступность берём со страницы видео — в RSS их нет. */
async function details(id) {
  try {
    const html = await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { 'user-agent': UA, 'accept-language': 'ru' } }).then((r) => r.text());
    const len = html.match(/"lengthSeconds":"(\d+)"/);
    const embed = html.match(/"playableInEmbed":(true|false)/);
    const live = /"isLiveContent":true/.test(html) && /"isLive":true/.test(html);
    return {
      dur: len ? hhmmss(Number(len[1])) : '',
      seconds: len ? Number(len[1]) : 0,
      blocked: embed ? embed[1] === 'false' : false,
      live,
    };
  } catch {
    return { dur: '', seconds: 0, blocked: false, live: false };
  }
}

const lessons = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const known = new Set(lessons.map((l) => l.id));

const xml = await fetch(FEED, { headers: { 'user-agent': UA } }).then((r) => r.text());
const entries = (xml.match(/<entry>[\s\S]*?<\/entry>/g) || []).map((e) => {
  const id = (e.match(/<yt:videoId>(.*?)<\/yt:videoId>/) || [])[1];
  const title = unescapeXml((e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim();
  const short = ((e.match(/<link rel="alternate" href="([^"]+)"/) || [])[1] || '').includes('/shorts/');
  return { id, title, short };
}).filter((v) => v.id);

const fresh = [];
const skipped = [];
for (const v of entries) {
  if (known.has(v.id)) continue;
  if (v.short) { skipped.push([v.title, 'shorts']); continue; }
  const d = await details(v.id);
  if (d.seconds && d.seconds < 90) { skipped.push([v.title, 'короткое, меньше 1,5 минут']); continue; }
  if (d.blocked) { skipped.push([v.title, 'встраивание запрещено']); continue; }
  fresh.push({ id: v.id, cat: guessCategory(v.title), dur: d.dur, title: v.title });
}

if (fresh.length) {
  fs.writeFileSync(FILE, JSON.stringify([...fresh, ...lessons], null, 2) + '\n');
  console.log(`Жаңа сабақ: ${fresh.length}`);
  for (const f of fresh) console.log(`  + [${f.cat}] ${f.dur}  ${f.title}`);
} else {
  console.log('Жаңа сабақ жоқ.');
}
for (const [t, why] of skipped) console.log(`  – ${t.slice(0, 50)} (${why})`);
