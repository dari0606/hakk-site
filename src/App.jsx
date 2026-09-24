// Hakk Academy — сайт в виде приложения: главная с разделами, список уроков,
// страница урока, поиск и меню. Экраны переключаются через хеш в адресе,
// поэтому ссылкой можно поделиться: #/c/tafsir, #/v/<id>.
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search, ChevronLeft, ChevronRight, House, BookOpen, Menu as MenuIcon, Play,
  Sparkles, MoonStar, ListChecks, ScrollText, Headphones, Globe, MessageSquare,
  Info, ExternalLink, Clock,
} from 'lucide-react';
import { COPY, CAT_ORDER } from './copy.js';
import { SITE, waLink, ytEmbed, ytThumb, ytWatch } from './config.js';

/* ── бренд-иконки ── */
const WaIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.43 12.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.36.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
  </svg>
);
const YtIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M21.58 7.19a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81zM10 15.02V8.98L15.2 12 10 15.02z" />
  </svg>
);

const CAT_ICON = { tafsir: BookOpen, asma: Sparkles, namaz: MoonStar, quran: ScrollText, mothers: Headphones, other: ListChecks };

const secs = (d = '') => { const p = d.split(':').map(Number); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p.length === 2 ? p[0] * 60 + p[1] : 0; };
const getLang = () => { try { return localStorage.getItem('hakk_locale') === 'ru' ? 'ru' : 'kk'; } catch { return 'kk'; } };

/* ── маршрут в адресной строке ── */
const parseHash = () => {
  const h = window.location.hash.replace(/^#\/?/, '');
  const [screen, id] = h.split('/');
  if (screen === 'c' && id) return { screen: 'cat', id };
  if (screen === 'v' && id) return { screen: 'video', id };
  if (['lessons', 'search', 'menu'].includes(screen)) return { screen };
  return { screen: 'home' };
};
const go = (path) => { window.location.hash = path; };

/* ── шапка ── */
function Brand({ c, small }) {
  return (
    <a className={`brand${small ? ' sm' : ''}`} href="#/" aria-label="Hakk Academy">
      <span className="brand-top">{c.brand.top}</span>
      <span className="brand-bottom">{c.brand.bottom}</span>
    </a>
  );
}

function TopBar({ c, title, back, right }) {
  return (
    <div className="topbar">
      {back ? (
        <button className="icon-btn" onClick={() => (window.history.length > 1 ? window.history.back() : go('/'))} aria-label="назад"><ChevronLeft /></button>
      ) : <Brand c={c} />}
      {title && <span className="topbar-title">{title}</span>}
      <div className="topbar-right">{right}</div>
    </div>
  );
}

/* ── строка урока в списке ── */
function LessonRow({ v, c, lang }) {
  return (
    <a className="row" href={`#/v/${v.id}`}>
      <span className="row-thumb">
        <img src={ytThumb(v.id)} alt="" loading="lazy" />
        {v.dur && <i className="dur">{v.dur}</i>}
      </span>
      <span className="row-body">
        <span className="row-title">{v.title}</span>
        <span className="row-meta"><Clock size={13} /> {v.dur} · {c.cats[v.cat]?.t}</span>
      </span>
      <ChevronRight className="row-arrow" />
    </a>
  );
}

/* ── экраны ── */
function Home({ c, lang, lessons, counts }) {
  const [q, setQ] = useState('');
  const found = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? lessons.filter((v) => v.title.toLowerCase().includes(s)) : [];
  }, [q, lessons]);

  return (
    <>
      <div className="hero">
        <div className="hero-img" style={{ backgroundImage: `url(${SITE.heroImage})` }} />
        <div className="hero-in">
          <h1>{c.home.hi1}<br />{c.home.hi2}</h1>
          <p>{c.home.sub}</p>
        </div>
      </div>

      <div className="pad">
        <label className="search">
          <Search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.home.search} aria-label={c.home.search} />
        </label>

        {q.trim() ? (
          <div className="list mt">
            {found.length ? found.map((v) => <LessonRow key={v.id} v={v} c={c} lang={lang} />) : <p className="muted pad-y">{c.nothing}</p>}
          </div>
        ) : (
          <div className="tiles">
            {CAT_ORDER.filter((k) => counts[k]).map((k) => {
              const Ic = CAT_ICON[k] || BookOpen;
              return (
                <a className="tile" key={k} href={`#/c/${k}`}>
                  <span className="tile-ic"><Ic /></span>
                  <span className="tile-t">{c.cats[k].t}</span>
                  <span className="tile-n">{c.count(counts[k])}</span>
                  <ChevronRight className="tile-arrow" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function Category({ c, lang, id, lessons }) {
  const [chip, setChip] = useState('all');
  const cat = c.cats[id];
  const list = useMemo(() => {
    const base = lessons.filter((v) => v.cat === id);
    if (chip === 'longest') return [...base].sort((a, b) => secs(b.dur) - secs(a.dur));
    if (chip === 'shortest') return [...base].sort((a, b) => secs(a.dur) - secs(b.dur));
    return base;
  }, [lessons, id, chip]);

  if (!cat) return <div className="pad"><p className="muted pad-y">{c.nothing}</p></div>;

  return (
    <>
      <div className="banner">
        <div className="hero-img" style={{ backgroundImage: `url(${SITE.heroImage})` }} />
        <button className="icon-btn ghost banner-back" onClick={() => go('/')} aria-label="назад"><ChevronLeft /></button>
        <div className="banner-in"><h2>{cat.t}</h2></div>
      </div>

      <div className="pad">
        <p className="lead">{cat.d}</p>
        <div className="chips">
          {['all', 'longest', 'shortest'].map((k) => (
            <button key={k} className={chip === k ? 'on' : ''} onClick={() => setChip(k)}>{c.chips[k]}</button>
          ))}
        </div>
        <p className="count">{c.count(list.length)}</p>
        <div className="list">
          {list.length ? list.map((v) => <LessonRow key={v.id} v={v} c={c} lang={lang} />) : <p className="muted pad-y">{c.empty}</p>}
        </div>
      </div>
    </>
  );
}

function Video({ c, lang, id, lessons }) {
  const [playing, setPlaying] = useState(false);
  const v = lessons.find((x) => x.id === id);
  useEffect(() => { setPlaying(false); window.scrollTo(0, 0); }, [id]);
  if (!v) return <div className="pad"><p className="muted pad-y">{c.nothing}</p></div>;

  const same = lessons.filter((x) => x.cat === v.cat);
  const idx = same.findIndex((x) => x.id === v.id);
  const rest = [...same.slice(idx + 1), ...same.slice(0, idx)];

  return (
    <>
      <div className="player">
        {playing ? (
          <iframe src={`${ytEmbed(v.id)}&autoplay=1`} title={v.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button className="player-cover" onClick={() => setPlaying(true)} aria-label={v.title}>
            <img src={ytThumb(v.id)} alt="" />
            <span className="play"><Play fill="currentColor" /></span>
            {v.dur && <i className="dur">{v.dur}</i>}
          </button>
        )}
      </div>

      <div className="pad">
        <h2 className="v-title">{v.title}</h2>
        <p className="row-meta"><Clock size={13} /> {v.dur} · {c.cats[v.cat]?.t} · Hakk Academy</p>

        <a className="btn btn-primary wide" href={ytWatch(v.id)} target="_blank" rel="noreferrer">
          <YtIcon /> {c.video.openYt} <ExternalLink size={15} />
        </a>

        <div className="card soft">
          <h3>{c.video.about}</h3>
          <p>{c.about(c.cats[v.cat]?.t || '', v.dur || '')}</p>
        </div>

        {!!rest.length && (
          <>
            <div className="sec-head">
              <h3>{c.video.list}</h3>
              <a href={`#/v/${rest[0].id}`}>{c.video.next} <ChevronRight size={15} /></a>
            </div>
            <div className="list">{rest.slice(0, 8).map((x) => <LessonRow key={x.id} v={x} c={c} lang={lang} />)}</div>
          </>
        )}
      </div>
    </>
  );
}

function AllLessons({ c, lang, lessons, counts }) {
  return (
    <div className="pad">
      <h2 className="screen-title">{c.menu.lessons}</h2>
      <div className="tiles">
        {CAT_ORDER.filter((k) => counts[k]).map((k) => {
          const Ic = CAT_ICON[k] || BookOpen;
          return (
            <a className="tile" key={k} href={`#/c/${k}`}>
              <span className="tile-ic"><Ic /></span>
              <span className="tile-t">{c.cats[k].t}</span>
              <span className="tile-n">{c.count(counts[k])}</span>
              <ChevronRight className="tile-arrow" />
            </a>
          );
        })}
      </div>
      <div className="list mt">{lessons.map((v) => <LessonRow key={v.id} v={v} c={c} lang={lang} />)}</div>
    </div>
  );
}

function SearchScreen({ c, lang, lessons }) {
  const [q, setQ] = useState('');
  const found = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? lessons.filter((v) => v.title.toLowerCase().includes(s)) : lessons;
  }, [q, lessons]);
  return (
    <div className="pad">
      <h2 className="screen-title">{c.searchTitle}</h2>
      <label className="search">
        <Search />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.home.search} autoFocus aria-label={c.home.search} />
      </label>
      <p className="count">{c.count(found.length)}</p>
      <div className="list">
        {found.length ? found.map((v) => <LessonRow key={v.id} v={v} c={c} lang={lang} />) : <p className="muted pad-y">{c.nothing}</p>}
      </div>
    </div>
  );
}

function MenuScreen({ c, lang, setLang }) {
  const items = [
    { icon: BookOpen, label: c.menu.lessons, href: '#/lessons' },
    { icon: YtIcon, label: c.menu.channel, href: SITE.youtube, out: true },
    { icon: WaIcon, label: c.menu.write, href: waLink(c.waMessage), out: true },
    ...(SITE.platform ? [{ icon: Globe, label: c.menu.platform, href: SITE.platform, out: true }] : []),
  ];
  return (
    <div className="pad">
      <h2 className="screen-title">{c.menu.title}</h2>

      <div className="card profile">
        <span className="profile-ic"><Brand c={c} small /></span>
        <span>
          <b>Hakk Academy</b>
          <i>{c.brand.sub}</i>
        </span>
      </div>

      <div className="menu-list">
        {items.map((it) => {
          const Ic = it.icon;
          return (
            <a key={it.label} href={it.href} {...(it.out ? { target: '_blank', rel: 'noreferrer' } : {})}>
              <span className="menu-ic"><Ic /></span>{it.label}<ChevronRight className="menu-arrow" />
            </a>
          );
        })}
      </div>

      <div className="menu-list">
        <div className="lang-row">
          <span className="menu-ic"><Globe /></span>{c.menu.lang}
          <span className="lang">
            <button className={lang === 'kk' ? 'on' : ''} onClick={() => setLang('kk')}>ҚАЗ</button>
            <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>РУС</button>
          </span>
        </div>
      </div>

      <div className="card soft">
        <h3><Info size={16} /> {c.menu.about}</h3>
        <p>{c.menu.aboutText}</p>
      </div>

      <p className="copyright">© {new Date().getFullYear()} Hakk Academy. {c.rights}</p>
    </div>
  );
}

/* ── приложение ── */
export default function App() {
  const [lang, setLangState] = useState(getLang);
  const [lessons, setLessons] = useState([]);
  const [route, setRoute] = useState(parseHash);

  const c = COPY[lang] || COPY.kk;
  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem('hakk_locale', l); } catch { /* приватный режим */ }
  }, []);

  useEffect(() => {
    fetch('/lessons.json', { cache: 'no-cache' }).then((r) => r.json()).then(setLessons).catch(() => {});
  }, []);
  useEffect(() => {
    const h = () => { setRoute(parseHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'ru'
      ? 'Hakk Academy — Коран и арабский язык онлайн'
      : 'Hakk Academy — Құран және араб тілі онлайн';
  }, [lang]);

  const counts = useMemo(() => lessons.reduce((a, v) => ({ ...a, [v.cat]: (a[v.cat] || 0) + 1 }), {}), [lessons]);
  const { screen, id } = route;

  const tabs = [
    { key: 'home', icon: House, label: c.nav.home, href: '#/' },
    { key: 'lessons', icon: BookOpen, label: c.nav.lessons, href: '#/lessons' },
    { key: 'search', icon: Search, label: c.nav.search, href: '#/search' },
    { key: 'menu', icon: MenuIcon, label: c.nav.menu, href: '#/menu' },
  ];
  const activeTab = screen === 'cat' || screen === 'video' ? 'lessons' : screen;

  return (
    <div className="app">
      <div className="shell">
        {screen !== 'home' && screen !== 'cat' && (
          <TopBar c={c} back={screen === 'video'} right={screen === 'menu' ? null : (
            <a className="icon-btn" href="#/menu" aria-label={c.nav.menu}><MenuIcon /></a>
          )} />
        )}
        {screen === 'home' && (
          <TopBar c={c} right={<a className="icon-btn" href="#/menu" aria-label={c.nav.menu}><MenuIcon /></a>} />
        )}

        <main>
          {screen === 'home' && <Home c={c} lang={lang} lessons={lessons} counts={counts} />}
          {screen === 'cat' && <Category c={c} lang={lang} id={id} lessons={lessons} />}
          {screen === 'video' && <Video c={c} lang={lang} id={id} lessons={lessons} />}
          {screen === 'lessons' && <AllLessons c={c} lang={lang} lessons={lessons} counts={counts} />}
          {screen === 'search' && <SearchScreen c={c} lang={lang} lessons={lessons} />}
          {screen === 'menu' && <MenuScreen c={c} lang={lang} setLang={setLang} />}
        </main>

        <nav className="tabbar">
          {tabs.map((t) => {
            const Ic = t.icon;
            return (
              <a key={t.key} href={t.href} className={activeTab === t.key ? 'on' : ''}>
                <Ic /><span>{t.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
