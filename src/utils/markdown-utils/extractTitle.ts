// helper function to extract title from markdown content
export const extractTitleFromMarkdownContent = (content: string): string => {
	const lines = content.split('\n');
	const titleFromLines = lines.find((line) => line.trim().startsWith('# '));
	return titleFromLines ? titleFromLines.replace('# ', '').trim() : '';
};
