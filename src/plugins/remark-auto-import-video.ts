/**
 * Remark plugin to automatically inject Video component import
 * when <Video> component is used in MDX files
 */
import { visit } from "unist-util-visit";
import type { Root } from "mdast";

export function remarkAutoImportVideo() {
	return (tree: Root) => {
		let hasVideoComponent = false;
		let hasVideoImport = false;

		// Check if Video component is used
		visit(tree, (node: any) => {
			// Check for Video JSX component usage
			if (
				(node.type === "mdxJsxFlowElement" || 
				 node.type === "mdxJsxTextElement" ||
				 node.type === "mdxJsxExpressionFlowElement") &&
				node.name === "Video"
			) {
				hasVideoComponent = true;
				console.log("remarkAutoImportVideo: Found Video component");
			}
			
			// Check if import already exists  
			if (node.type === "mdxjsEsm") {
				if (node.value && node.value.includes('import Video from')) {
					hasVideoImport = true;
					console.log("remarkAutoImportVideo: Video import already exists");
				}
			}
		});

		// If Video is used but import is missing, add it
		if (hasVideoComponent && !hasVideoImport) {
			console.log("remarkAutoImportVideo: Injecting Video import");
			tree.children.unshift({
				type: "mdxjsEsm",
				value: 'import Video from "../../components/Video.astro";',
				data: {
					estree: {
						type: "Program",
						sourceType: "module",
						body: [
							{
								type: "ImportDeclaration",
								specifiers: [
									{
										type: "ImportDefaultSpecifier",
										local: { type: "Identifier", name: "Video" }
									}
								],
								source: {
									type: "Literal",
									value: "../../components/Video.astro",
									raw: '"../../components/Video.astro"'
								}
							}
						]
					}
				}
			} as any);
		} else if (!hasVideoComponent) {
			console.log("remarkAutoImportVideo: No Video component found in this file");
		}
	};
}
