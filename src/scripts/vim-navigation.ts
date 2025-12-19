/**
 * Vim-style keyboard navigation
 * gg - scroll to top
 * G - scroll to bottom
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
