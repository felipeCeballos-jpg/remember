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

  // Update textarea placeholder
  const name = document.querySelector('#Name');
  const message = document.querySelector('#Message');
  if (message) {
    const placeholder = language === 'ru' ? 'Здравствуйте…' : 'Hello...';
    message.placeholder = placeholder;
  }

  // Update error messages in inputs
  if (name.classList.contains('input-invalid')) {
    if (name.value.trim() === '') {
      const messageTxt =
        language === 'ru' ? 'Обязательное поле' : 'This field is required';
      showError(name, messageTxt);
    }

    if (name.value.length > 150) {
      const messageTxt =
        language === 'ru'
          ? 'Максимальная длина — 150 символов.'
          : 'Maximum length is 150 characters';
      showError(name, messageTxt);
    }
  }

  if (message.classList.contains('message-invalid')) {
    if (message.value.trim() === '') {
      const messageTxt =
        language === 'ru' ? 'Обязательное поле' : 'This field is required';
      showError(message, messageTxt);
    }

    if (message.value.length > 600) {
      const messageTxt =
        language === 'ru'
          ? 'Максимальная длина — 600 символов.'
          : 'Maximum length is 600 characters';
      showError(message, messageTxt);
    }
  }
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

export function sideElementsAnimation() {
  resetAnimation([
    { selector: '.scroll-action-left', animationClass: 'scroll-active-left' },
  ]);

  const elementsToAnimate = [{ selector: '.scroll-action-left', side: 'left' }];

  elementsToAnimate.forEach(({ selector, side }) => {
    document.querySelectorAll(selector).forEach((item) => {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(`scroll-active-${side}`);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px',
          threshold: 0,
        }
      );

      observer.observe(item);
    });
  });
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

// Extract validation functions to be exportable
function showError(input, customMessage) {
  // Add error class with animation
  if (input.tagName.toLowerCase() === 'textarea') {
    input.classList.add('message-invalid');
  } else {
    input.classList.add('input-invalid');
  }

  // Find or create error message element
  const wrapper = input.closest('.input-wrapper');
  let errorElement = wrapper.querySelector('.invalid-input, .invalid-textarea');

  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className =
      input.tagName.toLowerCase() === 'textarea'
        ? 'invalid-textarea'
        : 'invalid-input';
    wrapper.appendChild(errorElement);
  }
  errorElement.textContent = customMessage;
}

function clearError(input) {
  // Find error message element
  const wrapper = input.closest('.input-wrapper');
  const errorElement = wrapper.querySelector(
    '.invalid-input, .invalid-textarea'
  );

  if (errorElement) {
    // Add removing class for exit animation
    errorElement.classList.add('removing');

    // Wait for animation to complete before removing
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 150); // Match the fadeOutError animation duration
  }

  // Remove error classes from input (with transition)
  input.classList.remove('input-invalid', 'message-invalid');
}

export function validateField(input, lang) {
  const value = input.value.trim();

  if (value === '') {
    const message =
      lang === 'ru' ? 'Обязательное поле' : 'This field is required';

    showError(input, message);
    return false;
  }

  // Check length validation based on input ID
  if (input.id === 'Name' && value.length > 90) {
    const message =
      lang === 'ru'
        ? 'Максимальная длина — 90 символов.'
        : 'Maximum length is 90 characters';

    showError(input, message);
    return false;
  }

  if (input.id === 'Message' && value.length > 600) {
    const message =
      lang === 'ru'
        ? 'Максимальная длина — 600 символов.'
        : 'Maximum length is 600 characters';

    showError(input, message);
    return false;
  }

  clearError(input);
  return true;
}

// Form validation controller
export function initFormValidation(lang) {
  // Get all form inputs and textareas
  const inputs = document.querySelectorAll('.text-input');

  // Track input states
  const inputStates = new Map();

  inputs.forEach((input) => {
    // Initialize state for each input
    inputStates.set(input, {
      hasBeenFocused: false,
      isTyping: false,
      typingTimer: null,
    });

    // Focus event - user enters input
    input.addEventListener('focus', function () {
      const state = inputStates.get(input);

      // Only clear error on focus if it's NOT a length error and input is not empty
      if (
        input.classList.contains('input-invalid') ||
        input.classList.contains('message-invalid')
      ) {
        const wrapper = input.closest('.input-wrapper');
        const errorElement = wrapper.querySelector(
          '.invalid-input, .invalid-textarea'
        );
        const isLengthError =
          errorElement &&
          (errorElement.textContent.includes('Maximum length') ||
            errorElement.textContent.includes('Максимальная длина'));

        // Don't clear length errors on focus, and don't clear required field errors if input is empty
        if (!isLengthError && input.value.trim() !== '') {
          clearError(input);
        }
      }

      state.hasBeenFocused = true;
    });

    // Input event - user is typing
    input.addEventListener('input', function () {
      const state = inputStates.get(input);
      state.isTyping = true;

      // Clear any existing timer
      if (state.typingTimer) {
        clearTimeout(state.typingTimer);
      }

      // Clear required field errors when user starts typing (but keep length errors)
      if (
        input.classList.contains('input-invalid') ||
        input.classList.contains('message-invalid')
      ) {
        const wrapper = input.closest('.input-wrapper');
        const errorElement = wrapper.querySelector(
          '.invalid-input, .invalid-textarea'
        );
        const isLengthError =
          errorElement &&
          (errorElement.textContent.includes('Maximum length') ||
            errorElement.textContent.includes('Максимальная длина'));

        // Only clear non-length errors when typing
        if (!isLengthError) {
          clearError(input);
        }
      }

      // Real-time length validation while typing
      const value = input.value;
      if (input.id === 'Name' && value.length > 90) {
        const message =
          lang === 'ru'
            ? 'Максимальная длина — 90 символов.'
            : 'Maximum length is 90 characters';

        showError(input, message);
      } else if (input.id === 'Message' && value.length > 600) {
        const message =
          lang === 'ru'
            ? 'Максимальная длина — 600 символов.'
            : 'Maximum length is 600 characters';

        showError(input, message);
      } else {
        // Clear length error if user is now within limits
        const wrapper = input.closest('.input-wrapper');
        const errorElement = wrapper.querySelector(
          '.invalid-input, .invalid-textarea'
        );
        if (
          errorElement &&
          (errorElement.textContent.includes('Maximum length') ||
            errorElement.textContent.includes('Максимальная длина'))
        ) {
          clearError(input);
        }
      }

      // Show empty field error while typing if field becomes empty
      if (state.hasBeenFocused && input.value.trim() === '') {
        const message =
          lang === 'ru' ? 'Обязательное поле' : 'This field is required';
        showError(input, message);
      }

      // Set timer to detect when user stops typing
      state.typingTimer = setTimeout(() => {
        state.isTyping = false;
      }, 1000); // 1 second after stopping typing
    });

    // Blur event - user leaves input (including clicking elsewhere)
    input.addEventListener('blur', function () {
      const state = inputStates.get(input);

      // Clear any pending timer since user left the input
      if (state.typingTimer) {
        clearTimeout(state.typingTimer);
        state.typingTimer = null;
      }

      state.isTyping = false;

      // If input has been focused, validate on blur
      if (state.hasBeenFocused) {
        // Check if empty
        if (input.value.trim() === '') {
          const message =
            lang === 'ru' ? 'Обязательное поле' : 'This field is required';
          showError(input, message);
          return;
        }

        // Check length validation
        if (input.id === 'Name' && input.value.length > 90) {
          const message =
            lang === 'ru'
              ? 'Максимальная длина — 90 символов.'
              : 'Maximum length is 90 characters';
          showError(input, message);
        } else if (input.id === 'Message' && input.value.length > 600) {
          const message =
            lang === 'ru'
              ? 'Максимальная длина — 600 символов.'
              : 'Maximum length is 600 characters';
          showError(input, message);
        }
      }
    });
  });
}

export function validateSticker(stickerInput, stickersContainer) {
  if (stickerInput.value === '') {
    showStickerError(stickersContainer);
    return false;
  }
  clearStickerError(stickersContainer);
  return true;
}

function showStickerError(stickersContainer) {
  // Add error class to stickers container with animation
  stickersContainer.classList.add('stickers-invalid');

  /*  // Find or create error message element
  let errorElement = stickersContainer.querySelector('.invalid-stickers');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'invalid-stickers';
    errorElement.textContent = 'Please select a sticker';
    stickersContainer.appendChild(errorElement);
  } */
}

export function clearStickerError(stickersContainer) {
  // Remove error class with transition
  stickersContainer.classList.remove('stickers-invalid');

  /* // Remove error message
  const errorElement = stickersContainer.querySelector('.invalid-stickers');
  if (errorElement) {
    errorElement.remove();
  } */
}