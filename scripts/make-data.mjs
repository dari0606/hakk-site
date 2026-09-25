// Готовит public/lessons.json — каталог видеоуроков для сайта.
// Уроки, закрытые на YouTube (private), в сайт не попадают: их проверяет npm run check.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const all = JSON.parse(fs.readFileSync(path.join(root, 'data/lessons.json'), 'utf8'));
const closed = all.filter((l) => l.private);
const hidden = all.filter((l) => l.hidden && !l.private);
const open = all.filter((l) => !l.private && !l.hidden).map(({ id, cat, dur, title }) => ({ id, cat, dur, title }));

fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/lessons.json'), JSON.stringify(open));

// книги и рабочие тетради — отдельный каталог, правится в data/books.json
const booksFile = path.join(root, 'data/books.json');
const books = fs.existsSync(booksFile) ? JSON.parse(fs.readFileSync(booksFile, 'utf8')) : [];
fs.writeFileSync(path.join(root, 'public/books.json'), JSON.stringify(books));
console.log(`lessons.json: ${open.length} сабақ сайтта.`);
console.log(`books.json: ${books.length} кітап/дәптер.`);
if (closed.length) console.log(`⚠  ${closed.length} сабақ YouTube-та жабық, кірмеді. Тізімі: npm run check`);
if (hidden.length) console.log(`ℹ  ${hidden.length} сабақ қолмен жасырылған ("hidden": true).`);
