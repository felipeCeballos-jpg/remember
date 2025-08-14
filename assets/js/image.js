import {
  dinamicEnImages,
  dinamicRuImages,
  footerEnTranslateImgs,
  footerRuTranslateImgs,
  originalEnImages,
  originalRuImages,
} from './constant.js';
import { loadImage } from './util.js';

const LOCALIZEDIMAGES = {
  ru: {
    images: originalRuImages,
  },
  en: {
    images: originalEnImages,
  },
};

// Configuration object for image selectors
const IMAGE_SELECTORS = {
  translate: '.changeable-img',
  footer: '.changeable-footer-img',
  dinamic: '.changeable-dinamic-img',
};

// Image source resolver
const getImageSources = (language) => ({
  translate: LOCALIZEDIMAGES[language]?.images || [],
  footer: language === 'ru' ? footerRuTranslateImgs : footerEnTranslateImgs,
  dinamic: language === 'ru' ? dinamicRuImages : dinamicEnImages,
});

export async function updateImages(language) {
  if (!language) {
    throw new Error('Missing the language parameter');
  }

  // Performance optimization: Get all elements in one pass
  const elements = {};
  const loadingPromises = [];
  let totalImages = 0;
  let imagesLoaded = 0;

  try {
    // Get images sources
    const imageSources = getImageSources(language);

    // Collect all elements and prepare loading
    for (const [key, selector] of Object.entries(IMAGE_SELECTORS)) {
      elements[key] = [...document.querySelectorAll(selector)];

      totalImages += elements[key].length;

      // Prepare image loading promises
      elements[key].forEach((image, index) => {
        const src = imageSources[key]?.[index];

        loadingPromises.push(
          loadImage(image, src).then((success) => {
            if (success) imagesLoaded++;
            return success;
          })
        );
      });
    }

    // Load all images concurrently
    await Promise.allSettled(loadingPromises);

    return {
      imagesLoaded,
      totalImages,
      success: imagesLoaded === totalImages,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error updating images: ', error);
    return {
      imagesLoaded,
      totalImages,
      success: false,
      error: error.message,
    };
  }
}
