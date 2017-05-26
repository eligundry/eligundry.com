import attachPrintPageEvent from './print.js';
import attachSlideShow from './slides.js';

document.addEventListener('DOMContentLoaded', () => {
    attachPrintPageEvent();
    attachSlideShow();
});
