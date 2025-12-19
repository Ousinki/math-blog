import type { Plugin } from "unified";
import type { Root } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";

// 匹配 [visible]{tooltip} 语法，支持多行内容
// [\s\S] 匹配任何字符包括换行符
const hoverRevealRegex = /\[((?:[^\[\]]|<[^>]*>)+?)\]\{([\s\S]+?)\}/g;

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export const remarkHoverReveal: Plugin<[], Root> = () => {
	return (tree) => {
		findAndReplace(tree, [
			[
				hoverRevealRegex,
				(_match: string, visibleText: string, tooltipText: string) => {
				// Trim the entire content first
				let processed = tooltipText.trim();
				
				// Split into lines and trim each line individually
				const lines = processed.split('\n');
				
				// Remove leading/trailing whitespace from each line
				processed = lines
					.map(line => line.trim())
					.join('\n');
				
				return {
					type: "html",
					value: `<span class="hover-reveal" contenteditable="false"><span>${visibleText}</span><span class="hover-reveal-tooltip" data-visible-text="${escapeHtml(visibleText)}" data-tooltip-text="${escapeHtml(processed)}"><span dir="auto">${escapeHtml(processed)}</span></span></span>`,
				};
			},
			],
		]);
	};
};
