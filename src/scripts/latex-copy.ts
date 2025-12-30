/**
 * LaTeX Copy-to-Clipboard Functionality
 * 1. Click on math formula to copy LaTeX source
 * 2. Select text containing math formulas and copy - formulas are converted to LaTeX
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
			
			// 判斷是行內公式還是塊級公式
			const isBlock = element.classList.contains("katex-display") || 
				element.closest(".katex-display") !== null;
			
			// 添加 $ 或 $$ 包裹
			const wrappedLatex = isBlock ? `$$${latexSource}$$` : `$${latexSource}$`;

			try {
				// Copy to clipboard using modern Clipboard API
				await navigator.clipboard.writeText(wrappedLatex);

				// Show success feedback
				showCopyFeedback(element as HTMLElement);
			} catch (err) {
				// Fallback for older browsers
				fallbackCopyToClipboard(wrappedLatex, element as HTMLElement);
			}
		});
	});

	// 監聽 copy 事件，自動將選中的 KaTeX 公式轉換為 LaTeX
	document.addEventListener("copy", handleCopyWithLatex);
}

/**
 * Handle copy event - convert KaTeX formulas to LaTeX source
 */
function handleCopyWithLatex(event: ClipboardEvent) {
	const selection = window.getSelection();
	if (!selection || selection.isCollapsed) return;

	const range = selection.getRangeAt(0);
	const container = document.createElement("div");
	container.appendChild(range.cloneContents());

	// 檢查是否包含 KaTeX 元素
	const katexElements = container.querySelectorAll(".katex");
	if (katexElements.length === 0) return; // 沒有公式，使用默認複製行為

	// 替換所有 KaTeX 元素為其 LaTeX 源碼
	katexElements.forEach((katex) => {
		const annotation = katex.querySelector('annotation[encoding="application/x-tex"]');
		if (annotation) {
			const latex = annotation.textContent || "";
			// 判斷是行內公式還是塊級公式
			const isBlock = katex.closest(".katex-display") !== null;
			const replacement = document.createTextNode(isBlock ? `$$${latex}$$` : `$${latex}$`);
			katex.parentNode?.replaceChild(replacement, katex);
		}
	});

	// 同時處理塊級公式容器
	const displayElements = container.querySelectorAll(".katex-display");
	displayElements.forEach((display) => {
		const annotation = display.querySelector('annotation[encoding="application/x-tex"]');
		if (annotation) {
			const latex = annotation.textContent || "";
			const replacement = document.createTextNode(`$$${latex}$$`);
			display.parentNode?.replaceChild(replacement, display);
		}
	});

	// 獲取轉換後的純文本
	const convertedText = container.textContent || "";

	// 阻止默認複製，使用我們轉換後的文本
	event.preventDefault();
	event.clipboardData?.setData("text/plain", convertedText);
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
