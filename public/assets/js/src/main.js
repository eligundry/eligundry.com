// hardcore $(document).ready
document.addEventListener("DOMContentLoaded", function() {
	// Load highlight.js for code highlighting
	hljs.initHighlightingOnLoad();

	// Load reveal.js on needed pages
	if (document.querySelector('html').classList.contains('reveal-page')) {
		Reveal.initialize({
			controls: true,
			progress: true,
			history: true,
			center: true
		});
	}
});
