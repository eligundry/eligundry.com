import delegate from 'delegate';

const attachPrintPageEvent = () => {
    delegate(document.body, '.trigger-print', 'click', (event) => {
        event.preventDefault();
        window.print();
    });
};

export default attachPrintPageEvent;
