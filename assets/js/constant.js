export const INITIAL_LANGUAGE = 'ru';

export const db = [
  {
    id: crypto.randomUUID,
    name: 'Anna and Bob Zemanov',
    message:
      "We were very happy to meet your mother, we lived next door and helped her with the housework. <br /> In the evenings, she treated us to pies and was always very kind. It's a pity that this happened. The world has lost a very bright man.",
    created_at: '07.07.2020',
    sticker: 'bear',
  },
  {
    id: crypto.randomUUID,
    name: 'Yuri Feldman',
    message:
      'There are millions of words I can say in memory of my grandmother, but today I will be brief.: Thank you for everything, rest in peace.',
    created_at: '11.06.2020',
    sticker: 'candy',
  },
  {
    id: crypto.randomUUID,
    name: 'Marina Ilyina',
    message:
      'My mother also worked at NIIHM with Olga Egorovna. She always spoke very highly of her as a friend and a diligent employee. She will remain in our hearts forever.',
    created_at: '09.05. 2020',
    sticker: 'flower',
  },
  {
    id: crypto.randomUUID,
    name: 'Marina Ilyina',
    message:
      'My mother also worked at NIIHM with Olga Egorovna. She always spoke very highly of her as a friend and a diligent employee. She will remain in our hearts forever.',
    created_at: '09.05. 2020',
    sticker: 'flower',
  },
  {
    id: crypto.randomUUID,
    name: 'Marina Ilyina',
    message:
      'My mother also worked at NIIHM with Olga Egorovna. She always spoke very highly of her as a friend and a diligent employee. She will remain in our hearts forever.',
    created_at: '09.05. 2020',
    sticker: 'flower',
  },
];

export const stickerInfo = {
  flower: {
    src: 'assets/flower.png',
    alt: 'Flower Sticker',
    className: 'flower-img sticker-img',
  },
  candy: {
    src: 'assets/candy.png',
    alt: 'Candy Sticker',
    className: 'candy-img sticker-img',
  },
  bear: {
    src: 'assets/bear.png',
    alt: 'Bear Sticker',
    className: 'bear-img sticker-img',
  },
};

export const RUText = [
  'Посвящается моей бабушке • 1933—2019',
  'Оставьте воспоминание',
  /* 'Мы были очень счастливы знакомству с вашей матерью, мы жили по соседству и помогали ей по хозяйству. Вечерами она угощала нас пирожками и всегда была очень любезна. Очень жаль, что так произошло. Мир потерял очень светлого человека.',
  'Анна и Боб Земановы',
  'Можно сказать миллионы слов в память о бабушке, но сегодня я буду краток: спасибо тебе за все, покойся с миром.',
  'Юрий Фельдман',
  'Моя мама тоже работала в НИИХМ с Ольгой Егоровной. Она всегда очень лестно отзывалась о ней как о подруге и прилежном сотруднике. Она навечно останется в наших сердцах.',
  'Марина Ильина', */
  'Имя:',
  'Текст: ',
  //'Здравст',
  '© «ВСПОМНИМ»',
  'Связаться с внуком Сергеем:',
];

export const ENText = [
  'Dedicated to my grandmother • 1933-2019',
  'Leave a memory',
  /* `We were very happy to meet your mother, we lived next door and helped her with the housework. <br/> In the evenings, she treated us to pies and was always very kind. It's a pity that this happened. The world has lost a very bright man.`,
  'Anna and Bob Zemanov',
  'There are millions of words I can say in memory of my grandmother, but today I will be brief.: Thank you for everything, rest in peace.',
  'Yuri Feldman',
  'My mother also worked at NIIHM with Olga Egorovna. She always spoke very highly of her as a friend and a diligent employee. She will remain in our hearts forever.',
  'Marina Ilyina', */
  'Name:',
  'Text:',
  //'Hello...',
  '© «REMEMBER»',
  'Contact the grandson Sergey:',
];

export const footerRuTranslateImgs = [
  './assets/navbook/main_ru.webp',
  './assets/navbook/milestones_ru.webp',
  './assets/navbook/stories_ru.webp',
  './assets/navbook/gallery_ru.webp',
  './assets/navbook/my_granny_ru.webp',
  './assets/navbook/map_ru.webp',
  './assets/navbook/nanas_words_ru.webp',
];

export const footerEnTranslateImgs = [
  './assets/navbook/main_en.webp',
  './assets/navbook/milestones_en.webp',
  './assets/navbook/stories_en.webp',
  './assets/navbook/gallery_en.webp',
  './assets/navbook/my_granny_en.webp',
  './assets/navbook/map_en.webp',
  './assets/navbook/nanas_words_en.webp',
];

export const originalRuImages = [
  './assets/klubok_ru.png',
  './assets/remember-ru1.webp',
  './assets/print-button-ru.webp',
];

export const originalEnImages = [
  './assets/klubok_en.png',
  './assets/remember-en.webp',
  './assets/print-button-en.webp',
];

export const dinamicEnImages = ['./assets/read-next-button-en.webp'];
export const dinamicRuImages = ['./assets/read-next-button-ru.webp'];

export const localizedText = {
  ru: {
    texts: RUText,
  },
  en: {
    texts: ENText,
  },
};
