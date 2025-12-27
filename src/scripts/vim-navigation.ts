/**
 * Vim-style keyboard navigation
 * gg - scroll to top
 * G - scroll to bottom
 * p - copy article source code
 * Space - toggle keyboard shortcuts help
 */

let keyBuffer = "";
let keyTimeout: NodeJS.Timeout | null = null;
let helpPanelVisible = false;

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}

function scrollToBottom() {
	window.scrollTo({
		top: document.documentElement.scrollHeight,
		behavior: "smooth",
	});
}

async function copyArticleSource() {
	// Get the article element
	const article = document.querySelector('article[data-pagefind-body]');
	
	if (!article) {
		console.warn('Article element not found');
		return;
	}

	// Get MDX source code from data attribute
	const mdxSource = article.getAttribute('data-mdx-source');
	
	if (!mdxSource) {
		console.warn('MDX source not found');
		return;
	}

	try {
		// Copy to clipboard
		await navigator.clipboard.writeText(mdxSource);
		
		// Show success feedback
		showCopyFeedback();
	} catch (err) {
		// Fallback for older browsers
		fallbackCopyToClipboard(mdxSource);
	}
}

function showCopyFeedback() {
	// Create a temporary notification
	const notification = document.createElement('div');
	notification.textContent = '已複製 MDX 源代碼 ✓';
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		background: rgba(43, 188, 138, 0.9);
		color: white;
		padding: 12px 24px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		z-index: 10000;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		animation: slideInRight 0.3s ease;
	`;
	
	document.body.appendChild(notification);
	
	// Remove after 2 seconds
	setTimeout(() => {
		notification.style.animation = 'slideOutRight 0.3s ease';
		setTimeout(() => {
			document.body.removeChild(notification);
		}, 300);
	}, 2000);
}

function fallbackCopyToClipboard(text: string) {
	const textArea = document.createElement('textarea');
	textArea.value = text;
	textArea.style.position = 'fixed';
	textArea.style.left = '-999999px';
	document.body.appendChild(textArea);
	textArea.select();

	try {
		const successful = document.execCommand('copy');
		if (successful) {
			showCopyFeedback();
		}
	} catch (err) {
		console.error('Failed to copy article source:', err);
	}

	document.body.removeChild(textArea);
}

function createHelpPanel() {
	const panel = document.createElement("div");
	panel.id = "keyboard-help-panel";
	panel.className = "keyboard-help-panel";
	panel.innerHTML = `
		<div class="keyboard-help-content">
			<h3>Keyboard Shortcuts</h3>
			<div class="keyboard-shortcuts">
				<div class="shortcut-item">
					<kbd>gg</kbd>
					<span>回到顶部</span>
				</div>
				<div class="shortcut-item">
					<kbd>G</kbd>
					<span>跳到底部</span>
				</div>
				<div class="shortcut-item">
					<kbd>p</kbd>
					<span>複製文章源代碼</span>
				</div>
				<div class="shortcut-item">
					<kbd>Space</kbd>
					<span>显示/隐藏快捷键</span>
				</div>
			</div>
			<p class="help-hint">按 Space 关闭</p>
		</div>
	`;
	document.body.appendChild(panel);
	return panel;
}

function toggleHelpPanel() {
	let panel = document.getElementById("keyboard-help-panel");
	
	if (!panel) {
		panel = createHelpPanel();
	}
	
	helpPanelVisible = !helpPanelVisible;
	
	if (helpPanelVisible) {
		panel.classList.add("visible");
	} else {
		panel.classList.remove("visible");
	}
}

function handleKeyPress(e: KeyboardEvent) {
	// Ignore if typing in input fields
	const target = e.target as HTMLElement;
	if (
		target.tagName === "INPUT" ||
		target.tagName === "TEXTAREA" ||
		target.isContentEditable
	) {
		return;
	}

	// Handle Space key separately
	if (e.key === " ") {
		e.preventDefault();
		toggleHelpPanel();
		return;
	}

	// Clear previous timeout
	if (keyTimeout) {
		clearTimeout(keyTimeout);
	}

	// Add key to buffer
	keyBuffer += e.key;

	// Check for commands
	if (keyBuffer === "gg") {
		scrollToTop();
		keyBuffer = "";
	} else if (keyBuffer === "G") {
		scrollToBottom();
		keyBuffer = "";
	} else if (keyBuffer === "p") {
		copyArticleSource();
		keyBuffer = "";
	} else if (keyBuffer.length >= 2) {
		// Reset buffer if no match and already 2+ chars
		keyBuffer = e.key;
	}

	// Reset buffer after 1 second of no input
	keyTimeout = setTimeout(() => {
		keyBuffer = "";
	}, 1000);
}

// Initialize on page load
document.addEventListener("keypress", handleKeyPress);
