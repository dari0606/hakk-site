// ─────────────────────────────────────────────────────────────────────────────
//  КОНТАКТЫ САЙТА — всё редактируется здесь, в одном месте.
//  WHATSAPP: номер в международном формате, только цифры, без + и пробелов.
//  Пример для Казахстана: '77012345678'
// ─────────────────────────────────────────────────────────────────────────────
export const SITE = {
  whatsapp: '77773268276',            // рабочий номер WhatsApp
  instagram: '',                      // напр. 'hakk_academy' (без @); пусто — кнопка скрыта
  telegram: '',                       // напр. 'hakk_academy'; пусто — кнопка скрыта
  email: '',                          // напр. 'salem@hakk.kz'; пусто — строка скрыта
  youtube: 'https://www.youtube.com/@Hakk_academy',
  // Фон первого экрана. Фото размывается и тонируется фиолетовым автоматически.
  // Сейчас: горы в тумане на закате, Unsplash (свободная лицензия),
  // unsplash.com/photos/photo-1542662565-7e4b66bae529
  // Своё фото: положите файл в public/ и укажите его здесь, напр. '/hero.jpg'.
  heroImage: '/hero.jpg',
  // ролик в шапке сайта — любой урок с канала
  // Главное видео на первом экране.
  //   { type: 'instagram', id: '<код рилса>' }  — рилс из Instagram
  //   { id: '<код видео>' }                     — урок с YouTube
  //   { type: 'file', src: '/hero.mp4', poster: '/hero-poster.jpg' } — файл на сайте
  heroVideo: { type: 'file', src: '/hero.mp4', poster: '/hero-poster.jpg', title: 'Алғашқы оффлайн орталық' },
  platform: '',                       // адрес учебной платформы; пусто — кнопка скрыта
  channelId: 'UCxOw4gHztFswqyl0ee-vx8w',
};

export const hasWhatsapp = () => /^\d{10,15}$/.test(SITE.whatsapp) && SITE.whatsapp !== '77000000000';

/** Ссылка на WhatsApp с заранее написанным текстом заявки. */
export const waLink = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const ytWatch = (id) => `https://www.youtube.com/watch?v=${id}`;
export const ytEmbed = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const ytPlaylist = (id) => `https://www.youtube.com/playlist?list=${id}`;
export const igEmbed = (id) => `https://www.instagram.com/reel/${id}/embed/`;
export const igLink = (id) => `https://www.instagram.com/reel/${id}/`;
