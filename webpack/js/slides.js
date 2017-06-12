// @TODO Ugh this is nasty, but this is the only way that I can tell to get the
// plugins working.
window.Reveal = require('reveal.js/js/reveal.js');
require('reveal.js/lib/js/head.min.js');
require('reveal.js/lib/js/classList.js');
require('reveal.js/plugin/markdown/marked.js');
require('reveal.js/plugin/markdown/markdown.js');

const attachSlideShow = () => {
    const slideShowContainer = document.querySelector('.reveal');

    if (slideShowContainer) {
        createSlideShow();
    }
};

const createSlideShow = () => {
    window.Reveal.initialize({
        history: true,
        width: '100%',
        height: '100%',
    });
};

export default attachSlideShow();
