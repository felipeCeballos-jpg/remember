import { INITIAL_LANGUAGE, localizedText, stickerInfo } from './constant.js';
import { updateImages } from './image.js';

export function checkLoaded(
  startTime,
  loaderElement,
  delayLoadingPage = false,
  animationFn = null
) {
  const maxLoadingTime = 2500; // 2.5 seconds
  const elapsedTime = Date.now() - startTime;

  const timeRemaining = maxLoadingTime - elapsedTime;

  if (delayLoadingPage && elapsedTime < maxLoadingTime) {
    setTimeout(() => {
      loaderElement.style.display = 'none';
      if (animationFn) animationFn();
    }, timeRemaining);
  } else {
    loaderElement.style.display = 'none';
    if (animationFn) animationFn();
  }
}

export function initLanguage(html) {
  const language = localStorage.getItem('language');

  if (!language) {
    localStorage.setItem('language', INITIAL_LANGUAGE);
    html.lang = INITIAL_LANGUAGE;
    return;
  }
  html.lang = language;
}

export function resetAnimation(elements) {
  if (elements.length === 0) return;

  elements.forEach(({ selector, animationClass }) => {
    const element = document.querySelector(selector);
    if (element.classList.contains(animationClass)) {
      element.classList.remove(animationClass);
    }
  });
}

export function initMessages(container, data) {
  if (data.length < 4) {
    loadingMessages(container, data);
    return;
  }

  const parent = document.querySelector('#memory-msg-container');
  const firstMessages = [...data.slice(0, 3)];
  const loadMoreButton = document.createElement('button');
  const currentLanguage = getLanguage();
  const imageSrc =
    currentLanguage === 'ru'
      ? 'assets/read-next-button-ru.webp'
      : 'assets/read-next-button-en.webp';

  loadMoreButton.classList.add('load-more-msg-button');
  loadMoreButton.innerHTML = `
    <img
      alt="Load more messages button"
      class="load-more-msg-img changeable-dinamic-img"
      src=${imageSrc}
    /> 
  `;

  loadingMessages(container, firstMessages);
  parent.appendChild(loadMoreButton);
}

export function sendMessage(container, data) {
  console.log({ data });
  if (data.length < 4) {
    console.log('entre');
    loadingMessages(container, data);
    return;
  }

  const parent = document.querySelector('#memory-msg-container');
  const firstMessages = [...data.slice(0, 3)];
  const moreMsgButton = document.querySelector('.load-more-msg-button');

  if (moreMsgButton === null) {
    const loadMoreButton = document.createElement('button');
    const currentLanguage = getLanguage();
    const imageSrc =
      currentLanguage === 'ru'
        ? 'assets/read-next-button-ru.webp'
        : 'assets/read-next-button-en.webp';

    loadMoreButton.classList.add('load-more-msg-button');
    loadMoreButton.innerHTML = `
    <img
      alt="Load more messages button"
      class="load-more-msg-img changeable-dinamic-img"
      src=${imageSrc}
    /> 
  `;

    parent.appendChild(loadMoreButton);
  }

  loadingMessages(container, firstMessages);
}

export function loadMoreMessages(container, data, hasAllMessages = false) {
  if (hasAllMessages) {
    const parent = document.querySelector('#memory-msg-container');
    const moreMsgButton = document.querySelector('.load-more-msg-button');

    parent.removeChild(moreMsgButton);
  }

  loadingMessages(container, data);
}

export function loadingMessages(container, data) {
  const lastPosition = data.length - 1;

  container.innerHTML = '';

  data.forEach((element, index) => {
    const messageElement = createContainerMessage(element, lastPosition, index);
    container.append(messageElement);
  });
}

function createContainerMessage(element, lastPosition, positionElement) {
  const messagecontainer = document.createElement('div');
  messagecontainer.classList.add('msg-container');

  const num = positionElement + 1;
  const leftOrRightClass =
    num % 2 === 0 ? 'msg-subcontainer-right' : 'msg-subcontainer-left';

  messagecontainer.innerHTML = `
            <div class="msg-subcontainer ${leftOrRightClass}">
              <div class="stickers-img-container">
                <img
                  alt=${stickerInfo[element.sticker].alt}
                  class=${stickerInfo[element.sticker].className}
                  src=${stickerInfo[element.sticker].src}
                />
              </div>
              <div class="msg-description">
                <p class="msg-date">${element.created_at}</p>
                <p class="msg-name">${element.name}</p>
                <p class="msg-message">${element.message}</p>
              </div>
            </div>
    `;

  if (lastPosition != positionElement) {
    const divider = document.createElement('p');
    divider.classList.add('asterisk-divider');
    divider.innerText = '***';

    messagecontainer.append(divider);
  }

  return messagecontainer;
}

export function newMessage(container, db) {
  const lastMessage = document.querySelectorAll('.msg-container');
  console.log({ lastMessage });
}

export function getLanguage() {
  const language = localStorage.getItem('language');
  return language || INITIAL_LANGUAGE;
}

export function setLanguage(html) {
  const currentLang = html.lang === 'ru' ? 'en' : 'ru';

  localStorage.setItem('language', currentLang);
  html.lang = currentLang;
}

// Image loading utility that returns a promise and handles errors
export function loadImage(image, src) {
  return new Promise((resolve) => {
    if (!src) {
      console.warn(`Missing source for image: `, image);
      resolve(false);
      return;
    }

    image.src = src;
    image.onload = () => resolve(true);
    image.onerror = (error) => {
      console.error('Error loading image: ', { src, error });
      resolve(false);
    };
  });
}

/* Update Design */
export async function updateDesign(isMobile = false) {
  try {
    // Get current language
    const currentLanguage = getLanguage();

    updateText(currentLanguage);
    const result = await updateImages(currentLanguage);

    if (!result.success) {
      console.warm(
        `Some images failed to load (${result.imagesLoaded}/${result.totalImages})`
      );
    }

    return result;
  } catch (error) {
    console.error('Failed to update images:', error);
    throw error;
  }
}

function updateText(language) {
  const textElements = document.querySelectorAll('.changeable-txt');
  const currentResource = localizedText[language].texts;

  // Update Text
  textElements.forEach((text, index) => {
    text.innerHTML = currentResource[index];
  });
}

export function booksAnimation() {
  resetAnimation([{ selector: '.menu', animationClass: 'menu-active' }]);

  const footer = document.querySelector('.section-navbook');
  const books = document.querySelector('.menu');
  const booksObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          books.classList.add('menu-active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px',
      threshold: 0.6,
    }
  );

  booksObserver.observe(footer);
}

export function getDateFormat() {
  const date = new Date();
  const day = date.getUTCDay();
  const month = date.getUTCMonth();

  if (day < 10) {
    if (month < 10) {
      return `0${day}.0${month}.${date.getUTCFullYear()}`;
    } else {
      return `0${day}.${month}.${date.getUTCFullYear()}`;
    }
  } else {
    if (month < 10) {
      return `${day}.0${month}.${date.getUTCFullYear()}`;
    } else {
      return `${day}.${month}.${date.getUTCFullYear()}`;
    }
  }
}
