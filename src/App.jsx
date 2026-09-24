// Hakk Academy — видеотека в оформлении YouTube: верхняя панель с поиском,
// боковое меню, сетка карточек и страница просмотра с плеером.
// Экраны адресуются хешем: #/c/tafsir, #/v/<id>.
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search, ArrowLeft, House, BookOpen, Menu as MenuIcon, X, Play,
  Sparkles, MoonStar, ListChecks, ScrollText, Headphones, Globe, Info,
} from 'lucide-react';
import { COPY, CAT_ORDER } from './copy.js';
import { SITE, waLink, ytEmbed, ytThumb, ytWatch } from './config.js';

/* ── бренд-иконки ── */
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

const CAT_ICON = { tafsir: BookOpen, asma: Sparkles, namaz: MoonStar, quran: ScrollText, mothers: Headphones, other: ListChecks };
const getLang = () => { try { return localStorage.getItem('hakk_locale') === 'ru' ? 'ru' : 'kk'; } catch { return 'kk'; } };

const parseHash = () => {
  const h = window.location.hash.replace(/^#\/?/, '');
  const [screen, id] = h.split('/');
  if (screen === 'c' && id) return { screen: 'cat', id };
  if (screen === 'v' && id) return { screen: 'video', id };
  if (['search', 'menu'].includes(screen)) return { screen };
  return { screen: 'home' };
};

/* ── карточка урока ── */
function Card({ v, c, row }) {
  return (
    <a className={`card${row ? ' row' : ''}`} href={`#/v/${v.id}`}>
      <span className="thumb">
        <img src={ytThumb(v.id)} alt="" loading="lazy" />
        {v.dur && <i className="dur">{v.dur}</i>}
      </span>
      <span className="card-b">
        {!row && <img className="ava" src="/logo.png" alt="" />}
        <span className="card-t">
          <span className="c-title">{v.title}</span>
          <span className="c-meta">Hakk Academy</span>
          <span className="c-meta">{c.cats[v.cat]?.t} · {v.dur}</span>
        </span>
      </span>
    </a>
  );
}

const Chips = ({ c, active, onPick }) => (
  <div className="chips">
    <button className={active === 'all' ? 'on' : ''} onClick={() => onPick('all')}>{c.chips.all}</button>
    {CAT_ORDER.map((k) => (
      <button key={k} className={active === k ? 'on' : ''} onClick={() => onPick(k)}>{c.cats[k].t}</button>
    ))}
  </div>
);

/* ── экраны ── */
function Grid({ items, c, empty }) {
  if (!items.length) return <p className="muted pad-y">{empty}</p>;
  return <div className="grid">{items.map((v) => <Card key={v.id} v={v} c={c} />)}</div>;
}

function Home({ c, lessons, cat, setCat }) {
  const items = useMemo(() => (cat === 'all' ? lessons : lessons.filter((v) => v.cat === cat)), [lessons, cat]);
  return (
    <>
      <div className="ch-banner">
        <img src="/logo.png" alt="" />
        <div>
          <h1>Hakk Academy</h1>
          <p>{c.home.sub}</p>
          <span>{c.brand.sub}</span>
        </div>
        <a className="btn btn-wa" href={waLink(c.waMessage)} target="_blank" rel="noreferrer"><WaIcon /> {c.home.cta}</a>
      </div>
      <Chips c={c} active={cat} onPick={setCat} />
      <Grid items={items} c={c} empty={c.empty} />
    </>
  );
}

function Category({ c, id, lessons }) {
  const cat = c.cats[id];
  const items = useMemo(() => lessons.filter((v) => v.cat === id), [lessons, id]);
  if (!cat) return <p className="muted pad-y">{c.nothing}</p>;
  return (
    <>
      <div className="cat-head">
        <h1>{cat.t}</h1>
        <p>{cat.d}</p>
        <span className="count">{c.count(items.length)}</span>
      </div>
      <Grid items={items} c={c} empty={c.empty} />
    </>
  );
}

function Watch({ c, id, lessons }) {
  const [playing, setPlaying] = useState(false);
  const v = lessons.find((x) => x.id === id);
  useEffect(() => { setPlaying(false); window.scrollTo(0, 0); }, [id]);
  if (!v) return <p className="muted pad-y">{c.nothing}</p>;

  const same = lessons.filter((x) => x.cat === v.cat && x.id !== v.id);
  const rest = [...same, ...lessons.filter((x) => x.cat !== v.cat)].slice(0, 12);

  return (
    <div className="watch">
      <div className="watch-main">
        <div className="player">
          {playing ? (
            <iframe src={`${ytEmbed(v.id)}&autoplay=1`} title={v.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          ) : (
            <button className="player-cover" onClick={() => setPlaying(true)} aria-label={v.title}>
              <img src={ytThumb(v.id)} alt="" />
              <span className="play"><Play fill="currentColor" /></span>
            </button>
          )}
        </div>

        <h1 className="w-title">{v.title}</h1>

        <div className="channel">
          <img className="ava lg" src="/logo.png" alt="" />
          <span className="channel-i">
            <b>Hakk Academy</b>
            <i>{c.count(lessons.length)}</i>
          </span>
          <a className="btn btn-dark" href={SITE.youtube} target="_blank" rel="noreferrer"><YtIcon /> {c.video.subscribe}</a>
          <a className="btn btn-wa" href={waLink(c.waMessage)} target="_blank" rel="noreferrer"><WaIcon /> {c.home.cta}</a>
        </div>

        <div className="desc">
          <b>{v.dur} · {c.cats[v.cat]?.t}</b>
          <p>{c.about(c.cats[v.cat]?.t || '', v.dur || '')}</p>
          <a className="desc-link" href={ytWatch(v.id)} target="_blank" rel="noreferrer">{c.video.openYt} →</a>
        </div>
      </div>

      <aside className="watch-side">
        <h2>{c.video.list}</h2>
        {rest.map((x) => <Card key={x.id} v={x} c={c} row />)}
      </aside>
    </div>
  );
}

function SearchScreen({ c, lessons }) {
  const [q, setQ] = useState('');
  const found = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? lessons.filter((v) => v.title.toLowerCase().includes(s)) : lessons;
  }, [q, lessons]);
  return (
    <>
      <label className="search wide">
        <Search />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.home.search} autoFocus aria-label={c.home.search} />
      </label>
      <p className="count mt">{c.count(found.length)}</p>
      <Grid items={found} c={c} empty={c.nothing} />
    </>
  );
}

function MenuScreen({ c, lang, setLang }) {
  return (
    <div className="menu-screen">
      <h1 className="w-title">{c.menu.title}</h1>
      <div className="menu-list">
        <a href={SITE.youtube} target="_blank" rel="noreferrer"><span className="mi"><YtIcon /></span>{c.menu.channel}</a>
        <a href={waLink(c.waMessage)} target="_blank" rel="noreferrer"><span className="mi"><WaIcon /></span>{c.menu.write}</a>
        {SITE.platform && <a href={SITE.platform} target="_blank" rel="noreferrer"><span className="mi"><Globe /></span>{c.menu.platform}</a>}
        <div className="lang-row">
          <span className="mi"><Globe /></span>{c.menu.lang}
          <span className="lang">
            <button className={lang === 'kk' ? 'on' : ''} onClick={() => setLang('kk')}>ҚАЗ</button>
            <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>РУС</button>
          </span>
        </div>
      </div>
      <div className="desc">
        <b><Info size={15} /> {c.menu.about}</b>
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
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [side, setSide] = useState(false);

  const c = COPY[lang] || COPY.kk;
  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem('hakk_locale', l); } catch { /* приватный режим */ }
  }, []);

  useEffect(() => {
    fetch('/lessons.json', { cache: 'no-cache' }).then((r) => r.json()).then(setLessons).catch(() => {});
  }, []);
  useEffect(() => {
    const h = () => { setRoute(parseHash()); setSide(false); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'ru' ? 'Hakk Academy — видеоуроки' : 'Hakk Academy — видеосабақтар';
  }, [lang]);

  const counts = useMemo(() => lessons.reduce((a, v) => ({ ...a, [v.cat]: (a[v.cat] || 0) + 1 }), {}), [lessons]);
  const { screen, id } = route;
  const searchHits = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? lessons.filter((v) => v.title.toLowerCase().includes(s)) : null;
  }, [q, lessons]);

  const sideItems = [
    { key: 'home', icon: House, label: c.nav.home, href: '#/' },
    ...CAT_ORDER.filter((k) => counts[k]).map((k) => ({ key: k, icon: CAT_ICON[k], label: c.cats[k].t, href: `#/c/${k}` })),
  ];

  return (
    <div className="yt">
      <header className="top">
        <button className="ico" onClick={() => setSide(!side)} aria-label={c.nav.menu}>{side ? <X /> : <MenuIcon />}</button>
        <a className="logo" href="#/">
          <img src="/logo.png" alt="" />
          <span><b>HAKK</b><i>ACADEMY</i></span>
        </a>

        <label className="search top-search">
          <Search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.home.search} aria-label={c.home.search} />
          {q && <button className="ico sm" onClick={() => setQ('')} aria-label="×"><X /></button>}
        </label>

        <div className="top-right">
          <span className="lang">
            <button className={lang === 'kk' ? 'on' : ''} onClick={() => setLang('kk')}>ҚАЗ</button>
            <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>РУС</button>
          </span>
          <a className="btn btn-wa sm-hide" href={waLink(c.waMessage)} target="_blank" rel="noreferrer"><WaIcon /> {c.home.cta}</a>
        </div>
      </header>

      <div className="body">
        <aside className={`side${side ? ' open' : ''}`}>
          {sideItems.map((it) => {
            const Ic = it.icon || BookOpen;
            const on = (screen === 'home' && it.key === 'home') || (screen === 'cat' && id === it.key);
            return (
              <a key={it.key} href={it.href} className={on ? 'on' : ''}>
                <Ic /><span>{it.label}</span>
                {counts[it.key] ? <em>{counts[it.key]}</em> : null}
              </a>
            );
          })}
          <hr />
          <a href={SITE.youtube} target="_blank" rel="noreferrer"><YtIcon /><span>{c.menu.channel}</span></a>
          <a href={waLink(c.waMessage)} target="_blank" rel="noreferrer"><WaIcon /><span>{c.menu.write}</span></a>
        </aside>
        {side && <div className="scrim" onClick={() => setSide(false)} />}

        <main>
          {searchHits ? (
            <>
              <p className="count">{c.count(searchHits.length)}</p>
              <Grid items={searchHits} c={c} empty={c.nothing} />
            </>
          ) : (
            <>
              {screen === 'home' && <Home c={c} lessons={lessons} cat={cat} setCat={setCat} />}
              {screen === 'cat' && <Category c={c} id={id} lessons={lessons} />}
              {screen === 'video' && <Watch c={c} id={id} lessons={lessons} />}
              {screen === 'search' && <SearchScreen c={c} lessons={lessons} />}
              {screen === 'menu' && <MenuScreen c={c} lang={lang} setLang={setLang} />}
            </>
          )}
        </main>
      </div>

      <nav className="tabs">
        <a href="#/" className={screen === 'home' ? 'on' : ''}><House /><span>{c.nav.home}</span></a>
        <a href="#/search" className={screen === 'search' ? 'on' : ''}><Search /><span>{c.nav.search}</span></a>
        <a href={waLink(c.waMessage)} target="_blank" rel="noreferrer"><WaIcon /><span>WhatsApp</span></a>
        <a href="#/menu" className={screen === 'menu' ? 'on' : ''}><MenuIcon /><span>{c.nav.menu}</span></a>
      </nav>
    </div>
  );
}
