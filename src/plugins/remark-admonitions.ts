import type { Parent, PhrasingContent, Root } from "mdast";
import type { LeafDirective, TextDirective } from "mdast-util-directive";
import { directiveToMarkdown } from "mdast-util-directive";
import { toMarkdown } from "mdast-util-to-markdown";
import { toString as mdastToString } from "mdast-util-to-string";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { AdmonitionType } from "@/types";
import { h, isNodeDirective } from "../utils/remark";

// Supported admonition types
const Admonitions = new Set<AdmonitionType>(["tip", "note", "important", "caution", "warning", "plain"]);

/** Checks if a string is a supported admonition type. */
function isAdmonition(s: string): s is AdmonitionType {
	return Admonitions.has(s as AdmonitionType);
}

/**
 * From Astro Starlight:
 * Transforms directives not supported back to original form as it can break user content and result in 'broken' output.
 */
function transformUnhandledDirective(
	node: LeafDirective | TextDirective,
	index: number,
	parent: Parent,
) {
	const textNode = {
		type: "text",
		value: toMarkdown(node, { extensions: [directiveToMarkdown()] }),
	} as const;
	if (node.type === "textDirective") {
		parent.children[index] = textNode;
	} else {
		parent.children[index] = {
			children: [textNode],
			type: "paragraph",
		};
	}
}

export const remarkAdmonitions: Plugin<[], Root> = () => (tree) => {
	visit(tree, (node, index, parent) => {
		if (!parent || index === undefined || !isNodeDirective(node)) return;
		if (node.type === "textDirective" || node.type === "leafDirective") {
			transformUnhandledDirective(node, index, parent);
			return;
		}

		const admonitionType = node.name;
		if (!isAdmonition(admonitionType)) return;

		// Check for collapsible attribute
		// Supported: {fold}, {fold="true"}, {fold="false"}, {fold="open"}
		let isCollapsible = false;
		let defaultOpen = false;

		// Special case: 'fold' type is always collapsible by default
		if (admonitionType === "plain") {
			isCollapsible = true;
			defaultOpen = false; // collapsed by default
		}

		const foldAttr = node.attributes?.fold;
		if (foldAttr !== undefined) {
			isCollapsible = true;
			// fold="false" or fold="open" → open by default
			// fold="true" or {fold} or fold="" → collapsed by default
			if (foldAttr === "false" || foldAttr === "open") {
				defaultOpen = true;
			} else {
				defaultOpen = false; // collapsed by default
			}
		}

		let title: string = admonitionType;
		let titleNode: PhrasingContent[] = [{ type: "text", value: title }];

		// Check if there's a custom title
		const firstChild = node.children[0];
		if (
			firstChild?.type === "paragraph" &&
			firstChild.data &&
			"directiveLabel" in firstChild.data &&
			firstChild.children.length > 0
		) {
			titleNode = firstChild.children;
			title = mdastToString(firstChild.children);
			// The first paragraph contains a custom title, we can safely remove it.
			node.children.splice(0, 1);
		}

		// Create collapsible or regular admonition
		let admonition;

		if (isCollapsible) {
			// Use <details> and <summary> for collapsible
			admonition = h(
				"details",
				{
					"aria-label": title,
					class: "admonition admonition-collapsible",
					"data-admonition-type": admonitionType,
					open: defaultOpen ? true : undefined,
				},
				[
					h("summary", { class: "admonition-title" }, [...titleNode]),
					h("div", { class: "admonition-content" }, node.children),
				],
			);
		} else {
			// Regular non-collapsible admonition
			admonition = h(
				"aside",
				{ "aria-label": title, class: "admonition", "data-admonition-type": admonitionType },
				[
					h("p", { class: "admonition-title", "aria-hidden": "true" }, [...titleNode]),
					h("div", { class: "admonition-content" }, node.children),
				],
			);
		}

		parent.children[index] = admonition;
	});
};
