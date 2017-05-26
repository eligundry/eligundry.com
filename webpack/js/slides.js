import Reveal from 'reveal.js';

const attachSlideShow = () => {
    const slideShowContainer = document.querySelector('.reveal');

    if (slideShowContainer) {
        Reveal.initialize();
    }
};

export default attachSlideShow();
