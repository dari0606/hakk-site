// Рисованные иконки разделов в лавандовой гамме — как в макете.
const P = { dark: '#6a5cc4', mid: '#9b8ce0', soft: '#c9c0ef', pale: '#e8e3fa', ink: '#4b3fa0' };

export const IcQuranOpen = (p) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden {...p}>
    <path d="M6 44V17c0-1.5 1.3-2.6 2.8-2.4C15 15.4 24 17.8 30 22v26c-6-4-14.5-6.3-21-7.2A2.4 2.4 0 0 1 6 44z" fill={P.soft} />
    <path d="M58 44V17c0-1.5-1.3-2.6-2.8-2.4C49 15.4 40 17.8 34 22v26c6-4 14.5-6.3 21-7.2A2.4 2.4 0 0 0 58 44z" fill={P.soft} />
    <path d="M8 47.5V22c6 1 14.5 3.3 20 7.2v25.3c-5.5-3.9-14-6.2-20-7z" fill={P.pale} />
    <path d="M56 47.5V22c-6 1-14.5 3.3-20 7.2v25.3c5.5-3.9 14-6.2 20-7z" fill={P.pale} />
    <path d="M32 21c-1.1 0-2 .9-2 2v31c0 1.1.9 2 2 2s2-.9 2-2V23c0-1.1-.9-2-2-2z" fill={P.dark} />
    <path d="M32 26.5c2.6 1.8 4 4 4 6.4 0 2.6-1.8 4.5-4 4.5s-4-1.9-4-4.5c0-2.4 1.4-4.6 4-6.4z" fill={P.mid} opacity=".9" />
  </svg>
);

export const IcMosque = (p) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden {...p}>
    <rect x="10" y="30" width="6" height="24" rx="3" fill={P.soft} />
    <rect x="48" y="30" width="6" height="24" rx="3" fill={P.soft} />
    <path d="M13 23c2.4 2.2 3.5 4.3 3.5 6.2H9.5C9.5 27.3 10.6 25.2 13 23z" fill={P.mid} />
    <path d="M51 23c2.4 2.2 3.5 4.3 3.5 6.2h-7c0-1.9 1.1-4 3.5-6.2z" fill={P.mid} />
    <path d="M18 54V36c0-5.6 3.8-9.6 14-14 10.2 4.4 14 8.4 14 14v18H18z" fill={P.pale} />
    <path d="M32 14c5.6 4.2 8.4 8 8.4 11.6 0 4.2-3.6 7.2-8.4 7.2s-8.4-3-8.4-7.2C23.6 22 26.4 18.2 32 14z" fill={P.dark} />
    <rect x="31" y="7" width="2" height="6" rx="1" fill={P.dark} />
    <path d="M32 40c3.1 0 5.4 2.4 5.4 5.6V54h-10.8v-8.4c0-3.2 2.3-5.6 5.4-5.6z" fill={P.mid} />
  </svg>
);

export const IcArch = (p) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden {...p}>
    <path d="M14 56V29c0-9.9 8.1-18 18-18s18 8.1 18 18v27H14z" fill={P.soft} />
    <path d="M20 56V30c0-6.6 5.4-12 12-12s12 5.4 12 12v26H20z" fill={P.pale} />
    <path d="M32 24c4.4 0 8 3.7 8 8.2V47H24V32.2c0-4.5 3.6-8.2 8-8.2z" fill={P.mid} opacity=".75" />
    <rect x="10" y="54" width="44" height="5" rx="2.5" fill={P.dark} />
  </svg>
);

export const IcQuranBook = (p) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden {...p}>
    <rect x="14" y="10" width="34" height="44" rx="5" fill={P.dark} />
    <rect x="18" y="14" width="30" height="36" rx="3" fill={P.pale} />
    <rect x="14" y="10" width="7" height="44" rx="3.5" fill={P.ink} />
    <path d="M33 23c3.8 2.8 5.7 5.5 5.7 8.2 0 3.2-2.5 5.5-5.7 5.5s-5.7-2.3-5.7-5.5c0-2.7 1.9-5.4 5.7-8.2z" fill={P.mid} />
    <rect x="27" y="41" width="13" height="2.4" rx="1.2" fill={P.soft} />
  </svg>
);

export const IcSprout = (p) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden {...p}>
    <path d="M32 54V30" stroke={P.dark} strokeWidth="3.4" strokeLinecap="round" />
    <path d="M32 33c-1-7-6.5-11.5-14-12 .4 7.6 5.6 12.4 14 12z" fill={P.mid} />
    <path d="M32 29c1.2-7.4 6.8-12 14.5-12.5C46 24.4 40.6 29.4 32 29z" fill={P.soft} />
    <path d="M18 54c0-3.3 6.3-6 14-6s14 2.7 14 6H18z" fill={P.pale} />
  </svg>
);

export const IcBooks = (p) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden {...p}>
    <rect x="10" y="41" width="44" height="11" rx="3" fill={P.dark} />
    <rect x="14" y="30" width="38" height="11" rx="3" fill={P.mid} />
    <rect x="12" y="19" width="34" height="11" rx="3" fill={P.soft} />
    <rect x="17" y="44.6" width="12" height="3.8" rx="1.9" fill={P.pale} opacity=".75" />
    <rect x="20" y="33.6" width="12" height="3.8" rx="1.9" fill={P.pale} opacity=".7" />
  </svg>
);

export const CAT_ART = { tafsir: IcQuranOpen, asma: IcMosque, namaz: IcArch, quran: IcQuranBook, mothers: IcSprout, other: IcBooks };
