import delegate from 'delegate';

const attachPrintPageEvent = () => {
    delegate('html', '.trigger-print', 'click', (event) => {
        event.preventDefault();
        window.print();
    });
};

export default attachPrintPageEvent;
