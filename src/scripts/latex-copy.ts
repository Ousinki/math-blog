/**
 * LaTeX Copy-to-Clipboard Functionality
 * Allows users to click on math formulas to copy their LaTeX source code
 */

function initLatexCopy() {
	// Find all KaTeX rendered elements (both inline and display)
	const katexElements = document.querySelectorAll(".katex, .katex-display");

	katexElements.forEach((element) => {
		// Add click event listener
		element.addEventListener("click", async function (event) {
			event.preventDefault();
			event.stopPropagation();

			// Find the annotation element containing LaTeX source
			const annotation = element.querySelector('annotation[encoding="application/x-tex"]');

			if (!annotation) {
				console.warn("LaTeX source not found in KaTeX element");
				return;
			}

			// Get the LaTeX source code
			const latexSource = annotation.textContent || "";

			try {
				// Copy to clipboard using modern Clipboard API
				await navigator.clipboard.writeText(latexSource);

				// Show success feedback
				showCopyFeedback(element as HTMLElement);
			} catch (err) {
				// Fallback for older browsers
				fallbackCopyToClipboard(latexSource, element as HTMLElement);
			}
		});
	});
}

/**
 * Show visual feedback that copy was successful
 */
function showCopyFeedback(element: HTMLElement) {
	element.classList.add("copied");
	setTimeout(() => {
		element.classList.remove("copied");
	}, 600);
}

/**
 * Fallback copy method for browsers that don't support Clipboard API
 */
function fallbackCopyToClipboard(text: string, element: HTMLElement) {
	const textArea = document.createElement("textarea");
	textArea.value = text;
	textArea.style.position = "fixed";
	textArea.style.left = "-999999px";
	textArea.style.top = "-999999px";
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand("copy");
		if (successful) {
			showCopyFeedback(element);
		} else {
			console.error("Fallback copy failed");
		}
	} catch (err) {
		console.error("Failed to copy LaTeX source:", err);
	}

	document.body.removeChild(textArea);
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initLatexCopy);
} else {
	initLatexCopy();
}

// Re-initialize after page transitions (for SPA-like behavior)
document.addEventListener("astro:page-load", initLatexCopy);
