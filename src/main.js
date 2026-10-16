import { initScreenHeight } from './js/screen-height.js';
import { initNav } from './js/nav.js';
import { initForm } from './js/form.js';
import { initAnimations } from './js/animations.js';

initScreenHeight();
initNav();
initForm();
initAnimations();

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
