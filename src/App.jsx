// Публичный сайт Hakk Academy — самостоятельный статический сайт.
// Витрина открыта всем; полный каталог видеоуроков зашифрован и открывается
// подарочным кодом, который клиент получает после покупки пробного урока.
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Gift, Play, CircleCheck, Menu, X, ShieldCheck, ArrowRight,
} from 'lucide-react';
import { COPY } from './copy.js';
import { SITE, waLink, ytEmbed, ytThumb, ytPlaylist } from './config.js';
import { CATEGORIES } from './videos.js';

/* ── бренд-иконки (в lucide их нет) ── */
const WaIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.36.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23a8.18 8.18 0 0 1 5.82 2.41 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21z" />
  </svg>
);
const YtIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M21.58 7.19a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81zM10 15.02V8.98L15.2 12 10 15.02z" />
  </svg>
);
const IgIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const TgIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M21.9 4.3 18.7 19.4c-.24 1.06-.87 1.32-1.77.82l-4.9-3.6-2.36 2.27c-.26.26-.48.48-.98.48l.35-4.97 9.04-8.17c.4-.35-.08-.54-.6-.2L6.31 12.07l-4.8-1.5c-1.05-.33-1.07-1.05.22-1.55l18.8-7.24c.87-.32 1.63.2 1.37 2.52z" />
  </svg>
);


const getLang = () => { try { return localStorage.getItem('hakk_locale') === 'ru' ? 'ru' : 'kk'; } catch { return 'kk'; } };

function Logo() {
  const [broken, setBroken] = useState(false);
  if (broken) return <span className="s-logo-mark">H</span>;
  return <img className="s-logo-img" src="/logo.png" alt="Hakk Academy" onError={() => setBroken(true)} />;
}

/* ── шапка ── */
function Header({ c, lang, setLang }) {
  const [open, setOpen] = useState(false);
  const links = [['videos', c.nav.videos], ['platform', c.nav.platform], ['contact', c.nav.contact]];
  return (
    <header className="s-head">
      <div className="s-wrap s-head-in">
        <a href="#top" className="s-logo" onClick={() => setOpen(false)}>
          <Logo />
          <span>
            <span className="s-logo-name">Hakk Academy</span>
            <span className="s-logo-sub">{lang === 'ru' ? 'Коран · Таджвид · Арабский' : 'Құран · Тәжуид · Араб тілі'}</span>
          </span>
        </a>
        <nav className="s-menu">{links.map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}</nav>
        <div className="s-head-right">
          <div className="s-lang">
            <button className={lang === 'kk' ? 'on' : ''} onClick={() => setLang('kk')}>ҚАЗ</button>
            <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>РУС</button>
          </div>
          <a className="s-btn s-btn-wa s-btn-sm" href={waLink(c.waMessage)} target="_blank" rel="noreferrer">
            <WaIcon /> {c.cta.short}
          </a>
          <button className="s-burger" onClick={() => setOpen(!open)} aria-label="menu">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <div className={`s-drawer${open ? ' open' : ''}`}>
        {links.map(([id, t]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{t}</a>)}
        <a href={SITE.youtube} target="_blank" rel="noreferrer">YouTube</a>
        {SITE.platform && <a href={SITE.platform} target="_blank" rel="noreferrer">{c.cta.platform}</a>}
      </div>
    </header>
  );
}

/* ── плеер ── */
function Player({ video, c, onClose }) {
  useEffect(() => {
    if (!video) return;
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc); };
  }, [video, onClose]);
  if (!video) return null;
  return (
    <div className="s-modal" onClick={onClose}>
      <div className="s-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="s-modal-frame">
          <iframe src={`${ytEmbed(video.id)}&autoplay=1`} title={video.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
        <div className="s-modal-bar">
          <h3>{video.title}</h3>
          <a className="s-btn s-btn-wa s-btn-sm" href={waLink(c.waVideo(video.title))} target="_blank" rel="noreferrer"><WaIcon /> {c.cta.short}</a>
          <button className="s-modal-close" onClick={onClose} aria-label="close"><X /></button>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ v, lang, onPlay }) {
  return (
    <button className="s-video" onClick={() => onPlay(v)}>
      <div className="s-thumb">
        <img src={ytThumb(v.id)} alt="" loading="lazy" />
        <span className="s-play"><i><Play fill="currentColor" /></i></span>
        {v.dur && <span className="s-dur">{v.dur}</span>}
      </div>
      <h3>{v.title}</h3>
      <span>{CATEGORIES[v.cat]?.[lang] || ''}</span>
    </button>
  );
}

/* ── подвал ── */
function Footer({ c, lang }) {
  return (
    <footer className="s-foot" id="contact">
      <div className="s-wrap">
        <div className="s-foot-grid">
          <div>
            <div className="s-logo">
              <Logo />
              <span>
                <span className="s-logo-name">Hakk Academy</span>
                <span className="s-logo-sub">{lang === 'ru' ? 'Коран · Таджвид · Арабский' : 'Құран · Тәжуид · Араб тілі'}</span>
              </span>
            </div>
            <p>{c.footer.about}</p>
          </div>
          <div>
            <h4>{c.footer.menu}</h4>
            <ul>
              <li><a href="#videos">{c.nav.videos}</a></li>
              <li><a href="#platform">{c.nav.platform}</a></li>
              {SITE.platform && <li><a href={SITE.platform} target="_blank" rel="noreferrer">{c.footer.platformLink}</a></li>}
            </ul>
          </div>
          <div>
            <h4>{c.footer.contacts}</h4>
            <ul>
              <li><a className="s-foot-link" href={waLink(c.waMessage)} target="_blank" rel="noreferrer"><WaIcon /> {c.footer.wa}</a></li>
              <li><a className="s-foot-link" href={SITE.youtube} target="_blank" rel="noreferrer"><YtIcon /> {c.footer.yt}</a></li>
              {SITE.instagram && <li><a className="s-foot-link" href={`https://instagram.com/${SITE.instagram}`} target="_blank" rel="noreferrer"><IgIcon /> @{SITE.instagram}</a></li>}
              {SITE.telegram && <li><a className="s-foot-link" href={`https://t.me/${SITE.telegram}`} target="_blank" rel="noreferrer"><TgIcon /> @{SITE.telegram}</a></li>}
              {SITE.email && <li><a className="s-foot-link" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>}
            </ul>
          </div>
        </div>
        <div className="s-foot-bottom">
          <span>© {new Date().getFullYear()} Hakk Academy. {c.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [lang, setLangState] = useState(getLang);
  const [playing, setPlaying] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [cat, setCat] = useState('all');

  const c = COPY[lang] || COPY.kk;
  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem('hakk_locale', l); } catch { /* приватный режим */ }
    document.documentElement.lang = l;
  }, []);

  useEffect(() => {
    fetch('/lessons.json', { cache: 'no-cache' }).then((r) => r.json()).then(setLessons).catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'ru'
      ? 'Hakk Academy — Коран и арабский язык онлайн. Уроки в подарок'
      : 'Hakk Academy — Құран және араб тілі онлайн. Сабақтар сыйлыққа';
    document.querySelector('meta[name="description"]')?.setAttribute('content', c.hero.text);
  }, [lang, c]);

  const featured = SITE.heroVideo;
  const cats = useMemo(() => ['all', ...Object.keys(CATEGORIES).filter((k) => lessons.some((v) => v.cat === k))], [lessons]);
  const shown = useMemo(() => (cat === 'all' ? lessons : lessons.filter((v) => v.cat === cat)), [lessons, cat]);

  return (
    <div className="site" id="top">
      <Header c={c} lang={lang} setLang={setLang} />

      {/* hero */}
      <section className="s-hero">
        {SITE.heroImage && <div className="s-hero-photo" style={{ backgroundImage: `url(${SITE.heroImage})` }} />}
        <div className="s-hero-veil" />
        <div className="s-wrap s-hero-in">
          <div>
            <span className="s-badge"><Gift /> {c.hero.badge}</span>
            <h1>{c.hero.h1} <em>{c.hero.h1accent}</em></h1>
            <p className="lead">{c.hero.text}</p>
            <div className="s-hero-cta">
              <a className="s-btn s-btn-wa" href={waLink(c.waMessage)} target="_blank" rel="noreferrer"><WaIcon /> {c.cta.main}</a>
              <a className="s-btn s-btn-ghost" href="#videos"><Play /> {c.cta.videos}</a>
            </div>
            <p className="s-hero-note"><ShieldCheck /> {c.hero.note}</p>
          </div>
        </div>
      </section>

      <div className="s-wrap s-hero-under">
        {featured && (
          <figure className="s-hero-video" style={{ margin: 0 }}>
            <button className="s-video" onClick={() => setPlaying(featured)}>
              <div className="s-thumb">
                <img src={ytThumb(featured.id)} alt="" />
                <span className="s-play"><i><Play fill="currentColor" /></i></span>
              </div>
            </button>
            <figcaption><span>{c.hero.featured}</span>{featured.title}</figcaption>
          </figure>
        )}
      </div>

      {/* видеоуроки */}
      <section className="s-sec" id="videos">
        <div className="s-wrap">
          <div className="s-sec-head row">
            <div>
              <span className="s-tag">{c.videos.tag}</span>
              <h2>{c.videos.h}</h2>
              <p className="s-lead">{c.videos.text}</p>
            </div>
            <a className="s-btn s-btn-line s-btn-sm" href={SITE.youtube} target="_blank" rel="noreferrer"><YtIcon /> {c.videos.openYt}</a>
          </div>

          <div className="s-filters">
            {cats.map((k) => (
              <button key={k} className={cat === k ? 'on' : ''} onClick={() => setCat(k)}>
                {k === 'all' ? (lang === 'ru' ? 'Все' : 'Барлығы') : CATEGORIES[k][lang]}
              </button>
            ))}
          </div>

          <div className="s-videos">
            {shown.map((v) => <VideoCard key={v.id} v={v} lang={lang} onPlay={setPlaying} />)}
          </div>
          {!shown.length && <p className="s-lead">{c.videos.empty}</p>}

        </div>
      </section>

      {/* платформа */}
      <section className="s-sec alt" id="platform">
        <div className="s-wrap s-plat">
          <div>
            <span className="s-tag">{c.platform.tag}</span>
            <h2>{c.platform.h}</h2>
            <p className="s-lead">{c.platform.text}</p>
            <ul>{c.platform.items.map((i) => <li key={i}><CircleCheck /> {i}</li>)}</ul>
            {SITE.platform && (
              <a className="s-btn s-btn-primary" href={SITE.platform} target="_blank" rel="noreferrer">{c.cta.platform} <ArrowRight /></a>
            )}
          </div>
          <div className="s-plat-art">
            <p className="s-plat-ayah">ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ</p>
            <p className="s-plat-tr">{lang === 'ru' ? '«Читай во имя Господа твоего, Который сотворил»' : '«Жаратқан Раббыңның атымен оқы»'}</p>
            <p className="s-plat-src">{lang === 'ru' ? 'Сура Аляк, аят 1' : 'Аляқ сүресі, 1-аят'}</p>
          </div>
        </div>
      </section>

      <Footer c={c} lang={lang} />

      <div className="s-sticky">
        <a className="s-btn s-btn-wa" href={waLink(c.waMessage)} target="_blank" rel="noreferrer"><WaIcon /> {c.cta.main}</a>
      </div>
      <Player video={playing} c={c} onClose={() => setPlaying(null)} />
    </div>
  );
}
