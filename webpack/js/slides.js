import Reveal from 'reveal.js';

const attachSlideShow = () => {
    const slideShowContainer = document.querySelector('.reveal');

    if (slideShowContainer) {
        Reveal.initialize({
            width: '100%',
            height: '100%'
        });
    }
};

export default attachSlideShow();
