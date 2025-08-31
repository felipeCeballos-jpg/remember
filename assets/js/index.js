import { db } from './constant.js';
import {
  initLanguage,
  checkLoaded,
  getDateFormat,
  updateDesign,
  setLanguage,
  booksAnimation,
  initMessages,
  sendMessage,
  loadMoreMessages,
  initFormValidation,
  validateField,
  validateSticker,
  clearStickerError,
} from './util.js';

const switchLanguageButton = document.querySelector('.language-button');
const html = document.querySelector('html');
const form = document.querySelector('.form-container');
const stickers = document.querySelectorAll('.sticker-button');
const hiddenStickerInput = document.querySelector('#selectedsticker');
const messageContainer = document.querySelector('.msgs-container');

// Set media queries
const mqlMobile = window.matchMedia('(max-width: 800px)');
const mqlDefault = window.matchMedia('(min-width: 801px)');

// Set the loader element
const loader = document.querySelector('.loader');

// Set Language
initLanguage(html);

const startLoadingTime = Date.now();
window.addEventListener('load', () => {
  checkLoaded(startLoadingTime, loader, true); // TODO: Fix the body scroll when the page is loading
});

window.addEventListener('DOMContentLoaded', () => {
  updateDesign(mqlMobile.matches);

  initMessages(messageContainer, db);
  initFormValidation(html.lang);
  booksAnimation();
});

switchLanguageButton.addEventListener('click', () => {
  loader.style.display = 'flex';

  // Change Language
  setLanguage(html);

  updateDesign(mqlMobile.matches).then((result) => {
    checkLoaded(result.timestamp, loader, true);
  });


  booksAnimation();
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  updateDesign(event.matches).then((result) => {
    checkLoaded(result.timestamp, loader);
  });

  booksAnimation();
});

mqlDefault.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  updateDesign(event.matches).then((result) => {
    checkLoaded(result.timestamp, loader);
  });

  booksAnimation();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector('#Name');
  const message = document.querySelector('#Message');
  const sticker = document.querySelector('#selectedsticker');
  const stickersContainer = document.querySelector('.stickers-input');
  const scrollPosition = window.scrollY;

  // Validate all fields and show errors
  const isNameValid = validateField(name, html.lang);
  const isMessageValid = validateField(message, html.lang);
  const isStickerValid = validateSticker(sticker, stickersContainer);

  if (!isNameValid || !isMessageValid || !isStickerValid) {
    return;
  }

  const date = getDateFormat();

  db.unshift({
    id: crypto.randomUUID,
    name: name.value.toLowerCase(),
    message: message.value.toLowerCase(),
    created_at: date,
    sticker: sticker.value.toLowerCase(),
  });

  sendMessage(messageContainer, db);

  name.value = '';
  message.value = '';
  sticker.value = '';

  requestAnimationFrame(() => {
    window.scrollTo(0, scrollPosition);
  });
});

stickers.forEach((sticker) => {
  sticker.addEventListener('click', () => {
    const sticker_imgs = document.querySelectorAll('.sticker');
    const stickersContainer = document.querySelector('.stickers-input');

    // remove selection from all
    sticker_imgs.forEach((s) => s.classList.remove('selected-sticker'));

    // mark this as selected
    sticker_imgs.forEach((s) => {
      const splitText = s.alt.split(' ');
      if (sticker.dataset.value === splitText[0]) {
        s.classList.add('selected-sticker');
      }
    });

    if (
      sticker.dataset.value === 'bear' ||
      sticker.dataset.value === 'flower' ||
      sticker.dataset.value === 'candy'
    ) {
      // store value in hidden input
      hiddenStickerInput.value = sticker.dataset.value;

      // Clear any existing sticker validation error
      clearStickerError(stickersContainer);
      return;
    }

    alert(
      `Please don't change the sticker value on the inspector, please refresh the page`
    );
  });
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.load-more-msg-button')) {
    const messagesContiner = document.querySelectorAll('.msg-container');
    const messagesContainerLength = messagesContiner.length;
    const dbLength = db.length;
    const scrollPosition = window.scrollY;

    const MESSAGES_SHOWN_PER_CLICK = 3;
    const newMessagesLength =
      messagesContainerLength + MESSAGES_SHOWN_PER_CLICK;

    if (newMessagesLength < dbLength) {
      const newMessage = [...db.slice(0, newMessagesLength)];
      loadMoreMessages(messageContainer, newMessage);
    } else {
      const hasAllMessages = true;
      loadMoreMessages(messageContainer, db, hasAllMessages);
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  }
});