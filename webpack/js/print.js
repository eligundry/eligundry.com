const attachPrintPageEvent = () => {
    const printBtn = document.querySelector('.trigger-print');

    if (printBtn) {
        printBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.print();
        });
    }
};

export default attachPrintPageEvent;
