document.addEventListener('DOMContentLoaded', function() {
    var print_btn = document.querySelector('.trigger-print');

    if (print_btn) {
        print_btn.addEventListener('click', function(event) {
            event.preventDefault();
            window.print();
        });
    }
});
