// Проверяет, какие уроки действительно открываются у посетителя.
// Приватные видео помечаются "private": true и на сайт не попадают.
// Запуск: npm run check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'data/lessons.json');
const lessons = JSON.parse(fs.readFileSync(file, 'utf8'));

const check = async (v) => {
  const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.id}&format=json`)
    .catch(() => null);
  return { ...v, ok: !!r && r.ok };
};

const results = [];
for (let i = 0; i < lessons.length; i += 10) {
  results.push(...await Promise.all(lessons.slice(i, i + 10).map(check)));
}

const closed = results.filter((r) => !r.ok);
fs.writeFileSync(file, JSON.stringify(results.map(({ ok, ...v }) => (ok ? { ...v, private: undefined } : { ...v, private: true }))
  .map((v) => JSON.parse(JSON.stringify(v))), null, 2) + '\n');

console.log(`Ашық: ${results.length - closed.length} · жабық: ${closed.length}`);
if (closed.length) {
  console.log('\nYouTube-та жабық (клиент көре алмайды):');
  for (const v of closed) console.log(`  https://youtu.be/${v.id}  ${v.title}`);
  console.log('\nОларды YouTube-та «Доступ по ссылке» (Unlisted) етіп қойыңыз, сосын: npm run check && npm run build');
}
